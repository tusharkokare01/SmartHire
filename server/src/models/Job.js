import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      default: 'Full-time'
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site'
    },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' }
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft'],
      default: 'Open'
    },
    applicantsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
