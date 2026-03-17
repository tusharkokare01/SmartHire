import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';
import UserFeedback from '../models/UserFeedback.js';

const router = express.Router();

const isManagerRole = (role) => role === 'hr' || role === 'admin';

const getRequester = async (req) => {
  if (!req.user?.userId) return null;
  return User.findById(req.user.userId).select('role');
};

// Submit feedback/suggestion by logged-in user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, subject, message, rating } = req.body;

    const cleanSubject = String(subject || '').trim();
    const cleanMessage = String(message || '').trim();

    if (!cleanSubject || !cleanMessage) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const user = await User.findById(req.user.userId).select('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const parsedRating = rating === undefined || rating === null || rating === ''
      ? undefined
      : Number(rating);

    if (parsedRating !== undefined && (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const feedback = await UserFeedback.create({
      userId: req.user.userId,
      role: user.role,
      type,
      subject: cleanSubject,
      message: cleanMessage,
      rating: parsedRating,
    });

    return res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List feedback for currently logged-in user
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const entries = await UserFeedback.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(entries);
  } catch (error) {
    console.error('Error fetching feedback history:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List all feedback (HR/Admin only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const requester = await getRequester(req);
    if (!requester || !isManagerRole(requester.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, type, search = '', limit = 20, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (type && type !== 'All') query.type = type;

    const trimmedSearch = String(search || '').trim();
    if (trimmedSearch) {
      query.$or = [
        { subject: { $regex: trimmedSearch, $options: 'i' } },
        { message: { $regex: trimmedSearch, $options: 'i' } },
      ];
    }

    const safeLimit = Math.min(Number(limit) || 50, 200);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [entries, total] = await Promise.all([
      UserFeedback.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate('userId', 'name email role'),
      UserFeedback.countDocuments(query)
    ]);

    return res.json({
      items: entries,
      total,
      page: safePage,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
      limit: safeLimit,
    });
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update feedback status (HR/Admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const requester = await getRequester(req);
    if (!requester || !isManagerRole(requester.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Reviewed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Allowed values: New, Reviewed' });
    }

    const updated = await UserFeedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email role');

    if (!updated) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
