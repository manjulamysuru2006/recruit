import mongoose, { Schema, models } from 'mongoose';

const ChatSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
  },
  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: String,
    type: {
      type: String,
      enum: ['text', 'file', 'system'],
      default: 'text',
    },
    fileUrl: String,
    fileName: String,
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  lastMessage: {
    content: String,
    createdAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = models.Chat || mongoose.model('Chat', ChatSchema);
export default Chat;
