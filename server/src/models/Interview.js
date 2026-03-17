import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, if scheduled by HR
    jobRole: { type: String, required: true },
    interviewType: { type: String, enum: ['Mock', 'Technical', 'HR', 'Behavioral'], default: 'Mock' },
    scheduledAt: { type: Date },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'Pending'], default: 'Pending' },
    score: { type: Number },
    feedback: {
      overall: String,
      strengths: [String],
      improvements: [String],
    },
    feedbackByHR: {
      overall: { type: String },
      strengths: [{ type: String }],
      improvements: [{ type: String }],
      submittedAt: { type: Date },
      submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    feedbackByCandidate: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      submittedAt: { type: Date },
    },
    duration: { type: Number }, // in minutes
    platform: { type: String, enum: ['Zoom', 'Google Meet', 'Phone', 'In-Person'], default: 'Google Meet' },
    meetingLink: { type: String },
    meetingPassword: { type: String }, // For Zoom/Meet passcodes
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
