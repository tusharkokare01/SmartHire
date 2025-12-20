import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Interview from './src/models/Interview.js';
import User from './src/models/User.js';

dotenv.config({ path: './.env' });
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const debugInterviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const interviews = await Interview.find().populate('candidateId', 'name email');
    
    console.log(`Total Interviews: ${interviews.length}`);
    
    interviews.forEach(i => {
      console.log('---------------------------------------------------');
      console.log(`ID: ${i._id}`);
      console.log(`Candidate: ${i.candidateId?.name} (${i.candidateId?.email})`);
      console.log(`Role: ${i.jobRole}`);
      console.log(`Status: ${i.status}`);
      console.log(`Platform: ${i.platform}`);
      console.log(`Link: ${i.meetingLink}`);
      console.log(`Scheduled At: ${i.scheduledAt}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

debugInterviews();
