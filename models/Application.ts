import mongoose, { Schema, models } from 'mongoose';

const ApplicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recruiterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'screening', 'interviewing', 'offered', 'rejected', 'withdrawn', 'accepted'],
    default: 'applied',
  },
  resume: String,
  coverLetter: String,
  answers: [{
    question: String,
    answer: String,
  }],
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  mlPredictions: {
    fitScore: Number,
    strengthScore: Number,
    recommendedActions: [String],
    skillsMatch: [{
      skill: String,
      score: Number,
    }],
  },
  timeline: [{
    status: String,
    date: Date,
    note: String,
  }],
  interviews: [{
    type: {
      type: String,
      enum: ['phone', 'video', 'onsite', 'technical'],
    },
    scheduledDate: Date,
    duration: Number,
    location: String,
    meetingLink: String,
    notes: String,
    feedback: String,
    rating: Number,
  }],
  notes: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = models.Application || mongoose.model('Application', ApplicationSchema);
export default Application;
