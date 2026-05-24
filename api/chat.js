export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ status: 'ok' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;

  if (!GEMINI_KEY && !GROQ_KEY) {
    return res.status(500).json({ error: 'No AI API keys configured on server' });
  }

  try {
    const { messages, systemPrompt } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    let reply;
    let usedProvider;

    // Try Gemini first
    if (GEMINI_KEY) {
      try {
        reply = await callGemini(GEMINI_KEY, messages, systemPrompt);
        usedProvider = 'Gemini';
      } catch (err) {
        console.warn('Gemini failed, trying Groq fallback:', err.message);
      }
    }

    // Fallback to Groq
    if (!reply && GROQ_KEY) {
      try {
        reply = await callGroq(GROQ_KEY, messages, systemPrompt);
        usedProvider = 'Groq';
      } catch (err) {
        return res.status(500).json({ error: `All AI providers failed. Last error: ${err.message}` });
      }
    }

    if (!reply) {
      return res.status(500).json({ error: 'All AI providers failed or are rate-limited. Please try again in a moment.' });
    }

    return res.status(200).json({ reply, provider: usedProvider });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

async function callGemini(apiKey, messages, systemPrompt) {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    }
  );

  if (!geminiRes.ok) {
    const errData = await geminiRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini error ${geminiRes.status}`);
  }

  const data = await geminiRes.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function callGroq(apiKey, messages, systemPrompt) {
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 1024
    })
  });

  if (!groqRes.ok) {
    const errData = await groqRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Groq error ${groqRes.status}`);
  }

  const data = await groqRes.json();
  return data.choices?.[0]?.message?.content || null;
}
