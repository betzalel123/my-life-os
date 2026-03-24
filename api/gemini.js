export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResponse = await fetch(listUrl);
    const listData = await listResponse.json();

    if (!listData.models || !Array.isArray(listData.models) || listData.models.length === 0) {
      console.error('No models available:', listData);
      return res.status(500).json({ error: 'No models available' });
    }

    const bestModel =
      listData.models.find(
        (m) =>
          m.supportedGenerationMethods?.includes('generateContent') &&
          m.name?.includes('1.5-pro')
      ) ||
      listData.models.find(
        (m) =>
          m.supportedGenerationMethods?.includes('generateContent') &&
          m.name?.includes('1.5-flash')
      ) ||
      listData.models.find((m) =>
        m.supportedGenerationMethods?.includes('generateContent')
      );

    if (!bestModel) {
      console.error('No suitable model found:', listData.models);
      return res.status(500).json({ error: 'No suitable model found' });
    }

    console.log('Using Gemini model:', bestModel.name);

    const genUrl = `https://generativelanguage.googleapis.com/v1beta/${bestModel.name}:generateContent?key=${apiKey}`;

    const response = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.95
        }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('Google API Error:', JSON.stringify(data, null, 2));
      return res.status(response.status || 500).json({
        error: data?.error?.message || 'Google API error'
      });
    }

    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error('Invalid Gemini response:', JSON.stringify(data, null, 2));
      return res.status(500).json({ error: 'Invalid response from Gemini' });
    }

    let cleaned = textResponse.trim();

    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      cleaned = objectMatch[0];
    }

    const parsedData = JSON.parse(cleaned);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Gemini server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
