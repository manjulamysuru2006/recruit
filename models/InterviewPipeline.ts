import mongoose from 'mongoose';

const InterviewPipelineSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currentStage: {
    type: String,
    enum: ['screening', 'phone_screen', 'technical_round_1', 'technical_round_2', 'hr_round', 'final_round', 'offer', 'rejected', 'hired'],
    default: 'screening',
  },
  stages: [{
    name: String,
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'passed', 'failed'],
      default: 'pending',
    },
    scheduledDate: Date,
    completedDate: Date,
    interviewers: [String],
    feedback: String,
    rating: Number, // 1-5
    notes: String,
  }],
  overallRating: {
    type: Number,
    default: 0,
  },
  resumeScore: {
    type: Number,
    default: 0,
  },
  notes: [{
    author: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['active', 'on_hold', 'rejected', 'hired'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export default mongoose.models.InterviewPipeline || mongoose.model('InterviewPipeline', InterviewPipelineSchema);
