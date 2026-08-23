"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDoctorLeave = exports.createDoctor = void 0;
const DoctorProfile_1 = require("../models/DoctorProfile");
const User_1 = require("../models/User");
const Appointment_1 = require("../models/Appointment");
// Create a new doctor profile (Admin only)
const createDoctor = async (req, res) => {
    const { name, email, passwordHash, specialization, workingHours, slotDuration } = req.body;
    try {
        const user = await User_1.User.create({ name, email, passwordHash, role: User_1.UserRole.DOCTOR });
        const doctorProfile = await DoctorProfile_1.DoctorProfile.create({
            user: user._id,
            specialization,
            workingHours,
            slotDuration,
            leaveDays: []
        });
        res.status(201).json({ user, doctorProfile });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createDoctor = createDoctor;
// Add leave date and cancel affected appointments
const addDoctorLeave = async (req, res) => {
    const { doctorId, leaveDate } = req.body; // doctorId is User._id
    try {
        const profile = await DoctorProfile_1.DoctorProfile.findOne({ user: doctorId });
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
        const affectedAppointments = await Appointment_1.Appointment.find({
            doctor: doctorId,
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: Appointment_1.AppointmentStatus.BOOKED
        });
        for (const appt of affectedAppointments) {
            appt.status = Appointment_1.AppointmentStatus.CANCELLED;
            await appt.save();
            // NOTE: Trigger notification to patient about cancellation
        }
        res.status(200).json({ message: `Doctor leave added. ${affectedAppointments.length} appointments cancelled.` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addDoctorLeave = addDoctorLeave;
