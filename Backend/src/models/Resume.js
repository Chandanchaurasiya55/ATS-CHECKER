import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      portfolio: String,
    },
    summary: String,
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
        achievements: [String],
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        location: String,
        graduationYear: String,
        gpa: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        link: String,
      },
    ],
    atsScore: {
      type: Number,
      default: 0,
    },
    template: {
      type: String,
      default: 'classic',
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
