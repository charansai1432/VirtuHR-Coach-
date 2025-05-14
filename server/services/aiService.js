import axios from 'axios';

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const fetchAIResponse = async (question, userAnswer) => {
  if (!API_KEY) {
    console.error('❌ API key missing');
    return "Unable to generate feedback. API credentials are missing.";
  }
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'openai/gpt-4.1',
        max_tokens: 150,
        messages: [
          {
            role: 'system',
            content: `You are Neha, a friendly HR coach. You provide supportive, encouraging feedback.`,
          },
          {
            role: 'user',
            content: `The user answered: "${userAnswer}" for the question: "${question}".\n
If the answer is good, praise them.
If it needs improvement, gently coach them.
Always sound encouraging and supportive.

Limit your response to 150 words.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log full response
    console.log('Full OpenRouter response:', JSON.stringify(response.data, null, 2));

    // Defensive check
    if (
      response.data &&
      Array.isArray(response.data.choices) &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message
    ) {
      return response.data.choices[0].message.content;
    } else {
      console.error("AI response missing 'choices' or 'message':", response.data);
      return "Sorry, I couldn't generate feedback right now.";
    }
  } catch (error) {
    console.error('Error fetching AI response:', error?.response?.data || error.message || error);
    return "I couldn't generate feedback right now. Let's continue with our practice session.";
  }
};
