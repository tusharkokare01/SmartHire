import mongoose from 'mongoose';

const userFeedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['candidate', 'hr'], required: true },
    type: {
      type: String,
      enum: ['General Feedback', 'Suggestion', 'Bug Report', 'Feature Request'],
      default: 'General Feedback'
    },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5 },
    status: { type: String, enum: ['New', 'Reviewed'], default: 'New' }
  },
  { timestamps: true }
);

const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema);

export default UserFeedback;
