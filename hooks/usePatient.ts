
import { useState, useEffect } from 'react';
import { useDB } from '../lib/use-db';

export interface Patient {
  id: number;
  name: string;
  relation?: string;
  profile_pic_uri?: string;
  bg_color_hex?: string;
  custom_measurement_fields?: string;
  created_at: string;
}

// For addPatient, we don't have an id yet.
type PatientToAdd = Omit<Patient, 'id' | 'created_at'>;

export const usePatient = () => {
  const db = useDB();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (db) {
      fetchPatients();
    }
  }, [db]);

  const fetchPatients = async () => {
    // The result from getAllAsync will be an array of objects.
    // It's a good practice to type it.
    const allRows = await db.getAllAsync<Patient>('SELECT * FROM Patients');
    setPatients(allRows);
  };

  const addPatient = async (patient: Partial<PatientToAdd>) => {
    const { name, relation, profile_pic_uri, bg_color_hex, custom_measurement_fields } = patient;

    await db.runAsync(
      'INSERT INTO Patients (name, relation, profile_pic_uri, bg_color_hex, custom_measurement_fields) values (?, ?, ?, ?, ?)',
      [name, relation, profile_pic_uri, bg_color_hex, custom_measurement_fields]
    );

    fetchPatients();
  };

  const updatePatient = async (patient: Patient) => {
    const { id, name, relation, profile_pic_uri, bg_color_hex, custom_measurement_fields } = patient;

    await db.runAsync(
      'UPDATE Patients SET name = ?, relation = ?, profile_pic_uri = ?, bg_color_hex = ?, custom_measurement_fields = ? WHERE id = ?',
      [name, relation, profile_pic_uri, bg_color_hex, custom_measurement_fields, id]
    );

    fetchPatients();
  };

  const deletePatient = async (id: number) => {
    await db.runAsync('DELETE FROM Patients WHERE id = ?', [id]);
    fetchPatients();
  };

  return { patients, addPatient, updatePatient, deletePatient, fetchPatients };
};
