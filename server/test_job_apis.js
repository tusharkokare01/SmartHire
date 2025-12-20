import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testAPIs() {
  console.log('Testing Job Search APIs...\n');

  // 1. Remotive
  try {
    console.log('1. Testing Remotive API...');
    const remotiveUrl = 'https://remotive.com/api/remote-jobs?limit=1';
    const start = Date.now();
    const res = await axios.get(remotiveUrl);
    console.log(`✅ Remotive: Success (${Date.now() - start}ms)`);
    console.log(`   Sample Job: ${res.data.jobs?.[0]?.title}`);
  } catch (error) {
    console.error('❌ Remotive: Failed');
    console.error(`   Error: ${error.message}`);
  }
  console.log('-----------------------------------');

  // 2. The Muse
  try {
    console.log('2. Testing The Muse API...');
    const museUrl = 'https://www.themuse.com/api/public/jobs?page=0';
    const start = Date.now();
    const res = await axios.get(museUrl);
    console.log(`✅ The Muse: Success (${Date.now() - start}ms)`);
    console.log(`   Sample Job: ${res.data.results?.[0]?.name}`);
  } catch (error) {
    console.error('❌ The Muse: Failed');
    console.error(`   Error: ${error.message}`);
  }
  console.log('-----------------------------------');

  // 3. Adzuna (Check Keys only)
  console.log('3. Checking Adzuna Configuration...');
  const appId = process.env.VITE_ADZUNA_APP_ID;
  const appKey = process.env.VITE_ADZUNA_APP_KEY;
  
  if (appId && appKey) {
     console.log('✅ Adzuna: Keys found in environment');
     // Optional: Try a real call if keys exist
     try {
       const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=1`;
        const res = await axios.get(adzunaUrl);
        console.log(`✅ Adzuna API: Reachable`);
     } catch(e) {
        console.error(`❌ Adzuna API: Failed (${e.message})`);
     }

  } else {
     console.error('❌ Adzuna: Keys MISSING in environment variables');
  }

}

testAPIs();
