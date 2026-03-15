import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Resume from './src/models/Resume.js';
import Application from './src/models/Application.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/Smart Career hub';

mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const apps = await Application.find()
      .populate('candidateId')
      .populate('resumeId');
      
    console.log(`Total Applications: ${apps.length}`);
    
    apps.forEach(app => {
      console.log(`App ID: ${app._id}`);
      console.log(`- Candidate: ${app.candidateId ? 'Found' : 'MISSING'}`);
      console.log(`- Resume: ${app.resumeId ? 'Found' : 'MISSING'}`);
      console.log(`- Status: ${app.status}`);
    });

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });

