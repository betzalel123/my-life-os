export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // 1) Find available models dynamically
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const listData = await listResponse.json();

    if (!listResponse.ok || !Array.isArray(listData.models)) {
      return res.status(500).json({
        error: 'Failed to list Gemini models',
        details: listData,
      });
    }

    const supportsGenerate = (model) =>
      Array.isArray(model.supportedGenerationMethods) &&
      model.supportedGenerationMethods.includes('generateContent');

    // Prefer stronger / more useful models first
    const preferredOrder = [
      'models/gemini-2.5-pro',
      'models/gemini-2.5-flash',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash',
      'models/gemini-pro',
    ];

    let selectedModel =
      preferredOrder
        .map((name) => listData.models.find((m) => m.name === name && supportsGenerate(m)))
        .find(Boolean) ||
      listData.models.find(
        (m) =>
          supportsGenerate(m) &&
          (m.name.includes('flash') || m.name.includes('pro'))
      ) ||
      listData.models.find(supportsGenerate);

    if (!selectedModel) {
      return res.status(500).json({ error: 'No supported Gemini model found' });
    }

    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${selectedModel.name}:generateContent?key=${apiKey}`;

    const generateResponse = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          topK: 32,
          maxOutputTokens: 1200,
        },
      }),
    });

    const generateData = await generateResponse.json();

    if (!generateResponse.ok || generateData.error) {
      return res.status(generateResponse.status || 500).json({
        error: 'Gemini generation failed',
        details: generateData,
      });
    }

    const rawText =
      generateData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawText) {
      return res.status(500).json({
        error: 'Empty response from Gemini',
        details: generateData,
      });
    }

    // Clean possible markdown fences
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      return res.status(200).json(parsed);
    } catch {
      // Try to extract first JSON object/array if model added extra text
      const objectMatch = cleaned.match(/\{[\s\S]*\}/);
      const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
      const jsonCandidate = objectMatch?.[0] || arrayMatch?.[0];

      if (!jsonCandidate) {
        return res.status(500).json({
          error: 'Could not parse Gemini JSON',
          rawText: cleaned,
        });
      }

      try {
        const parsed = JSON.parse(jsonCandidate);
        return res.status(200).json(parsed);
      } catch {
        return res.status(500).json({
          error: 'Invalid JSON from Gemini',
          rawText: cleaned,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
