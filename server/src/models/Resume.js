import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      github: String,
      portfolio: String,
    },
    profileSummary: String,
    education: [
      {
        institution: String,
        degree: String,
        year: String,
        startDate: String,
        endDate: String,
        gpa: String,
      },
    ],
    experience: [
      {
        company: String,
        title: String,
        duration: String,
        description: String,
      },
    ],
    skills: [String],
    projects: [
      {
        name: String,
        description: String,
        technologies: String,
        link: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
      },
    ],
    languages: [String],
    templateId: { type: Number, default: 1 },
    resumeName: { type: String, default: 'My Resume' },
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
