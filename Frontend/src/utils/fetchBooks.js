// src/utils/fetchBooks.js
export const fetchSelfHelpBooks = async (API_KEY) => {
const prompt = `
Recommend a list of 5 self-help books focused on self-motivation, anxiety, and depression coping.

Return a raw JSON array only, without markdown formatting, triple backticks, or any explanation.

Each book object must contain the following fields:
- title
- author
- description
- image (cover image URL)
`;

  const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'Mental Health Assistant',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1:free',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await aiResponse.json(); //

  const text = data?.choices?.[0]?.message?.content;

  try {
    return JSON.parse(text);
  } catch {
    console.error("Failed to parse AI response:", text);
    return [];
  }
};
