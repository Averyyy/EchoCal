// ./app/services/localCalendar.js

import RNCalendarEvents from 'react-native-calendar-events';
import {Platform} from 'react-native';

export const addEventToLocalCalendar = async eventDetails => {
  try {
    // Request calendar permission
    const authStatus = await RNCalendarEvents.requestPermissions();
    if (authStatus !== 'authorized') {
      throw new Error('Calendar permission not granted');
    }

    // Create the event
    const eventConfig = {
      title: eventDetails.title,
      startDate: `${eventDetails.date}T${eventDetails.time}:00.000Z`,
      endDate: `${eventDetails.date}T${eventDetails.time}:00.000Z`,
      notes: eventDetails.notes,
      alarms: [
        {
          date: 0, // Alarm at time of event
        },
      ],
    };

    const eventId = await RNCalendarEvents.saveEvent(
      eventDetails.title,
      eventConfig,
    );

    console.log('Event added successfully:', eventId);
    return eventId;
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    throw error;
  }
};
