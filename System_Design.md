# MediBridge System Design Document

This document outlines the architectural decisions and problem-solving approaches used in building the Healthcare Appointment Manager, focusing specifically on critical concurrency and reliability challenges.

## 1. Concurrency Control: Double-Booking Prevention & Slot Hold Mechanism

**The Challenge:** In a high-traffic system, multiple patients may attempt to book the exact same time slot with a specific doctor simultaneously. This leads to a race condition where a double-booking could occur if both requests read an "available" state before either can write a "booked" state. Furthermore, patients need a few minutes to fill out their pre-visit symptom forms without losing the slot they clicked.

**The Solution:**
We implemented an **Atomic Slot Hold Mechanism** using MongoDB's document-level locking and atomic operations.

1. **Slot Hold State:** When a patient selects a slot, an API call is made to create an `Appointment` document with `status: "HOLD"` and a `holdExpiresAt` timestamp set to 5 minutes in the future.
2. **Atomic Verification:** During this creation process, the database queries for any existing document matching the same `doctor`, `startTime`, and `endTime` where the status is either `BOOKED` or (`HOLD` AND `holdExpiresAt` > current time). If a match is found, the system rejects the new hold request immediately.
3. **TTL Index:** A MongoDB TTL (Time-To-Live) index is placed on the `holdExpiresAt` field. If the patient does not confirm the booking within 5 minutes, MongoDB automatically deletes the hold document, freeing the slot for others.
4. **Final Booking:** When the patient submits their symptoms, the system verifies that the hold has not expired, atomic updates the status to `BOOKED`, unsets the `holdExpiresAt` field, and triggers the AI background tasks.

## 2. Doctor Leave Conflict Handling

**The Challenge:** Doctors may unexpectedly take leave. The system must gracefully handle this by preventing new bookings for that day and automatically cancelling existing appointments while keeping affected patients informed.

**The Solution:**
1. **Leave Management:** The Admin portal allows adding specific dates to a doctor's `leaveDays` array in their `DoctorProfile`.
2. **Conflict Engine:** When a leave date is added, the backend calculates the start and end of that day. It queries the `Appointment` collection for all `BOOKED` appointments belonging to that doctor within that timeframe.
3. **Atomic Cancellation:** The system iterates through the affected appointments, updating their status to `CANCELLED`.
4. **Trigger Notifications:** For each cancelled appointment, an event is pushed to the `Notification` collection. The email service will dispatch an automated email to the patient explaining the cancellation and prompting them to reschedule.

## 3. Notification Reliability & Failure Handling

**The Challenge:** Email delivery is inherently unreliable. SMTP servers might reject connections, rate limit, or timeout. A failure to send a booking confirmation or cancellation notice can lead to missed appointments and poor user experience.

**The Solution:**
Instead of sending emails synchronously during the HTTP request lifecycle, we use a robust **Background Job Queue** approach.

1. **Notification Queue:** Whenever an email needs to be sent (e.g., booking confirmed, leave scheduled), a document is created in the `Notification` collection with a status of `PENDING`, retry count `0`, and the email details (subject, body, to).
2. **Cron Scheduler:** A `node-cron` background worker runs every 10 minutes (or continuously via a message broker like BullMQ).
3. **Exponential Backoff & Retries:** The cron job polls for notifications in `PENDING` or `FAILED` state where `retryCount` is less than 3. It attempts to send the email via Nodemailer.
    - If successful, the status is updated to `SENT`.
    - If it fails, the `retryCount` is incremented. If `retryCount` reaches 3, the notification remains `FAILED` for manual admin review.
4. **Graceful Degradation:** By moving this to a background queue, the user's API response is immediate, and the system is resilient to SMTP downtime.

## 4. LLM Failure Handling

**The Challenge:** External AI APIs (like Google Gemini) can experience downtime or rate-limiting. The application should not break if the AI summary generation fails.

**The Solution:**
AI calls are wrapped in `try-catch` blocks. If the `generateContent` promise throws an error, the service gracefully degrades by returning the raw symptoms or notes as the "summary" instead of crashing the process or blocking the appointment completion.

---
**Summary:** The system relies on database-level atomicity, background processing, and graceful error handling to provide a robust, conflict-free appointment management experience for patients and doctors alike.
