import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Interview from './src/models/Interview.js';
import User from './src/models/User.js';

dotenv.config({ path: './.env' });

const cleanupInterviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('Connected to DB:', mongoose.connection.name);
    const allInterviews = await Interview.find();
    console.log('Total interviews:', allInterviews.length);
    allInterviews.forEach(i => console.log(i._id.toString()));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

cleanupInterviews();
