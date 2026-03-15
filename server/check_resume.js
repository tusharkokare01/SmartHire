import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resume from './src/models/Resume.js';
import Application from './src/models/Application.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/Smart Career hub';

mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get an application
    const app = await Application.findOne();
    if (app) {
      console.log('Application found:', app._id);
      console.log('Resume ID in App:', app.resumeId);
      
      // Check if resume exists
      const resume = await Resume.findById(app.resumeId);
      console.log('Resume found:', resume ? 'Yes' : 'No');
      if (resume) {
        console.log('Resume Skills:', resume.skills);
      }
    } else {
      console.log('No applications found');
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });

