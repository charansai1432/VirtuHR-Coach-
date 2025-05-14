
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const API_KEY = process.env.OPENROUTER_API_KEY;

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
        model: 'anthropic/claude-3-sonnet',
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
