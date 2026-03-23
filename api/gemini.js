export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key is missing' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    // שלב 1: שואלים את גוגל אילו מודלים זמינים
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResponse = await fetch(listUrl);
    const listData = await listResponse.json();

    if (!listData.models || listData.models.length === 0) {
      return res.status(500).json({ error: 'No models available' });
    }

    // שלב 2: ניסיון למצוא את המודל הכי חזק (Pro)
    // אם אין Pro, נחפש Flash, ואם אין - ניקח את הראשון שיוצר תוכן
    const bestModel = listData.models.find(m => m.name.includes('1.5-pro')) || 
                      listData.models.find(m => m.name.includes('1.5-flash')) ||
                      listData.models.find(m => m.supportedGenerationMethods.includes('generateContent'));

    console.log("🚀 Switching to Power Mode. Using model:", bestModel.name);

    // שלב 3: שליחת הבקשה למודל החזק
    const genUrl = `https://generativelanguage.googleapis.com/v1beta/${bestModel.name}:generateContent?key=${apiKey}`;
    const response = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }],
        // מוסיפים הגדרות יצירתיות נמוכות כדי שיהיה יותר עקבי ומדויק
        generationConfig: {
          temperature: 0.1, // הופך אותו ליותר ממוקד ופחות "יצירתי" מדי בסיווגים
          topP: 0.95,
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      let textResponse = data.candidates[0].content.parts[0].text;
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) textResponse = jsonMatch[0];
      return res.status(200).json(JSON.parse(textResponse));
    }

    return res.status(500).json({ error: 'Invalid response', details: data });

  } catch (error) {
    console.error('Gemini Pro Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
