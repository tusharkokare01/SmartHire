import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// Mask key for logging
const groqKey = process.env.GROQ_API_KEY || '';
console.log('Using Groq Key:', groqKey ? `${groqKey.slice(0, 8)}...` : 'MISSING');

const client = new OpenAI({
  apiKey: groqKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function testGroq() {
  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant', // High quota / fast model
      messages: [
        { role: 'user', content: 'Hello, are you working?' },
      ],
    });

    console.log('SUCCESS: Groq Response ->', response.choices[0].message.content);
  } catch (error) {
    console.error('ERROR: Groq Test Failed ->', error.message);
    if (error.response) {
       console.error('Details:', error.response.data);
    }
  }
}

testGroq();
