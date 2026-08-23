# 🏥 MediBridge - Healthcare Appointment & Follow-up Manager

A comprehensive healthcare appointment platform with separate portals for patients, doctors, and admin. Features AI symptom summaries, robust concurrency control for double-booking prevention, and automated leave conflict management.

## 🚀 Setup Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Arnavshukla09/HealthCare-Appointment.git
cd HealthCare-Appointment
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on the `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/healthcare_manager
JWT_SECRET=supersecretjwtkey
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🤖 LLM Prompts Used

**Pre-visit Summary:**
> "Analyse these symptoms and return: urgency level (Low / Medium / High), chief complaint, and three suggested questions for the doctor. Symptoms: {symptoms}"

**Post-visit Summary:**
> "Convert these clinical notes into a patient-friendly summary with medication schedule and follow-up steps: {notes}"

## 🗄️ Database Schema Summary

- **Users:** Stores authentication data and roles (`admin`, `doctor`, `patient`).
- **DoctorProfiles:** Links to `User`. Stores `specialization`, `workingHours`, `slotDuration`, and `leaveDays`.
- **Appointments:** Links to `patient` and `doctor`. Tracks `status` (`HOLD`, `BOOKED`, `COMPLETED`, `CANCELLED`), `holdExpiresAt` (with TTL index), and stores AI summaries.
- **Notifications:** Job queue for background email retries.

## 📡 API Documentation (Overview)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get JWT
- `POST /api/appointments/hold` - Create a 5-minute atomic hold on a slot
- `POST /api/appointments/book` - Confirm booking and submit symptoms
- `GET /api/appointments` - Fetch appointments for the logged-in user
- `POST /api/admin/doctor/leave` - Admin sets a doctor on leave, triggering auto-cancellation
- `POST /api/doctor/post-visit` - Doctor submits clinical notes for AI summary generation

## 📅 Google Calendar Setup
1. Go to Google Cloud Console.
2. Create a project and enable "Google Calendar API".
3. Configure OAuth Consent Screen.
4. Create OAuth Client ID credentials and add them to the `.env` file.
