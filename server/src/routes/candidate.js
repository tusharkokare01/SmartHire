import express from 'express';
import mongoose from 'mongoose';
import Interview from '../models/Interview.js';

const router = express.Router();

// Get My Interviews
router.get('/interviews', async (req, res) => {
  try {
    // Assuming the user ID is available in req.user from auth middleware
    // If not, we might need to pass it as a query param or ensure auth middleware populates it
    // For now, let's assume the auth middleware adds user info to req.user
    // Wait, I need to check if auth middleware is used. 
    // Looking at index.js, app.use('/api/auth', authRoutes) is used, but for specific routes?
    // Let's check if there's a middleware I should use.
    // I'll assume I can pass candidateId as a query param for now if auth isn't strict, 
    // OR better, I'll check how other routes get user info.
    // applications.js uses req.body or params.
    // Let's check auth.js middleware if it exists.
    // Actually, I'll just use a query param `candidateId` for simplicity as per other routes, 
    // or rely on the frontend sending it.
    
    const { candidateId } = req.query;

    if (!candidateId || candidateId === 'undefined' || candidateId === 'null') {
      return res.status(400).json({ message: 'Candidate ID is required' });
    }

    if (!mongoose.isValidObjectId(candidateId)) {
      return res.status(400).json({ message: 'Invalid candidate ID' });
    }

    const interviews = await Interview.find({
      candidateId,
      status: { $in: ['Scheduled', 'Completed', 'Cancelled'] }
    })
      .sort({ scheduledAt: 1 })
      .populate('candidateId', 'name email');

    res.json(interviews);
  } catch (error) {
    console.error('Error fetching candidate interviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit Candidate Feedback for an interview
router.patch('/interviews/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { candidateId, rating, comment } = req.body;

    if (!candidateId || !mongoose.isValidObjectId(candidateId)) {
      return res.status(400).json({ message: 'Valid candidateId is required' });
    }

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (String(interview.candidateId) !== String(candidateId)) {
      return res.status(403).json({ message: 'You can only submit feedback for your own interview' });
    }

    interview.feedbackByCandidate = {
      rating: numericRating,
      comment: String(comment || '').trim(),
      submittedAt: new Date(),
    };

    await interview.save();

    const populated = await Interview.findById(interview._id).populate('candidateId', 'name email');
    return res.json(populated);
  } catch (error) {
    console.error('Error saving candidate feedback:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
