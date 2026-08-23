import { Request, Response } from 'express';
import { DoctorProfile } from '../models/DoctorProfile';
import { User, UserRole } from '../models/User';
import { Appointment, AppointmentStatus } from '../models/Appointment';

// Create a new doctor profile (Admin only)
export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  const { name, email, passwordHash, specialization, workingHours, slotDuration } = req.body;
  try {
    const user = await User.create({ name, email, passwordHash, role: UserRole.DOCTOR });
    const doctorProfile = await DoctorProfile.create({
      user: user._id,
      specialization,
      workingHours,
      slotDuration,
      leaveDays: []
    });
    res.status(201).json({ user, doctorProfile });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add leave date and cancel affected appointments
export const addDoctorLeave = async (req: Request, res: Response): Promise<void> => {
  const { doctorId, leaveDate } = req.body; // doctorId is User._id

  try {
    const profile = await DoctorProfile.findOne({ user: doctorId });
    if (!profile) {
      res.status(404).json({ message: 'Doctor profile not found' });
      return;
    }

    const leaveDateObj = new Date(leaveDate);
    // Add to leave days if not already present
    if (!profile.leaveDays.some(d => d.getTime() === leaveDateObj.getTime())) {
      profile.leaveDays.push(leaveDateObj);
      await profile.save();
    }

    // Leave Conflict Management: Cancel all appointments on that date for this doctor
    const startOfDay = new Date(leaveDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(leaveDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const affectedAppointments = await Appointment.find({
      doctor: doctorId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: AppointmentStatus.BOOKED
    });

    for (const appt of affectedAppointments) {
      appt.status = AppointmentStatus.CANCELLED;
      await appt.save();
      // NOTE: Trigger notification to patient about cancellation
    }

    res.status(200).json({ message: `Doctor leave added. ${affectedAppointments.length} appointments cancelled.` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
