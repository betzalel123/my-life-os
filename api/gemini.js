export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key is missing' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    // שלב 1: שואלים את גוגל אילו מודלים זמינים לך כרגע
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResponse = await fetch(listUrl);
    const listData = await listResponse.json();

    if (!listData.models || listData.models.length === 0) {
      console.error("No models found:", listData);
      return res.status(500).json({ error: 'No models available for this API key' });
    }

    // שלב 2: מוצאים את המודל הראשון שתומך ב-generateContent (עדיפות ל-flash או pro)
    const supportedModel = listData.models.find(m => 
      m.supportedGenerationMethods.includes('generateContent') && 
      (m.name.includes('flash') || m.name.includes('pro'))
    ) || listData.models.find(m => m.supportedGenerationMethods.includes('generateContent'));

    if (!supportedModel) {
      return res.status(500).json({ error: 'No suitable model found' });
    }

    console.log("Using detected model:", supportedModel.name);

    // שלב 3: שולחים את הבקשה למודל שמצאנו
    const genUrl = `https://generativelanguage.googleapis.com/v1beta/${supportedModel.name}:generateContent?key=${apiKey}`;
    const response = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      let textResponse = data.candidates[0].content.parts[0].text;
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) textResponse = jsonMatch[0];
      return res.status(200).json(JSON.parse(textResponse));
    }

    return res.status(500).json({ error: 'Invalid response from Gemini', details: data });

  } catch (error) {
    console.error('Auto-detection Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
