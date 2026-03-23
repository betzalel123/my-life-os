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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Google API Error:", data.error);
      return res.status(500).json({ error: 'Google API error', details: data.error });
    }

    if (data.candidates && data.candidates[0]) {
      const textResponse = data.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(textResponse);
      return res.status(200).json(parsedData);
    } else {
       console.error("Unexpected response format:", data);
       return res.status(500).json({ error: 'Unexpected response from Gemini' });
    }

  } catch (error) {
    console.error('Server execution error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
