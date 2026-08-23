import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctorProfile extends Document {
  user: mongoose.Types.ObjectId;
  specialization: string;
  workingHours: {
    start: string; // e.g., '09:00'
    end: string;   // e.g., '17:00'
  };
  slotDuration: number; // in minutes, e.g., 30
  leaveDays: Date[]; // dates when doctor is on leave
  createdAt: Date;
  updatedAt: Date;
}

const doctorProfileSchema = new Schema<IDoctorProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, required: true },
    workingHours: {
      start: { type: String, required: true, default: '09:00' },
      end: { type: String, required: true, default: '17:00' },
    },
    slotDuration: { type: Number, required: true, default: 30 },
    leaveDays: [{ type: Date }],
  },
  { timestamps: true }
);

export const DoctorProfile = mongoose.model<IDoctorProfile>('DoctorProfile', doctorProfileSchema);
