
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes, NotificationTriggerInput } from 'expo-notifications';
import { Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useDB } from './use-db';
import * as schema from './db/schema';
import { eq } from 'drizzle-orm';
import i18n from './i18n';

export interface Medication {
  id: number;
  patient_id: number;
  name: string;
  dosage: string;
  intake_frequency: string; // e.g., 'daily'
  intake_times: string; // JSON array of times, e.g., '["08:00", "20:00"]'
  start_date: string; // ISO 8601 string
  end_date: string; // ISO 8601 string
  notes?: string;
}

// For addMedication, we don't have an id yet.
type MedicationToAdd = Omit<Medication, 'id'>;

// Define a type for the data needed for notifications
interface NotificationData {
  name: string;
  startDate: string;
  endDate: string;
  intakeTimes: string;
}

// Define a type for the data needed for calendar events
interface CalendarEventData extends NotificationData {
  notes?: string;
}

export const useMedication = () => {
  const db = useDB();
  const [medications, setMedications] = useState<Medication[]>([]);
  const { accessToken, user } = useAuth();

  useEffect(() => {
    if (db) {
      registerForPushNotificationsAsync();
      fetchMedications();
    }
  }, [db]);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  };

  const fetchMedications = async () => {
    if (!db) return;
    const allMedications = await db.query.medications.findMany();
    // Map to the interface Medication if needed, though Drizzle will provide its own types
    setMedications(allMedications as unknown as Medication[]); 
  };

  const addMedication = async (medication: MedicationToAdd) => {
    const { patient_id, name, dosage, intake_frequency, intake_times, start_date, end_date, notes } = medication;

    if (!db) return;

    const result = await db.insert(schema.medications).values({
      patientId: patient_id,
      name,
      dosage,
      intakeFrequency: intake_frequency,
      intakeTimes: intake_times,
      startDate: start_date,
      endDate: end_date,
      generalNotes: notes,
      frequencyType: intake_frequency, // Adjust if these definitions differ
      frequencyInterval: 1, // Placeholder
    }).returning({ insertedId: schema.medications.id });

    const insertedId = result[0].insertedId;

    const notificationMedication: NotificationData = {
      name,
      startDate: start_date,
      endDate: end_date,
      intakeTimes: intake_times,
    };

    await scheduleIntakeNotifications(notificationMedication, insertedId);
    if (accessToken) {
      const calendarMedication: CalendarEventData = {
        ...notificationMedication,
        notes,
      };
      await createCalendarEvent(calendarMedication, insertedId);
    }
    fetchMedications();
  };

  const scheduleIntakeNotifications = async (medication: NotificationData, medicationId: number) => {
    const { startDate, endDate, intakeTimes, name } = medication;
    const intakeTimestamps = calculateIntakeTimestamps(startDate, endDate, intakeTimes);

    for (const timestamp of intakeTimestamps) {
      const notificationDate = new Date(timestamp);

      // Only schedule notifications for future dates
      if (notificationDate.getTime() > Date.now()) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t('notifications.medication_reminder_title'),
            body: i18n.t('notifications.medication_reminder_body', { name }),
            data: { medicationId, scheduledTime: timestamp },
            categoryIdentifier: 'medication-reminder',
          },
          trigger: {
            type: SchedulableTriggerInputTypes.DATE,
            date: notificationDate,
          } as NotificationTriggerInput,
        });

        if (!db) return;
        
        await db.insert(schema.intakes).values({
          medicationId,
          scheduledTime: timestamp,
          status: 'pending',
          localNotificationId: notificationId,
        });
      }
    }
  };

  const createCalendarEvent = async (medication: CalendarEventData, medicationId: number) => {
    const { name, notes, startDate, endDate } = medication;
    const event = {
      summary: `Tomar ${name}`,
      description: notes,
      start: {
        dateTime: new Date(startDate).toISOString(),
        timeZone: 'America/Los_Angeles', // This should probably be dynamic
      },
      end: {
        dateTime: new Date(endDate).toISOString(),
        timeZone: 'America/Los_Angeles', // This should probably be dynamic
      },
      attendees: user ? [{ email: user.email }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const data = await response.json();
      console.log('Calendar event created:', data);
    } catch (error) {
      console.error('Error creating calendar event:', error);
    }
  };

  const calculateIntakeTimestamps = (startDate: string, endDate: string, intakeTimes: string) => {
    // Basic implementation for daily frequency
    // TODO: Implement other frequencies
    let timestamps: string[] = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);
    const times: string[] = JSON.parse(intakeTimes);

    while (currentDate <= finalDate) {
      for (const time of times) {
        const [hours, minutes] = time.split(':').map(Number);
        let intakeDate = new Date(currentDate);
        intakeDate.setHours(hours, minutes, 0, 0);
        timestamps.push(intakeDate.toISOString());
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timestamps;
  };

  return { medications, addMedication, fetchMedications };
};
