import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { DoctorProfile } from '../models/DoctorProfile';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected!');

    console.log('Clearing old data...');
    await User.deleteMany({});
    await DoctorProfile.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    console.log('Creating Admin...');
    const admin = new User({
      name: 'System Admin',
      email: 'admin@medibridge.com',
      passwordHash,
      role: 'admin',
    });
    await admin.save();

    console.log('Creating Doctor...');
    const doctor = new User({
      name: 'Dr. Sarah Smith',
      email: 'doctor@medibridge.com',
      passwordHash,
      role: 'doctor',
    });
    await doctor.save();

    const doctorProfile = new DoctorProfile({
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
    const patient = new User({
      name: 'John Doe',
      email: 'patient@medibridge.com',
      passwordHash,
      role: 'patient',
    });
    await patient.save();

    console.log('Database seeded successfully with demo accounts!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
