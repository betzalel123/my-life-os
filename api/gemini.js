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

    const candidateModels = listData.models.filter(
      (m) =>
        m.supportedGenerationMethods?.includes('generateContent') &&
        (
          m.name?.includes('2.5-flash') ||
          m.name?.includes('2.0-flash') ||
          m.name?.includes('1.5-flash') ||
          m.name?.includes('1.5-pro')
        )
    );

    const modelsToTry =
      candidateModels.length > 0
        ? candidateModels
        : listData.models.filter((m) =>
            m.supportedGenerationMethods?.includes('generateContent')
          );

    let lastError = null;

    for (const model of modelsToTry) {
      try {
        console.log('Trying Gemini model:', model.name);

        const genUrl = `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${apiKey}`;

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
          lastError = data;

          const status = data?.error?.status;
          const message = data?.error?.message || '';

          // אם זו מכסה שנגמרה — ננסה מודל אחר
          if (status === 'RESOURCE_EXHAUSTED' || response.status === 429) {
            console.warn(`Quota exhausted for ${model.name}, trying next model...`);
            continue;
          }

          // אם המודל לא קיים / לא נתמך — ננסה מודל אחר
          if (status === 'NOT_FOUND' || response.status === 404) {
            console.warn(`Model not found ${model.name}, trying next model...`);
            continue;
          }

          // שגיאה אחרת — נמשיך לזכור אותה
          console.error('Google API Error:', JSON.stringify(data, null, 2));
          continue;
        }

        const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
          lastError = data;
          console.error('Invalid response from Gemini:', JSON.stringify(data, null, 2));
          continue;
        }

        let cleaned = textResponse.trim();
        cleaned = cleaned
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```$/i, '')
          .trim();

        const objectMatch = cleaned.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          cleaned = objectMatch[0];
        }

        const parsedData = JSON.parse(cleaned);
        return res.status(200).json(parsedData);
      } catch (innerError) {
        lastError = innerError;
        console.error(`Model attempt failed for ${model.name}:`, innerError);
      }
    }

    // אם הגענו לפה, כל המודלים נכשלו
    const errorMessage =
      lastError?.error?.message ||
      lastError?.message ||
      'All Gemini model attempts failed';

    const errorStatus =
      lastError?.error?.status ||
      'UNKNOWN_ERROR';

    // מחזירים 429 אם זו באמת בעיית quota
    if (
      errorStatus === 'RESOURCE_EXHAUSTED' ||
      String(errorMessage).includes('quota') ||
      String(errorMessage).includes('Quota exceeded')
    ) {
      return res.status(429).json({
        error: 'quota_exceeded',
        message: errorMessage
      });
    }

    return res.status(500).json({
      error: 'gemini_failed',
      message: errorMessage
    });
  } catch (error) {
    console.error('Gemini server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
