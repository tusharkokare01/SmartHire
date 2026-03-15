import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

const router = express.Router();

/* ================================
   CONFIG
================================ */
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

// Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Groq
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

// Perplexity
const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY || '',
  baseURL: 'https://api.perplexity.ai',
});

console.log('🔑 AI Providers:', {
  Groq: !!process.env.GROQ_API_KEY,
  Gemini: !!process.env.GEMINI_API_KEY,
  Perplexity: !!process.env.PERPLEXITY_API_KEY,
});

/* ================================
   SAFE JSON EXTRACTOR
================================ */
function extractJSON(text) {
  const clean = text.replace(/```json|```/gi, '').trim();
  const startObj = clean.indexOf('{');
  const startArr = clean.indexOf('[');
  
  const start = (startObj !== -1 && startArr !== -1) 
    ? Math.min(startObj, startArr) 
    : Math.max(startObj, startArr);

  const endObj = clean.lastIndexOf('}');
  const endArr = clean.lastIndexOf(']');
  
  const end = Math.max(endObj, endArr);

  if (start === -1 || end === -1) {
    throw new Error('No JSON found');
  }
  return JSON.parse(clean.slice(start, end + 1));
}

/* ================================
   HYBRID AI CORE
   Groq → Gemini → Perplexity
================================ */
async function generateAIContent(messages, geminiPrompt) {
  // 1️⃣ GROQ (FASTEST)
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages,
      });
      return r.choices[0].message.content;
    } catch (e) {
      console.warn('Groq failed');
    }
  }

  // 2️⃣ GEMINI
  if (process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const r = await model.generateContent(geminiPrompt);
      return r.response.text();
    } catch (e) {
      console.warn('Gemini failed');
    }
  }

  // 3️⃣ PERPLEXITY
  if (process.env.PERPLEXITY_API_KEY) {
    const r = await perplexity.chat.completions.create({
      model: 'sonar-pro',
      messages,
    });
    return r.choices[0].message.content;
  }

  throw new Error('No AI provider available');
}

/* ================================
   MOCK FALLBACK
================================ */
const getMockResumeData = (role) => ({
  personalInfo: { fullName: 'Alex Morgan', email: 'alex@email.com' },
  profileSummary: `Experienced ${role}`,
  education: [],
  experience: [],
  skills: ['JavaScript', 'React'],
  projects: [],
  certifications: [],
});

/* ================================
   GENERATE RESUME
================================ */
router.post('/generate-resume', async (req, res) => {
  try {
    const { role, yearsExp, industry, currentData } = req.body;
    const years = Number(yearsExp) || 0;

    const prompt = `
    Generate a professional resume using ALL available sections.

    TARGET ROLE: ${role}
    YEARS OF EXPERIENCE: ${years}
    INDUSTRY: ${industry || 'Technology'}

    EXISTING RESUME DATA (may be partial or empty):
    ${JSON.stringify(currentData || {}, null, 2)}

    ======================
    CRITICAL INSTRUCTIONS
    ======================

    1. OUTPUT FORMAT
    - Return ONLY valid raw JSON
    - No markdown
    - No explanations
    - No comments

    2. COMPLETENESS (MANDATORY)
    You MUST generate content for ALL of the following sections:
    - personalInfo
    - profileSummary
    - education
    - experience
    - projects
    - certifications
    - skills
    - languages
    - strengths
    - achievements
    - extraSections

    DO NOT leave sections empty unless explicitly forbidden below.

    3. PROFILE SUMMARY RULES (VERY IMPORTANT)
    - Write 3 to 5 full sentences
    - Mention:
      - Professional role
      - Years of experience
      - Core skills/tools
      - Type of impact or achievements
    - Use confident, professional language
    - Do NOT write one-line summaries

    4. EXPERIENCE RULES
    For EACH experience entry:
    - Include at least 3 bullet points
    - Each bullet must:
      - Start with a strong action verb
      - Describe responsibility + impact
    - Use measurable outcomes where possible
    - Use ATS-friendly keywords
    
    If experience data is missing:
    - Generate realistic, role-appropriate professional experience
    - Do NOT invent company names that look fake
    - Use generic but believable names like "Technology Solutions Ltd."

    5. PROJECTS RULES (NON-NEGOTIABLE)
    Projects MUST always exist.
    For EACH project:
    - "name" MUST NOT be empty
    - "description" MUST contain 2–3 bullet points
    - "technologies" MUST be present and realistic

    If no projects are provided:
    - Create 2–3 professional sample projects
    - Base them on the target role and industry

    6. SKILLS & TOOLS RULES
    - Minimum 10–15 skills
    - Mix of:
      - Technical skills
      - Tools
      - Frameworks
      - Methodologies
    - Skills must be relevant to the role

    7. EDUCATION RULES
    - If education exists, expand it clearly
    - If education is missing:
      - DO NOT invent degrees
      - Leave education array empty

    8. CERTIFICATIONS RULES
    - Include certifications only if provided
    - DO NOT invent certifications

    9. SAFE GAP-FILLING POLICY
    You MAY:
    - Expand descriptions
    - Improve wording
    - Add realistic projects
    - Add industry-standard skills

    You MUST NOT:
    - Invent degrees
    - Invent universities
    - Invent certifications
    - Invent exact dates if not provided

    10. QUALITY STANDARD (STRICT)
    If any section looks weak, generic, or recruiter-unfriendly:
    - Rewrite it
    - Expand it
    - Improve clarity and professionalism

    ======================
    OUTPUT JSON STRUCTURE
    ======================

    {
      "personalInfo": {
        "fullName": "",
        "email": "",
        "phone": "",
        "address": "",
        "linkedin": "",
        "github": ""
      },
      "profileSummary": "",
      "education": [
        {
          "degree": "",
          "institution": "",
          "year": "",
          "gpa": ""
        }
      ],
      "experience": [
        {
          "title": "",
          "company": "",
          "duration": "",
          "description": "• Bullet point\\n• Bullet point\\n• Bullet point"
        }
      ],
      "projects": [
        {
          "name": "",
          "description": "• Bullet point\\n• Bullet point",
          "technologies": "",
          "link": ""
        }
      ],
      "certifications": [
        {
          "name": "",
          "issuer": "",
          "year": ""
        }
      ],
      "skills": [],
      "languages": ["English"],
      "strengths": [],
      "achievements": [],
      "extraSections": [
        {
          "title": "",
          "items": []
        }
      ]
    }

    REMEMBER:
    Return ONLY valid raw JSON.
    No markdown.
    `;

    const messages = [
      { role: 'system', content: 'You are an expert resume writer.' },
      { role: 'user', content: prompt },
    ];

    const text = await generateAIContent(messages, prompt);
    const data = extractJSON(text);

    res.json(data);
  } catch (err) {
    console.warn('Resume AI failed → mock used');
    res.json(getMockResumeData(req.body.role || 'Software Engineer'));
  }
});

/* ================================
   SCORE RESUME (ATS)
================================ */
router.post('/score-resume', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Missing input' });
    }

    const prompt = `
Compare this resume with the job description.

RESUME:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Return ONLY JSON:
{
  "matchScore": [0-100],
  "missingKeywords": [],
  "tips": [],
  "summary": ""
}
`;

    const messages = [
      { role: 'system', content: 'You are an ATS analyzer.' },
      { role: 'user', content: prompt },
    ];

    const text = await generateAIContent(messages, prompt);
    const result = extractJSON(text);

    res.json(result);
  } catch (e) {
    res.json({
      matchScore: 0,
      missingKeywords: [],
      tips: ['AI unavailable'],
      summary: 'Analysis failed',
    });
  }
});

/* ================================
   INTERVIEW QUESTIONS
================================ */
router.post('/generate-questions', async (req, res) => {
  try {
    const { role, skills } = req.body;

    const prompt = `
    Generate 5 interview questions for a ${role}.
    Skills: ${skills}

    Return a JSON ARRAY with items: { "id": number, "text": "question text", "type": "Technical/Behavioral" }
    `;

    const messages = [
      { role: 'system', content: 'You are a technical interviewer.' },
      { role: 'user', content: prompt },
    ];

    const text = await generateAIContent(messages, prompt);
    // Use robust extraction if available, otherwise cleaner parse
    let data; 
    try {
        data = extractJSON(text);
    } catch (e) {
        data = JSON.parse(text.replace(/```json|```/gi, ''));
    }
    
    res.json(data);
  } catch (err) {
    console.warn('Questions AI failed → mock used');
    res.json([
      { id: 'm1', text: `Tell me about your experience as a ${req.body.role || 'candidate'}.`, type: 'Introduction', isMock: true },
      { id: 'm2', text: `What are your key strengths in ${req.body.skills || 'your field'}?`, type: 'Technical', isMock: true },
      { id: 'm3', text: 'Describe a challenging project you worked on.', type: 'Behavioral', isMock: true },
      { id: 'm4', text: 'How do you handle tight deadlines?', type: 'Behavioral', isMock: true },
      { id: 'm5', text: 'Where do you see yourself in 5 years?', type: 'General', isMock: true }
    ]);
  }
});

/* ================================
   EVALUATE INTERVIEW ANSWER
   ================================ */
router.post('/evaluate-interview', async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) { 
        // Fallback for empty inputs
        return res.json({
            overallRating: 0,
            confidenceScore: 0,
            clarityScore: 0,
            relevanceScore: 0,
            suggestions: ["Please provide an answer to evaluate."],
            idealAnswer: "N/A"
        });
    }

    const prompt = `
    Evaluate this interview answer a strictly not much but strictly .
    
    Question: "${question}"
    Answer: "${answer}"
    
    Return JSON:
    {
      "overallRating": number (0-100),
      "confidenceScore": number (0-100),
      "clarityScore": number (0-100),
      "relevanceScore": number (0-100),
      "suggestions": ["suggestion1", "suggestion2"],
      "idealAnswer": "A better way to answer..."
    }
    `;

    const messages = [
      { role: 'system', content: 'You are an expert interview coach.' },
      { role: 'user', content: prompt },
    ];

    const text = await generateAIContent(messages, prompt);
    const data = extractJSON(text);
    res.json(data);
  } catch (error) {
    console.error('Evaluation failed:', error);
    // Mock Fallback prevents 500 crashes
    res.json({
      overallRating: 75,
      confidenceScore: 60,
      clarityScore: 60,
      relevanceScore: 65,
      suggestions: ["Speak more confidently", "Provide specific examples"],
      idealAnswer: "A structured answer using the STAR method..."
    });
  }
});

/* ================================
   GENERATE ASSESSMENT (MCQ)
   ================================ */
router.post('/generate-mcq', async (req, res) => {
  try {
    const { topic, difficulty, questionCount } = req.body;
    
    // Validate Input
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const count = questionCount || 5;
    const diff = difficulty || 'Intermediate';

    const prompt = `
    Generate ${count} multiple-choice questions (MCQs) on the topic: "${topic}".
    Difficulty Level: ${diff}.
    
    Return JSON ARRAY. Each object must have:
    - id: number
    - question: string
    - options: array of 4 strings
    - correctAnswer: index of correct option (0-3) (number)
    
    Example:
    [
      {
        "id": 1,
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1
      }
    ]
    `;

    const messages = [
      { role: 'system', content: 'You are an assessment expert.' },
      { role: 'user', content: prompt },
    ];

    const text = await generateAIContent(messages, prompt);
    const data = extractJSON(text);

    // Frontend expects { questions: [...] }
    if (Array.isArray(data)) {
        res.json({ questions: data });
    } else {
        // If AI returned an object (e.g. { questions: [] }), pass it through
        res.json(data);
    }

  } catch (error) {
    console.warn('Assessment AI failed → using mock fallback');
    // Fallback Mock Data
    res.json({
      questions: [
        {
          id: 1,
          question: `What is a key concept in ${req.body.topic || 'this field'}?`,
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "Which of the following is true?",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Identify the incorrect statement.",
          options: ["Statement X", "Statement Y", "Statement Z", "Statement W"],
          correctAnswer: 2
        },
        {
          id: 4,
          question: "What comes next in the process?",
          options: ["Step 1", "Step 2", "Step 3", "Step 4"],
          correctAnswer: 3
        },
        {
          id: 5,
          question: `Advanced application of ${req.body.topic || 'topic'}:`,
          options: ["Case 1", "Case 2", "Case 3", "Case 4"],
          correctAnswer: 0
        }
      ]
    });
  }
});

/* ================================
   COVER LETTER
================================ */
router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { resumeData, jobTitle, companyName } = req.body;

    const prompt = `
Write a professional cover letter for ${jobTitle} at ${companyName}.
Use resume data below.

${JSON.stringify(resumeData)}
`;

    const messages = [
      { role: 'system', content: 'You are a career coach.' },
      { role: 'user', content: prompt },
    ];

    const text = await generateAIContent(messages, prompt);
    res.json({ coverLetter: text });
  } catch {
    res.json({ coverLetter: 'AI unavailable.' });
  }
});

/* ================================
   CAREER COACH CHAT
   ================================ */
router.post('/career-coach', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare Messages for Groq/Perplexity
    const messages = [
      { role: 'system', content: 'You are an expert career coach. Provide helpful, encouraging, and actionable career advice. Keep answers concise (under 200 words) where possible.' },
      ...(history || []).map(msg => ({ 
        role: msg.role === 'assistant' ? 'assistant' : 'user', 
        content: msg.content 
      })),
      { role: 'user', content: message }
    ];

    // Prepare Prompt for Gemini
    const historyText = (history || []).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const geminiPrompt = `
      You are an expert career coach.
      
      CONVERSATION HISTORY:
      ${historyText}
      
      USER: ${message}
      
      Respond as the career coach.
    `;

    const text = await generateAIContent(messages, geminiPrompt);
    res.json({ reply: text });

  } catch (error) {
    console.error('Career Coach Error:', error);
    res.status(500).json({ 
      reply: "I'm having trouble connecting to my brain right now. Please try again in a moment." 
    });
  }
});

export default router;
