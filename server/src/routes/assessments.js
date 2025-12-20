import express from 'express';
import Assessment from '../models/Assessment.js';
import AssessmentResult from '../models/AssessmentResult.js';
import User from '../models/User.js';

const router = express.Router();

// Get all Assessments (Question Papers)
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find().sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new Assessment
router.post('/', async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;
    const assessment = new Assessment({
      title,
      description,
      duration,
      questions
    });
    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Assessment
router.put('/:id', async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { title, description, duration, questions },
      { new: true }
    );
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Assessment
router.delete('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    // Optional: Clean up assigned results or leave them?
    // Often better to keep results but maybe mark as deleted, or cascade delete.
    // For now, let's keep it simple and just delete the test definition.
    // Candidates with 'Pending' tests might see an error if they try to start it, 
    // so let's delete pending assignments too.
    await AssessmentResult.deleteMany({ assessmentId: req.params.id, status: 'Pending' });

    res.json({ message: 'Assessment deleted' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign Assessment to Candidate
router.post('/assign', async (req, res) => {
  try {
    const { assessmentId, candidateId } = req.body;

    // Check if already assigned
    const existing = await AssessmentResult.findOne({ assessmentId, candidateId });
    if (existing) {
      return res.status(400).json({ message: 'Assessment already assigned to this candidate' });
    }

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const result = new AssessmentResult({
      assessmentId,
      candidateId,
      totalQuestions: assessment.questions.length,
      status: 'Pending'
    });

    await result.save();

    // In a real app, send email with link here
    console.log(`[Mock Email] Assessment "${assessment.title}" assigned to candidate ${candidateId}`);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error assigning assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Results (for HR Dashboard)
router.get('/results', async (req, res) => {
  try {
    const results = await AssessmentResult.find()
      .populate('assessmentId', 'title')
      .populate('candidateId', 'name email')
      .sort({ updatedAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Candidate's Assessments
router.get('/my-assessments/:userId', async (req, res) => {
  try {
    console.log('Fetching assessments for candidate:', req.params.userId);
    const assignments = await AssessmentResult.find({ candidateId: req.params.userId })
      .populate('assessmentId')
      .sort({ updatedAt: -1 });
    console.log('Found assignments:', assignments.length);
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching my assessments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit Assessment
router.post('/submit', async (req, res) => {
  try {
    const { resultId, answers } = req.body;

    const result = await AssessmentResult.findById(resultId).populate('assessmentId');
    if (!result) return res.status(404).json({ message: 'Result not found' });

    let score = 0;
    const assessment = result.assessmentId;

    // Calculate Score
    assessment.questions.forEach((q, idx) => {
      // answers is an object/array mapping questionId or index to selected option index
      // Assuming frontend sends array of selected indices matching question order
      if (answers[idx] === q.correctAnswer) {
        score++;
      }
    });

    result.score = score;
    result.status = 'Completed';
    // You might want to save the user's answers too if you add a field for it

    await result.save();

    res.json({
      score,
      total: assessment.questions.length,
      percentage: Math.round((score / assessment.questions.length) * 100)
    });

  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
