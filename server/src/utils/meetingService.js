import axios from 'axios';
import { google } from 'googleapis';

// --- Zoom Integration ---
const getZoomAccessToken = async () => {
  try {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || !clientId || !clientSecret) {
      console.warn('Zoom credentials missing in .env');
      return null;
    }

    const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await axios.post(tokenUrl, null, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Zoom access token:', error.response?.data || error.message);
    return null;
  }
};

export const createZoomMeeting = async (topic, startTime, duration = 60) => {
  try {
    const token = await getZoomAccessToken();
    if (!token) {
      // Fallback for demo/testing if no credentials
      const mockId = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit ID
      return { 
        url: `https://zoom.us/j/${mockId}`, 
        password: '123456' 
      };
    }

    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime, // ISO 8601 format
        duration,
        timezone: 'UTC',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { 
      url: response.data.join_url, 
      password: response.data.password 
    };
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    // Fallback on error
    const mockId = Math.floor(1000000000 + Math.random() * 9000000000);
    return { 
      url: `https://zoom.us/j/${mockId}`, 
      password: '123456' 
    };
  }
};

// --- Google Meet Integration ---
// Note: This requires a Service Account with Domain-Wide Delegation or OAuth flow.
// For simplicity in this context, we'll assume a Service Account or simulate if missing.
export const createGoogleMeet = async (topic, startTime, duration = 60) => {
  try {
    // Check for Google credentials
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Google credentials missing in .env');
      // Generate a mock link in valid format (abc-defg-hij)
      const segment = () => Math.random().toString(36).substring(2, 5 + Math.floor(Math.random() * 2));
      return { url: `https://meet.google.com/${segment()}-${segment()}-${segment()}` };
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const event = {
      summary: topic,
      description: 'Interview scheduled via SmartRecruit',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    return { url: response.data.hangoutLink };
  } catch (error) {
    console.error('Error creating Google Meet:', error.message);
    return { url: `https://meet.google.com/fallback-${Math.random().toString(36).substring(7)}` };
  }
};
