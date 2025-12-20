import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true }, // in minutes
    questions: [
      {
        id: { type: Number, required: true },
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true } // Index of correct option
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);

export default Assessment;
