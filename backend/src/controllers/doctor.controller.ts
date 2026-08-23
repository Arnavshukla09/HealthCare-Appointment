import { Request, Response } from 'express';
import { Appointment, AppointmentStatus } from '../models/Appointment';
import { AuthRequest } from '../middlewares/auth.middleware';

export const submitPostVisitNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  const { appointmentId, postVisitNotes, prescription } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    if (appointment.doctor.toString() !== req.user?._id?.toString()) {
      res.status(403).json({ message: 'Not authorized to update this appointment' });
      return;
    }

    appointment.postVisitNotes = postVisitNotes;
    appointment.prescription = prescription;
    appointment.status = AppointmentStatus.COMPLETED;
    
    // NOTE: Trigger AI service here to generate aiPostVisitSummary
    // then send email to patient
    
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
