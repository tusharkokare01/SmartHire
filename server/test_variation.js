
// Native fetch is available in Node 18+

const BASE_URL = 'http://localhost:5000/api/ai';

const sampleResume = {
  personalInfo: { fullName: "Test User", email: "test@example.com" },
  skills: ["JavaScript", "React", "Node.js", "Python"],
  experience: [{ title: "Software Engineer", company: "Test Co", duration: "2 years", description: "Built web apps." }]
};

const jobDescription1 = "We need a React developer with Node.js experience.";
const jobDescription2 = "We need a Python Data Scientist with Machine Learning experience.";

async function testScore(jd, label) {
  console.log(`\n--- Testing ${label} ---`);
  const startTime = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/score-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeData: sampleResume,
        jobDescription: jd
      })
    });

    const data = await response.json();
    const duration = Date.now() - startTime;
    
    console.log(`Status: ${response.status}`);
    console.log(`Time: ${duration}ms`);
    console.log('Match Score:', data.matchScore);
    console.log('Provider Summary:', data.summary);
    console.log('Full Response:', JSON.stringify(data, null, 2));
    
    if (data.matchScore) {
        console.log("✅ Score received.");
    } else {
        console.log("❌ No score in response.");
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function run() {
  console.log("Starting Variation Test...");
  await testScore(jobDescription1, "JD 1 (High Match Expected)");
  await testScore(jobDescription2, "JD 2 (Low Match Expected)");
}

run();
