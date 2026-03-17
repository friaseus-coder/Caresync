import * as FileSystem from 'expo-file-system';
const { documentDirectory } = FileSystem;
import i18n from './i18n';

const DATABASE_NAME = 'caresync_v1.db';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

export const backupToDrive = async (accessToken: string) => {
  try {
    const dbPath = `${documentDirectory}SQLite/${DATABASE_NAME}`;
    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (!fileInfo.exists) {
      console.error("Database file not found for backup");
      return;
    }

    const boundary = 'foo_bar_baz';
    const metadata = {
      name: `caresync_backup_${new Date().toISOString().split('T')[0]}.db`,
      mimeType: 'application/x-sqlite3',
      // parents: ['appDataFolder'] // Use this for private app data
    };

    const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
    
    // Read the file as base64 for multipart upload
    const fileContentBase64 = await FileSystem.readAsStringAsync(dbPath, {
      encoding: 'base64',
    });

    const body = `${metadataPart}--${boundary}\r\nContent-Type: application/x-sqlite3\r\nContent-Transfer-Encoding: base64\r\n\r\n${fileContentBase64}\r\n--${boundary}--`;

    const response = await fetch(DRIVE_UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: body,
    });

    if (response.ok) {
        console.log("Backup successful!");
        return true;
    } else {
        const errorData = await response.json();
        console.error("Backup failed", errorData);
        return false;
    }
  } catch (error) {
    console.error("Error during Drive backup:", error);
    return false;
  }
};
