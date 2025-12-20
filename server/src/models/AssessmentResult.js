import mongoose from 'mongoose';

const assessmentResultSchema = new mongoose.Schema(
  {
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    responses: [
      {
        questionId: Number,
        selectedAnswer: Number,
        isCorrect: Boolean
      }
    ],
    completedAt: { type: Date }
  },
  { timestamps: true }
);

const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

export default AssessmentResult;
