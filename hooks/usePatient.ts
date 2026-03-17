
import { useState, useEffect } from 'react';
import { useDB } from '../lib/use-db';
import * as schema from '../lib/db/schema';
import { eq } from 'drizzle-orm';

export interface Patient {
  id: number;
  name: string;
  relation?: string;
  profile_pic_uri?: string;
  bg_color_hex?: string;
  custom_measurement_fields?: string;
  created_at?: string;
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
    if (!db) return;
    const allPatients = await db.query.patients.findMany();
    setPatients(allPatients as unknown as Patient[]);
  };

  const addPatient = async (patient: Partial<PatientToAdd>) => {
    const { name, relation, profile_pic_uri, bg_color_hex, custom_measurement_fields } = patient;

    if (!db) return;

    await db.insert(schema.patients).values({
      name: name!,
      relation,
      profilePicUri: profile_pic_uri,
      bgColorHex: bg_color_hex,
      customMeasurementFields: custom_measurement_fields,
    });

    fetchPatients();
  };

  const updatePatient = async (patient: Patient) => {
    const { id, name, relation, profile_pic_uri, bg_color_hex, custom_measurement_fields } = patient;

    if (!db) return;

    await db.update(schema.patients)
      .set({
        name,
        relation,
        profilePicUri: profile_pic_uri,
        bgColorHex: bg_color_hex,
        customMeasurementFields: custom_measurement_fields,
      })
      .where(eq(schema.patients.id, id));

    fetchPatients();
  };

  const deletePatient = async (id: number) => {
    if (!db) return;
    await db.delete(schema.patients).where(eq(schema.patients.id, id));
    fetchPatients();
  };

  return { patients, addPatient, updatePatient, deletePatient, fetchPatients };
};
