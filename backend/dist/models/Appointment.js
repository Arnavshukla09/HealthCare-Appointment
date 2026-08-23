"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = exports.AppointmentStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["HOLD"] = "hold";
    AppointmentStatus["BOOKED"] = "booked";
    AppointmentStatus["COMPLETED"] = "completed";
    AppointmentStatus["CANCELLED"] = "cancelled";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
const appointmentSchema = new mongoose_1.Schema({
    patient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
}, { timestamps: true });
// Indexes for concurrency control and fast querying
appointmentSchema.index({ doctor: 1, startTime: 1, endTime: 1 });
appointmentSchema.index({ holdExpiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired holds
exports.Appointment = mongoose_1.default.model('Appointment', appointmentSchema);
