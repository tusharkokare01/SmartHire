import express from 'express';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';

const router = express.Router();

// Create a new job application
router.post('/', async (req, res) => {
  try {
    const {
      candidateId,
      resumeId,
      jobId,
      jobTitle,
      company,
      location,
      type,
      source,
      url
    } = req.body;

    if (!candidateId || !resumeId || !jobId || !jobTitle || !company) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const application = new Application({
      candidateId,
      resumeId,
      jobId,
      jobTitle,
      company,
      location,
      type,
      source,
      url
    });

    const saved = await application.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    console.error('Error creating application:', error);
    res.status(500).json({ message: error.message || 'Server error', details: error });
  }
});

// Get all applications (or filter by candidateId)
router.get('/', async (req, res) => {
  console.log('GET /applications request received', req.query);
  try {
    const { candidateId } = req.query;
    const filter = candidateId ? { candidateId } : {};

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .populate('candidateId', 'name email')
      .populate('resumeId');

    // Return all applications, even if resume is missing
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a specific candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const applications = await Application.find({ candidateId })
      .sort({ createdAt: -1 })
      .populate('resumeId');

    res.json(applications);
  } catch (error) {
    console.error('Error fetching candidate applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status
router.patch('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['Applied', 'In Review', 'Shortlisted', 'Rejected', 'Hired', 'Interview Scheduled', 'Offer Extended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // NEW: If status is 'Rejected', cancel any scheduled interviews
    if (status === 'Rejected') {
      await Interview.updateMany(
        {
          candidateId: application.candidateId,
          status: 'Scheduled'
        },
        {
          status: 'Cancelled',
          cancellationReason: 'Application Rejected'
        }
      );
    }

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel/Delete Application
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling application:', error);
    res.status(500).json({ message: 'Server error cancelling application' });
  }
});

export default router;


