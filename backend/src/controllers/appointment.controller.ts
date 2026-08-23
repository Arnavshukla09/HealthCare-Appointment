import { Request, Response } from 'express';
import { Appointment, AppointmentStatus } from '../models/Appointment';
import { AuthRequest } from '../middlewares/auth.middleware';

// Hold a slot for 5 minutes
export const holdSlot = async (req: AuthRequest, res: Response): Promise<void> => {
  const { doctorId, startTime, endTime } = req.body;
  const patientId = req.user?._id;

  try {
    // Check if slot is already booked or held
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      startTime,
      endTime,
      $or: [
        { status: AppointmentStatus.BOOKED },
        { status: AppointmentStatus.COMPLETED },
        { status: AppointmentStatus.HOLD, holdExpiresAt: { $gt: new Date() } }
      ]
    });

    if (existingAppointment) {
      res.status(409).json({ message: 'Slot is already booked or currently on hold.' });
      return;
    }

    // Create a hold
    const holdExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      startTime,
      endTime,
      status: AppointmentStatus.HOLD,
      holdExpiresAt,
    });

    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm booking with symptoms
export const bookAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { appointmentId, symptoms } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    if (appointment.patient.toString() !== req.user?._id?.toString()) {
      res.status(403).json({ message: 'Not authorized to book this slot' });
      return;
    }

    if (appointment.status !== AppointmentStatus.HOLD || (appointment.holdExpiresAt && new Date() > appointment.holdExpiresAt)) {
      res.status(400).json({ message: 'Slot hold has expired. Please try holding the slot again.' });
      return;
    }

    // Update appointment to booked and save symptoms
    appointment.status = AppointmentStatus.BOOKED;
    appointment.symptoms = symptoms;
    appointment.holdExpiresAt = undefined;
    
    // NOTE: In the background, trigger AI service for pre-visit summary
    // and email service for confirmation
    
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.user?.role === 'doctor' ? { doctor: req.user._id } : { patient: req.user?._id };
    const appointments = await Appointment.find(query).populate('patient doctor', 'name email');
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
