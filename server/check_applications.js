import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from './src/models/Application.js';
import User from './src/models/User.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/smartrecruit';

mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const count = await Application.countDocuments();
    console.log(`Total Applications: ${count}`);

    if (count > 0) {
      const apps = await Application.find().populate('candidateId', 'name email').limit(5);
      console.log('Sample Applications:', JSON.stringify(apps, null, 2));
    } else {
      console.log('No applications found. You might need to seed data.');
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
