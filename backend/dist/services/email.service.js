"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"MediBridge Healthcare" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
        });
        return true;
    }
    catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};
exports.sendEmail = sendEmail;
