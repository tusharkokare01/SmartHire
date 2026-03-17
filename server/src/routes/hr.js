import express from 'express';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Interview from '../models/Interview.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { createZoomMeeting, createGoogleMeet } from '../utils/meetingService.js';

const router = express.Router();

// Helper to calculate trend
const calculateTrend = async (Model, query = {}) => {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthCount = await Model.countDocuments({
      ...query,
      createdAt: { $gte: firstDayCurrentMonth }
    });

    const lastMonthCount = await Model.countDocuments({
      ...query,
      createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth }
    });

    const total = await Model.countDocuments(query);

    let trend = 0;
    if (lastMonthCount > 0) {
      trend = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
    } else if (currentMonthCount > 0) {
      trend = 100; // 100% increase if last month was 0
    }

    return {
      value: total,
      trend: `${trend >= 0 ? '+' : ''}${Math.round(trend)}%`,
      trendUp: trend >= 0
    };
  } catch (error) {
    console.error('Error in calculateTrend:', error);
    return { value: 0, trend: "0%", trendUp: true };
  }
};

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    // 1. Total Candidates (Users with role 'candidate')
    const candidatesStats = await calculateTrend(User, { role: 'candidate' });

    // 2. Hired Candidates (Applications with status 'Hired')
    const hiredStats = await calculateTrend(Application, { status: 'Hired' });

    // 3. Active Jobs
    const jobStats = await calculateTrend(Job, { status: 'Open' });

    // 4. Interviews (Scheduled)
    const interviewStats = await calculateTrend(Interview, { status: 'Scheduled' });

    console.log('Dashboard Stats:', {
      candidates: candidatesStats,
      hired: hiredStats,
      activeJobs: jobStats,
      interviews: interviewStats
    });

    res.json({
      candidates: candidatesStats,
      hired: hiredStats,
      activeJobs: jobStats,
      interviews: interviewStats,
      raw: {
        totalApplicants: await Application.countDocuments()
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Recent Activity (Latest Resumes & Interviews)
router.get('/activity', async (req, res) => {
  try {
    // Fetch latest 3 resumes
    const latestResumes = await Resume.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('userId', 'name');

    // Fetch latest 3 completed interviews
    const latestInterviews = await Interview.find({ status: 'Completed' })
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate('candidateId', 'name');

    const activity = [
      ...latestResumes.map(r => ({
        type: 'resume',
        user: r.userId?.name || 'Unknown',
        action: 'created a resume',
        target: r.resumeName,
        time: r.createdAt
      })),
      ...latestInterviews.map(i => ({
        type: 'interview',
        user: i.candidateId?.name || 'Unknown',
        action: 'completed interview',
        target: i.jobRole,
        time: i.updatedAt
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Candidates (for MCQ Assignment)
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await User.find({ role: 'candidate' })
      .select('name email')
      .sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Upcoming Interviews
router.get('/interviews/upcoming', async (req, res) => {
  try {
    const upcoming = await Interview.find({
      status: 'Scheduled',
      scheduledAt: { $gte: new Date() }
    })
      .sort({ scheduledAt: 1 })
      .limit(5)
      .populate('candidateId', 'name email');

    res.json(upcoming);
  } catch (error) {
    console.error('Error fetching upcoming interviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Recent Jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Scheduled Interviews
router.get('/interviews', async (req, res) => {
  try {
    const interviews = await Interview.find()
      .sort({ scheduledAt: 1 })
      .populate('candidateId', 'name email');
    res.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate Meeting Link
router.post('/generate-link', async (req, res) => {
  try {
    const { platform, topic, startTime } = req.body;
    let result = { url: '' };

    if (platform === 'Zoom') {
      result = await createZoomMeeting(topic || 'Interview', startTime || new Date());
    } else if (platform === 'Google Meet') {
      result = await createGoogleMeet(topic || 'Interview', startTime || new Date());
    }

    res.json({ link: result.url, password: result.password });
  } catch (error) {
    console.error('Error generating link:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Interview
router.post('/interviews', async (req, res) => {
  try {
    const { candidateId, jobRole, scheduledAt, platform, meetingLink, meetingPassword: providedPassword } = req.body;
    const scheduledDate = new Date(scheduledAt);

    if (!candidateId || !jobRole || !scheduledAt || !platform) {
      return res.status(400).json({ message: 'candidateId, jobRole, scheduledAt and platform are required' });
    }

    if (Number.isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ message: 'Invalid scheduledAt value' });
    }

    let finalMeetingLink = meetingLink;
    let meetingPassword = providedPassword || '';

    // Auto-generate link if not provided and platform is Zoom/Google Meet
    if (!finalMeetingLink && (platform === 'Zoom' || platform === 'Google Meet')) {
      const candidate = await User.findById(candidateId);
      const topic = `Interview with ${candidate ? candidate.name : 'Candidate'}`;

      if (platform === 'Zoom') {
        const result = await createZoomMeeting(topic, scheduledDate.toISOString());
        finalMeetingLink = result.url;
        meetingPassword = result.password;
      } else {
        const result = await createGoogleMeet(topic, scheduledDate.toISOString());
        finalMeetingLink = result.url;
      }
    }

    const interview = new Interview({
      candidateId,
      jobRole,
      scheduledAt: scheduledDate,
      platform,
      meetingLink: finalMeetingLink,
      meetingPassword,
      status: 'Scheduled'
    });

    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Interview Feedback by HR and mark meeting as completed
router.patch('/interviews/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { overall, strengths, improvements } = req.body;

    const normalizedStrengths = Array.isArray(strengths)
      ? strengths.filter(Boolean)
      : String(strengths || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    const normalizedImprovements = Array.isArray(improvements)
      ? improvements.filter(Boolean)
      : String(improvements || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    const normalizedOverall = String(overall || '').trim();
    if (!normalizedOverall && normalizedStrengths.length === 0 && normalizedImprovements.length === 0) {
      return res.status(400).json({ message: 'At least one feedback field is required' });
    }

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const submittedAt = new Date();
    interview.feedback = {
      overall: normalizedOverall,
      strengths: normalizedStrengths,
      improvements: normalizedImprovements,
    };
    interview.feedbackByHR = {
      overall: normalizedOverall,
      strengths: normalizedStrengths,
      improvements: normalizedImprovements,
      submittedAt,
      submittedBy: req.user?.id,
    };
    interview.status = 'Completed';

    await interview.save();

    const populated = await Interview.findById(interview._id).populate('candidateId', 'name email');
    return res.json(populated);
  } catch (error) {
    console.error('Error saving interview feedback:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Cancel Interview (Soft Delete)
router.patch('/interviews/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, notify } = req.body;

    const interview = await Interview.findByIdAndUpdate(
      id,
      {
        status: 'Cancelled',
        cancellationReason: reason,
      },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if there are any OTHER scheduled interviews for this candidate
    // If so, we don't revert the Application status yet.
    const activeInterviewsCount = await Interview.countDocuments({
      candidateId: interview.candidateId,
      status: 'Scheduled',
      _id: { $ne: interview._id } // Exclude the one we just cancelled
    });

    if (activeInterviewsCount === 0) {
      // No active interviews left, attempt to revert Application status
      // Strategy: Find all applications for this candidate in 'Interview Scheduled' state
      const applications = await Application.find({
        candidateId: interview.candidateId,
        status: 'Interview Scheduled'
      });

      if (applications.length > 0) {
        // Find matching job title if possible, otherwise default to first one
        let targetApp = applications.find(app => (app.jobTitle || '').trim() === (interview.jobRole || '').trim());

        // If no exact title match, but only one application exists, assume it's the one
        if (!targetApp && applications.length === 1) {
          targetApp = applications[0];
        }

        if (targetApp) {
          targetApp.status = 'Shortlisted';
          await targetApp.save();
        }
      }
    }

    if (notify) {
      // Mock sending email
      console.log(`[Mock Email] Sending cancellation email to candidate for Interview ${id}. Reason: ${reason}`);
    }

    res.json(interview);
  } catch (error) {
    console.error('Error cancelling interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Application Trends (Last 6 Months)
router.get('/stats/trends', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // 5 months back + current month

    const applications = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing months to ensure consistency
    const trends = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthKey = d.toISOString().slice(0, 7); // YYYY-MM
      const monthLabel = d.toLocaleString('default', { month: 'short' });

      const found = applications.find(a => a._id === monthKey);
      trends.push({
        name: monthLabel,
        applications: found ? found.count : 0
      });
    }

    res.json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Recent Applications
router.get('/applications/recent', async (req, res) => {
  try {
    const recent = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('candidateId', 'name email') // Get candidate name
      .select('jobTitle status createdAt candidateId'); // Select relevant fields

    const formatted = recent.map(app => ({
      id: app._id,
      name: app.candidateId?.name || 'Unknown',
      role: app.jobTitle,
      date: new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      stage: app.status === 'Applied' ? 'Screening' : app.status, // Map status if needed
      status: app.status,
      // Map status to color
      statusColor:
        app.status === 'Hired' ? 'text-green-600' :
          app.status === 'Rejected' ? 'text-red-500' :
            app.status === 'Interview Scheduled' ? 'text-blue-600' :
              'text-orange-500' // Pending/Applied
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching recent applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
