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
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
        // הסרנו את ה-generationConfig שגרם לשגיאה
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Google API Error:", JSON.stringify(data.error, null, 2));
      return res.status(response.status || 500).json({ error: data.error?.message || 'API Error' });
    }

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      let textResponse = data.candidates[0].content.parts[0].text;
      
      // פונקציית ניקוי: אם ג'מיני מחזיר ```json ... ``` אנחנו מנקים את זה
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        textResponse = jsonMatch[0];
      }

      const parsedData = JSON.parse(textResponse);
      return res.status(200).json(parsedData);
    } else {
      return res.status(500).json({ error: 'Invalid response structure' });
    }

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
