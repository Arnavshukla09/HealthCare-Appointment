"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCalendarEvent = void 0;
const googleapis_1 = require("googleapis");
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
// This is a stub for the calendar service
const createCalendarEvent = async (eventDetails, userTokens) => {
    oauth2Client.setCredentials(userTokens);
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: eventDetails,
        });
        return response.data;
    }
    catch (error) {
        console.error('Error creating calendar event:', error);
        return null;
    }
};
exports.createCalendarEvent = createCalendarEvent;
