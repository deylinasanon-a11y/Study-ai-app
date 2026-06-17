export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const prompt = `You are a study coach. Analyze this lecture/study material and return ONLY a JSON object (no markdown, no backticks) with this exact structure:
{
  "title": "short topic title",
  "summary": "2-3 sentence overview",
  "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
  "flashcards": [
    {"q": "question", "a": "answer"},
    {"q": "question", "a": "answer"},
    {"q": "question", "a": "answer"},
    {"q": "question", "a": "answer"},
    {"q": "question", "a": "answer"}
  ],
  "studyPlan": {
    "today": ["task1", "task2"],
    "tomorrow": ["task1", "task2"],
    "dayAfter": ["task1"],
    "nextWeek": ["task1", "task2"]
  },
  "videoQuery": "youtube search query for this topic",
  "imageQuery": "visual concept from this topic for image search"
}

Material: ${text}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
