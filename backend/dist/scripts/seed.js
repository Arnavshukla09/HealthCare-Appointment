"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const DoctorProfile_1 = require("../models/DoctorProfile");
dotenv_1.default.config();
const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected!');
        console.log('Clearing old data...');
        await User_1.User.deleteMany({});
        await DoctorProfile_1.DoctorProfile.deleteMany({});
        const passwordHash = await bcryptjs_1.default.hash('password123', 10);
        console.log('Creating Admin...');
        const admin = new User_1.User({
            name: 'System Admin',
            email: 'admin@medibridge.com',
            passwordHash,
            role: 'admin',
        });
        await admin.save();
        console.log('Creating Doctor...');
        const doctor = new User_1.User({
            name: 'Dr. Sarah Smith',
            email: 'doctor@medibridge.com',
            passwordHash,
            role: 'doctor',
        });
        await doctor.save();
        const doctorProfile = new DoctorProfile_1.DoctorProfile({
            user: doctor._id,
            specialization: 'Cardiologist',
            workingHours: {
                start: '09:00',
                end: '17:00'
            },
            slotDuration: 30,
        });
        await doctorProfile.save();
        console.log('Creating Patient...');
        const patient = new User_1.User({
            name: 'John Doe',
            email: 'patient@medibridge.com',
            passwordHash,
            role: 'patient',
        });
        await patient.save();
        console.log('Database seeded successfully with demo accounts!');
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};
seedDatabase();
