import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Send Message
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, subject, content } = req.body;

    const message = new Message({
      senderId,
      receiverId,
      subject,
      content,
      read: false
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Messages for a User (Inbox)
router.get('/my-messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ receiverId: userId })
      .sort({ createdAt: -1 }) // Newest first
      .populate('senderId', 'name email'); // Get sender details

    res.json(messages);
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark as Read
router.patch('/:id/read', async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Message
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Conversation (Optional for threading later)
router.get('/conversation', async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
