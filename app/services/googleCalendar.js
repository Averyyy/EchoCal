import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/calendar.events'],
  webClientId: 'YOUR_WEB_CLIENT_ID', // From Google Cloud Console
  offlineAccess: true,
});

export const addEventToCalendar = async eventDetails => {
  try {
    const tokens = await GoogleSignin.getTokens();

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: eventDetails.title,
          description: eventDetails.notes,
          start: {
            dateTime: `${eventDetails.date}T${eventDetails.time}:00`,
            timeZone: 'UTC', // Adjust time zone as needed
          },
          end: {
            dateTime: `${eventDetails.date}T${
              eventDetails.endTime || eventDetails.time
            }:00`,
            timeZone: 'UTC',
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
