
import { useState, useEffect, useCallback } from 'react';
import { useDB } from '../lib/use-db';
import * as schema from '../lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export interface MeasurementInstance {
  id: number;
  patientId: number;
  dateTime: string;
  weight?: number;
  height?: number;
  bloodPressure?: string;
  bloodGlucose?: number;
  otherMeasures?: string; // JSON string for custom fields
  comments?: string;
}

export const useMeasurements = (patientId?: number) => {
  const db = useDB();
  const [measurements, setMeasurements] = useState<MeasurementInstance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeasurements = useCallback(async () => {
    if (!db || !patientId) return;
    
    try {
      setLoading(true);
      const results = await db.query.measurements.findMany({
        where: eq(schema.measurements.patientId, patientId),
        orderBy: [desc(schema.measurements.dateTime)],
      });
      setMeasurements(results as MeasurementInstance[]);
    } catch (error) {
      console.error("Error fetching measurements:", error);
    } finally {
      setLoading(false);
    }
  }, [db, patientId]);

  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);

  const addMeasurement = async (data: Omit<MeasurementInstance, 'id'>) => {
    if (!db) return;
    
    try {
      await db.insert(schema.measurements).values({
        patientId: data.patientId,
        dateTime: data.dateTime,
        weight: data.weight,
        height: data.height,
        bloodPressure: data.bloodPressure,
        bloodGlucose: data.bloodGlucose,
        otherMeasures: data.otherMeasures,
        comments: data.comments,
      });
      await fetchMeasurements();
    } catch (error) {
      console.error("Error adding measurement:", error);
    }
  };

  const deleteMeasurement = async (id: number) => {
    if (!db) return;
    
    try {
      await db.delete(schema.measurements).where(eq(schema.measurements.id, id));
      await fetchMeasurements();
    } catch (error) {
      console.error("Error deleting measurement:", error);
    }
  };

  return {
    measurements,
    loading,
    addMeasurement,
    deleteMeasurement,
    refreshMeasurements: fetchMeasurements,
  };
};
