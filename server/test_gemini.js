import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API Key found');
    return;
  }
  
  const modelsToTest = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',
    'gemini-3-pro-preview'
  ];

  const genAI = new GoogleGenerativeAI(apiKey);

  console.log(`Using API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);

  for (const modelName of modelsToTest) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        console.log(`SUCCESS: ${modelName} is working.`);
    } catch (error) {
        let msg = error.message;
        if (msg.includes('404')) msg = '404 Not Found';
        if (msg.includes('429')) msg = '429 Quota Exceeded';
        console.log(`FAILED: ${modelName} - ${msg}`);
    }
  }
}

listModels();
