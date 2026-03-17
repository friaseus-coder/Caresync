
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const patients = sqliteTable('Patients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  relation: text('relation'),
  profilePicUri: text('profile_pic_uri'),
  bgColorHex: text('bg_color_hex'),
  customMeasurementFields: text('custom_measurement_fields'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const medications = sqliteTable('Medications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id),
  name: text('name').notNull(),
  photoUri: text('photo_uri'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  frequencyType: text('frequency_type').notNull(), // 'daily', etc. (original schema had this)
  frequencyInterval: integer('frequency_interval').notNull(),
  generalNotes: text('general_notes'),
  // Fields found in useMedication.ts but not in use-db.ts schema
  dosage: text('dosage'), 
  intakeFrequency: text('intake_frequency'),
  intakeTimes: text('intake_times'),
});

export const intakes = sqliteTable('Intakes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  medicationId: integer('medication_id')
    .notNull()
    .references(() => medications.id),
  scheduledTime: text('scheduled_time').notNull(),
  actualTime: text('actual_time'),
  status: text('status').notNull(), // 'pending', 'completed', etc.
  intakeNotes: text('intake_notes'),
  calendarEventId: text('calendar_event_id'),
  localNotificationId: text('local_notification_id'),
});

export const measurements = sqliteTable('Measurements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id),
  dateTime: text('date_time').notNull(),
  weight: real('weight'),
  height: real('height'),
  bloodPressure: text('blood_pressure'),
  bloodGlucose: real('blood_glucose'),
  otherMeasures: text('other_measures'),
  comments: text('comments'),
});

export const analyticsRecords = sqliteTable('Analytics_Records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id),
  date: text('date').notNull(),
  photoUri: text('photo_uri').notNull(),
  extractedTextOcr: text('extracted_text_ocr'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});
