import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    // Job information coming from external job APIs
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    type: { type: String },
    source: { type: String },
    url: { type: String },
    status: {
      type: String,
      enum: ['Applied', 'In Review', 'Shortlisted', 'Rejected', 'Hired', 'Interview Scheduled', 'Offer Extended'],
      default: 'Applied'
    }
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;


