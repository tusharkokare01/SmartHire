import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import hrRoutes from './routes/hr.js';
import resumeRoutes from './routes/resume.js';
import applicationRoutes from './routes/applications.js';
import jobRoutes from './routes/jobs.js';
import candidateRoutes from './routes/candidate.js';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/SmartCareerHub';

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

app.get('/', (req, res) => {
  res.json({ status: 'Smart Career hub API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidate', candidateRoutes);
import messageRoutes from './routes/messages.js';
import assessmentRoutes from './routes/assessments.js';
app.use('/api/messages', messageRoutes);
app.use('/api/assessments', assessmentRoutes);
import paymentRoutes from './routes/paymentRoutes.js';
app.use('/api/payment', paymentRoutes);
import feedbackRoutes from './routes/feedback.js';
app.use('/api/feedback', feedbackRoutes);

// Serve React frontend static files
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));

// Catch-all: send index.html for any non-API route (fixes 404 on refresh)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// Using gemini-2.0-flash model



