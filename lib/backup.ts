import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
const { documentDirectory } = FileSystem;
import i18n from './i18n';

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'caresync_v1.db';

const simpleEncrypt = (text: string, key: string) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};

export const exportData = async () => {
  const dbPath = (documentDirectory || '') + 'SQLite/' + DATABASE_NAME;
  const fileInfo = await FileSystem.getInfoAsync(dbPath);
  
  if (!fileInfo.exists) {
    console.error("Database file not found for backup");
    return;
  }

  // Read the database file as string
  const data = await FileSystem.readAsStringAsync(dbPath, { encoding: 'base64' });
  const encryptedData = simpleEncrypt(data, 'caresync_secret_key');
  
  const fileUri = (documentDirectory || '') + 'caresync_backup.enc';
  await FileSystem.writeAsStringAsync(fileUri, encryptedData);

  const isAvailable = await MailComposer.isAvailableAsync();

  if (isAvailable) {
    await MailComposer.composeAsync({
      recipients: [],
      subject: i18n.t('backup.email_subject'),
      body: i18n.t('backup.email_body'),
      attachments: [fileUri],
    });
  } else {
    alert(i18n.t('backup.error_mail_unavailable'));
  }
};
