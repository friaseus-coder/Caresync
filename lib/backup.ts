
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';

// Dummy data for the purpose of this example
const dummyData = {
  users: [{ id: 1, name: 'John Doe' }],
  patients: [{ id: 1, name: 'Jane Doe', userId: 1 }],
  medications: [{ id: 1, name: 'Aspirin', patientId: 1 }],
  analytics: [{ id: 1, type: 'Blood Pressure', value: '120/80' }],
  biometrics: [{ id: 1, type: 'Weight', value: '70kg' }],
};

export const exportData = async () => {
  const dataString = JSON.stringify(dummyData, null, 2);
  const fileUri = FileSystem.documentDirectory + 'backup.json';

  await FileSystem.writeAsStringAsync(fileUri, dataString);

  const isAvailable = await MailComposer.isAvailableAsync();

  if (isAvailable) {
    await MailComposer.composeAsync({
      recipients: [],
      subject: 'Backup de Datos de CareSync',
      body: 'Adjunto se encuentra el backup de los datos de la aplicación.',
      attachments: [fileUri],
    });
  } else {
    alert('El servicio de correo no está disponible en este dispositivo.');
  }
};
