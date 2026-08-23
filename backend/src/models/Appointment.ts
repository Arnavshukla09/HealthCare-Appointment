import mongoose, { Document, Schema } from 'mongoose';

export enum AppointmentStatus {
  HOLD = 'hold', // For 5-min atomic slot hold
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  holdExpiresAt?: Date;
  symptoms?: string;
  aiPreVisitSummary?: string;
  urgencyLevel?: 'Low' | 'Medium' | 'High';
  postVisitNotes?: string;
  prescription?: string;
  aiPostVisitSummary?: string;
  googleCalendarEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.BOOKED },
    holdExpiresAt: { type: Date },
    symptoms: { type: String },
    aiPreVisitSummary: { type: String },
    urgencyLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
    postVisitNotes: { type: String },
    prescription: { type: String },
    aiPostVisitSummary: { type: String },
    googleCalendarEventId: { type: String },
  },
  { timestamps: true }
);

// Indexes for concurrency control and fast querying
appointmentSchema.index({ doctor: 1, startTime: 1, endTime: 1 });
appointmentSchema.index({ holdExpiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired holds

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
