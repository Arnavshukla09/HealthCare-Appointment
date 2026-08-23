"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const doctor_routes_1 = __importDefault(require("./routes/doctor.routes"));
const cron_service_1 = require("./services/cron.service");
dotenv_1.default.config();
(0, db_1.connectDB)();
(0, cron_service_1.startCronJobs)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/appointments', appointment_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/doctor', doctor_routes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});
const User_1 = require("./models/User");
app.get('/api/doctors', async (req, res) => {
    try {
        const doctors = await User_1.User.find({ role: 'doctor' }).select('-passwordHash');
        res.json(doctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Serve frontend in production
const frontendPath = path_1.default.join(process.cwd(), '../frontend/dist');
app.use(express_1.default.static(frontendPath));
app.use((req, res) => {
    res.sendFile(path_1.default.join(frontendPath, 'index.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
