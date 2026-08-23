"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPostVisitNotes = void 0;
const Appointment_1 = require("../models/Appointment");
const submitPostVisitNotes = async (req, res) => {
    const { appointmentId, postVisitNotes, prescription } = req.body;
    try {
        const appointment = await Appointment_1.Appointment.findById(appointmentId);
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
        appointment.status = Appointment_1.AppointmentStatus.COMPLETED;
        // NOTE: Trigger AI service here to generate aiPostVisitSummary
        // then send email to patient
        await appointment.save();
        res.status(200).json(appointment);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.submitPostVisitNotes = submitPostVisitNotes;
