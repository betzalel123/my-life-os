export default async function handler(req, res) {
  // מוודאים שזו בקשת POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing in Vercel settings' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // שימוש בנתיב v1 ובמודל 1.5-flash שנחשב להכי יציב ומהיר כיום
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    const data = await response.json();

    // טיפול בשגיאות מצד גוגל
    if (!response.ok || data.error) {
      console.error("Google API Error Detail:", JSON.stringify(data.error, null, 2));
      return res.status(response.status || 500).json({ 
        error: 'Google API error', 
        message: data.error?.message || 'Unknown error' 
      });
    }

    // שליפת הטקסט והפיכתו ל-JSON עבור האפליקציה
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const textResponse = data.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(textResponse);
      return res.status(200).json(parsedData);
    } else {
      console.error("Unexpected Structure:", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: 'Invalid response structure from Gemini' });
    }

  } catch (error) {
    console.error('Server Crash:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
