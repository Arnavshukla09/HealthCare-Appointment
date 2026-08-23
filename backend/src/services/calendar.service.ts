import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // redirect url here
);

// This is a stub for the calendar service
export const createCalendarEvent = async (eventDetails: any, userTokens: any) => {
  oauth2Client.setCredentials(userTokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventDetails,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return null;
  }
};
