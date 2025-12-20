
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from server root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('--- Testing AI Providers ---');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
console.log('PERPLEXITY_API_KEY:', process.env.PERPLEXITY_API_KEY ? 'Present' : 'Missing');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');
console.log('----------------------------');

// Simulating the function from ai.js
async function testProviders() {
  const providers = [];

  // 1. Gemini
  if (process.env.GEMINI_API_KEY) {
    providers.push({
      name: 'Gemini (Primary)',
      test: async () => {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Say "Gemini OK"');
        return result.response.text();
      }
    });
  }

  // 2. Perplexity
  if (process.env.PERPLEXITY_API_KEY) {
    providers.push({
      name: 'Perplexity (Secondary)',
      test: async () => {
        const perplexity = new OpenAI({
          apiKey: process.env.PERPLEXITY_API_KEY,
          baseURL: 'https://api.perplexity.ai',
        });
        const completion = await perplexity.chat.completions.create({
          messages: [{ role: 'user', content: 'Say "Perplexity OK"' }],
          model: 'sonar-pro',
        });
        return completion.choices[0].message.content;
      }
    });
  }

  // 3. Groq
  if (process.env.GROQ_API_KEY) {
    providers.push({
      name: 'Groq (Tertiary)',
      test: async () => {
        const groq = new OpenAI({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: 'https://api.groq.com/openai/v1',
        });
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say "Groq OK"' }],
            model: 'llama-3.1-8b-instant',
        });
        return completion.choices[0].message.content;
      }
    });
  }

  for (const provider of providers) {
    console.log(`Testing ${provider.name}...`);
    try {
      const start = Date.now();
      const response = await provider.test();
      console.log(`✅ SUCCESS: ${provider.name} responded in ${Date.now() - start}ms`);
      console.log(`   Response: "${response.trim()}"`);
    } catch (error) {
      console.error(`❌ FAILED: ${provider.name}`);
      console.error(`   Error: ${error.message}`);
    }
    console.log('---');
  }
}

testProviders();
