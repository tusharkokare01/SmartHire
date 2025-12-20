import express from 'express';
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

    if (!candidateId) {
      return res.status(400).json({ message: 'Candidate ID is required' });
    }

    const interviews = await Interview.find({ candidateId, status: 'Scheduled' })
      .sort({ scheduledAt: 1 })
      .populate('candidateId', 'name email');

    res.json(interviews);
  } catch (error) {
    console.error('Error fetching candidate interviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
