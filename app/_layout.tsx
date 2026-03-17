
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exportData } from '../lib/backup';

import { useColorScheme } from '@/hooks/use-color-scheme';
import SplashScreen from '../components/splash-screen';
import i18n from '../lib/i18n';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
  if (error) {
    console.error("Background task error:", error);
    return;
  }
  if (data) {
    const { actionIdentifier, notification } = data as any;
    if (actionIdentifier === 'mark-as-taken') {
      const medicationId = notification.request.content.data.medicationId;
      
      try {
        const sqlite = await SQLite.openDatabaseAsync('caresync_v1.db');
        const db = drizzle(sqlite, { schema });
        
        await db.update(schema.intakes)
          .set({ 
            status: 'completed', 
            actualTime: new Date().toISOString() 
          })
          .where(eq(schema.intakes.localNotificationId, notification.request.identifier));
          
        console.log(`Medication ${medicationId} marked as taken in background`);
      } catch (err) {
        console.error("Error updating intake in background:", err);
      }
    } else if (actionIdentifier === 'snooze-15') {
      const scheduledTime = new Date(Date.now() + 15 * 60 * 1000);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          ...notification.request.content,
          title: `[POSPUESTO] ${notification.request.content.title}`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: scheduledTime,
        } as Notifications.NotificationTriggerInput,
      });
      console.log("Notification snoozed for 15 minutes");
    }
  }
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Define notification categories
        await Notifications.setNotificationCategoryAsync('medication-reminder', [
          {
            identifier: 'mark-as-taken',
            buttonTitle: i18n.t('medication.mark_as_taken'),
            options: { opensAppToForeground: false },
          },
          {
            identifier: 'snooze-15',
            buttonTitle: i18n.t('medication.snooze_15'),
            options: { opensAppToForeground: false },
          },
        ]);
        // Check for weekly backup
        const lastBackup = await AsyncStorage.getItem('last_backup_date');
        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (!lastBackup || now - parseInt(lastBackup) > sevenDays) {
          console.log("Triggering weekly auto-backup...");
          await exportData();
          await AsyncStorage.setItem('last_backup_date', now.toString());
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
