
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from './db/schema';

const DATABASE_NAME = 'caresync_v1.db';

export const useDB = () => {
  const [db, setDb] = useState<ExpoSQLiteDatabase<typeof schema> | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        console.log("Opening database...");
        const sqlite = await SQLite.openDatabaseAsync(DATABASE_NAME);
        console.log("Database opened successfully.");
        
        // Manual schema creation if not using migrations yet
        // This maintains the original behavior but prepares for Drizzle
        await sqlite.execAsync(
          'CREATE TABLE IF NOT EXISTS Patients (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'name TEXT NOT NULL,' +
          'relation TEXT,' +
          'profile_pic_uri TEXT,' +
          'bg_color_hex TEXT,' +
          'custom_measurement_fields TEXT,' +
          'created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP' +
          ');'
        );
    
        await sqlite.execAsync(
          'CREATE TABLE IF NOT EXISTS Medications (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'patient_id INTEGER NOT NULL,' +
          'name TEXT NOT NULL,' +
          'photo_uri TEXT,' +
          'start_date TEXT NOT NULL,' +
          'end_date TEXT,' +
          'frequency_type TEXT NOT NULL,' +
          'frequency_interval INTEGER NOT NULL,' +
          'general_notes TEXT,' +
          'dosage TEXT,' +
          'intake_frequency TEXT,' +
          'intake_times TEXT,' +
          'FOREIGN KEY(patient_id) REFERENCES Patients(id)' +
          ');'
        );
    
        await sqlite.execAsync(
          'CREATE TABLE IF NOT EXISTS Intakes (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'medication_id INTEGER NOT NULL,' +
          'scheduled_time TEXT NOT NULL,' +
          'actual_time TEXT,' +
          'status TEXT NOT NULL,' +
          'intake_notes TEXT,' +
          'calendar_event_id TEXT,' +
          'local_notification_id TEXT,' +
          'FOREIGN KEY(medication_id) REFERENCES Medications(id)' +
          ');'
        );
    
        await sqlite.execAsync(
          'CREATE TABLE IF NOT EXISTS Measurements (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'patient_id INTEGER NOT NULL,' +
          'date_time TEXT NOT NULL,' +
          'weight REAL,' +
          'height REAL,' +
          'blood_pressure TEXT,' +
          'blood_glucose REAL,' +
          'other_measures TEXT,' +
          'comments TEXT,' +
          'FOREIGN KEY(patient_id) REFERENCES Patients(id)' +
          ');'
        );
    
        await sqlite.execAsync(
          'CREATE TABLE IF NOT EXISTS Analytics_Records (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'patient_id INTEGER NOT NULL,' +
          'date TEXT NOT NULL,' +
          'photo_uri TEXT NOT NULL,' +
          'extracted_text_ocr TEXT,' +
          'created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
          'FOREIGN KEY(patient_id) REFERENCES Patients(id)' +
          ');'
        );

        const drizzleDb = drizzle(sqlite, { schema });
        setDb(drizzleDb);
      } catch (error) {
        console.error("Error setting up database:", error);
      }
    }
    
    setup();
  }, []);

  return db;
};
