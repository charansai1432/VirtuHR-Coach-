import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const fetchAIResponse = async (question, answer) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('❌ OpenRouter API key is missing in environment variables.');
    return "I'm currently unable to provide feedback due to missing API credentials.";
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'qwen/qwen3-235b-a22b',
        messages: [
      { role: 'system', content: 'You are an HR feedback coach. Give concise feedback in no more than 4 lines.' },
      { role: 'user', content: `Give feedback on the following response.\n\nQuestion: ${question}\nResponse: ${answer}` }
    ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          // Optional headers:
          // 'HTTP-Referer': 'https://your-domain.com/',
          // 'X-Title': 'Virtual HR Coach'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    // 🔍 Log structured error
    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ AI response error:`, { status, data });

      if (status === 401) {
        return "Your API key is invalid or expired. Please check your OpenRouter credentials.";
      } else if (status === 402) {
        return "You've run out of credits. Please top up your OpenRouter account to continue using AI feedback.";
      } else if (status === 429) {
        return "You're sending requests too quickly. Please slow down and try again.";
      } else {
        return "I'm currently unable to provide feedback due to a server error.";
      }
    } else {
      // 🔌 Network or unknown error
      console.error('❌ AI request failed:', error.message);
      return "Something went wrong while generating feedback. Please check your network and try again.";
    }
  }
};
