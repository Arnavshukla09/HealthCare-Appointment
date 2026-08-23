import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

export enum NotificationType {
  BOOKING_CONFIRMATION = 'booking_confirmation',
  REMINDER = 'reminder',
  CANCELLATION = 'cancellation',
}

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  email: string;
  subject: string;
  body: string;
  status: NotificationStatus;
  retryCount: number;
  sendAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: Object.values(NotificationStatus), default: NotificationStatus.PENDING },
    retryCount: { type: Number, default: 0 },
    sendAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
