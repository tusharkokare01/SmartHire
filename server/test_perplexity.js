import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
});

async function testPerplexity() {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    console.error('Error: PERPLEXITY_API_KEY is missing');
    return;
  }
  console.log(`Using Perplexity Key: ${apiKey.substring(0, 5)}...`);

  try {
    const completion = await perplexity.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." }, 
        { role: "user", content: "Say Hello" }
      ],
      model: "sonar-pro",
    });

    console.log("SUCCESS: Perplexity Response ->", completion.choices[0].message.content);
  } catch (error) {
    console.error("FAILED: Perplexity Error ->", error.message);
  }
}

testPerplexity();
