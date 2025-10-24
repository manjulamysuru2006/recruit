import mongoose, { Schema, models } from 'mongoose';

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  location: {
    city: String,
    state: String,
    country: String,
    remote: Boolean,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
  },
  benefits: [String],
  recruiterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'archived'],
    default: 'active',
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  deadline: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for searching
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Job = models.Job || mongoose.model('Job', JobSchema);
export default Job;
