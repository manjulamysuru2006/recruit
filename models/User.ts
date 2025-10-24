import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],
    required: true,
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    location: {
      city: String,
      state: String,
      country: String,
    },
  },
  // Candidate specific fields
  candidateProfile: {
    resume: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
    }],
    education: [{
      degree: String,
      institution: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
      grade: String,
    }],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date,
      credentialId: String,
    }],
    preferences: {
      jobTypes: [String],
      locations: [String],
      minSalary: Number,
      maxSalary: Number,
      remote: Boolean,
    },
  },
  // Recruiter specific fields
  recruiterProfile: {
    company: String,
    companyWebsite: String,
    companySize: String,
    industry: String,
    position: String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
});

const User = models.User || mongoose.model('User', UserSchema);
export default User;
