import express from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

const router = express.Router();

// Create a new job
router.post('/', async (req, res) => {
  try {
    let jobData = req.body;

    // Validate postedBy or assign default
    if (!jobData.postedBy || !mongoose.Types.ObjectId.isValid(jobData.postedBy)) {
      console.log('Invalid or missing postedBy, assigning default user');
      const defaultUser = await User.findOne({ role: 'hr' }) || await User.findOne();
      if (defaultUser) {
        jobData.postedBy = defaultUser._id;
      } else {
        return res.status(400).json({ message: 'No user found to assign job to' });
      }
    }

    const job = new Job(jobData);
    const savedJob = await job.save();

    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error creating job', error: error.message });
  }
});

// Get all open jobs (for candidates)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Open' })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name company');

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// Get jobs posted by specific HR user
// Get jobs posted by specific HR user
router.get('/hr/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Get jobs as POJOs to allow modification
    const jobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 }).lean();

    // Dynamically count applicants for each job
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const jobIdStr = job._id.toString();
      const count = await Application.countDocuments({ jobId: jobIdStr });
      return { ...job, applicantsCount: count };
    }));

    res.json(jobsWithCounts);
  } catch (error) {
    console.error('Error fetching HR jobs:', error);
    res.status(500).json({ message: 'Server error fetching HR jobs' });
  }
});

// Get single job details
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job status (Close/Open)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error updating job' });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error deleting job' });
  }
});

export default router;
