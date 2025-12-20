
import mongoose from 'mongoose';
import AssessmentResult from './server/src/models/AssessmentResult.js';
import User from './server/src/models/User.js';
import Assessment from './server/src/models/Assessment.js';
import 'dotenv/config';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/smartrecruit';

async function check() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to DB');

    const results = await AssessmentResult.find({});
    console.log(`Total AssessmentResults: ${results.length}`);
    results.forEach(r => {
      console.log(`Result ID: ${r._id}, Candidate: ${r.candidateId}, Assessment: ${r.assessmentId}, Status: ${r.status}`);
    });

    const users = await User.find({ role: 'candidate' });
    console.log(`\nTotal Candidates: ${users.length}`);
    users.forEach(u => {
      console.log(`User ID: ${u._id}, Name: ${u.name}, Email: ${u.email}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

check();
