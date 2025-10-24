import mongoose, { Schema, models } from 'mongoose';

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['application', 'message', 'interview', 'status_update', 'recommendation', 'system'],
    required: true,
  },
  title: String,
  message: String,
  link: String,
  read: {
    type: Boolean,
    default: false,
  },
  data: Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = models.Notification || mongoose.model('Notification', NotificationSchema);
export default Notification;
