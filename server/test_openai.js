import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY is missing');
    return;
  }
  console.log(`Using OpenAI Key: ${apiKey.substring(0, 5)}...`);

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: "Say Hello" }],
      model: "gpt-3.5-turbo",
    });

    console.log("SUCCESS: OpenAI Response ->", completion.choices[0].message.content);
  } catch (error) {
    console.error("FAILED: OpenAI Error ->", error.message);
  }
}

testOpenAI();
