function extractStructuredJson(data) {
  // הכי פשוט: אם יש output_text והוא JSON
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return JSON.parse(data.output_text);
  }

  // fallback למבנה output
  if (Array.isArray(data?.output)) {
    for (const item of data.output) {
      if (!Array.isArray(item?.content)) continue;

      for (const part of item.content) {
        if (part?.type === 'output_text' && typeof part?.text === 'string') {
          return JSON.parse(part.text);
        }

        if (typeof part?.text === 'string' && part.text.trim()) {
          return JSON.parse(part.text);
        }
      }
    }
  }

  throw new Error('No structured JSON found in OpenAI response');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'missing_api_key',
      message: 'OPENAI_API_KEY is missing'
    });
  }

  const { prompt, messages, model, schemaName, schema } = req.body || {};

  if (!prompt && !Array.isArray(messages)) {
    return res.status(400).json({
      error: 'invalid_request',
      message: 'Provide either "prompt" or "messages"'
    });
  }

  if (!schema || typeof schema !== 'object') {
    return res.status(400).json({
      error: 'missing_schema',
      message: 'You must provide a JSON schema in req.body.schema'
    });
  }

  const input = Array.isArray(messages)
    ? messages
    : [
        {
          role: 'user',
          content: prompt
        }
      ];

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'gpt-4.1-mini',
        input,
        text: {
          format: {
            type: 'json_schema',
            name: schemaName || 'structured_response',
            schema,
            strict: true
          }
        }
      })
    });

    const requestId = response.headers.get('x-request-id');
    const data = await response.json();

    if (!response.ok || data?.error) {
      console.error('OpenAI API Error:', {
        requestId,
        status: response.status,
        data
      });

      return res.status(response.status || 500).json({
        error: data?.error?.code || 'openai_failed',
        message: data?.error?.message || 'OpenAI request failed',
        requestId
      });
    }

    try {
      const parsed = extractStructuredJson(data);
      return res.status(200).json(parsed);
    } catch (parseError) {
      console.error('Structured parse error:', {
        requestId,
        parseError: parseError.message,
        data
      });

      return res.status(500).json({
        error: 'invalid_structured_output',
        message: 'Model did not return valid structured JSON',
        requestId
      });
    }
  } catch (error) {
    console.error('OpenAI server error:', error);

    return res.status(500).json({
      error: 'internal_server_error',
      message: error.message || 'Internal server error'
    });
  }
}
