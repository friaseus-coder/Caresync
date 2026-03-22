import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import i18n from '../lib/i18n';
import { useMedication } from '../lib/useMedication';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const MedicationForm = () => {
  const t = i18n.t.bind(i18n);
  const [medicationName, setMedicationName] = useState('');
  const [frequency, setFrequency] = useState('8h');
  const [startDate, setStartDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [syncCalendar, setSyncCalendar] = useState(true);
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const { addMedication } = useMedication();
  const router = useRouter();

  const handleSave = async () => {
    const newMedication = {
        patient_id: 1, 
        name: medicationName,
        dosage: '', // Default unused in this new UI
        intake_frequency: frequency,
        intake_times: JSON.stringify([startDate.toTimeString().slice(0, 5)]),
        start_date: startDate.toISOString(),
        end_date: startDate.toISOString(),
        notes: notes
    };
    
    await addMedication(newMedication);
    
    // Feedback táctil
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Alert de éxito
    Alert.alert(
      t('addMedication.success_title') || 'Éxito',
      t('addMedication.success_message') || 'La medicación se ha guardado correctamente.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );

    // Reset form
    setMedicationName('');
    setFrequency('8h');
    setStartDate(new Date());
    setNotes('');
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
    >
        <View style={styles.container}>
        {/* Progress Bar Section */}
        <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
                <Text style={styles.stepTitle}>{t('addMedication.step1')}</Text>
                <Text style={styles.stepCount}>{t('addMedication.stepProgress', { step: 1, total: 3 })}</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
            </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}>
            {/* Step 1: Medicine Info */}
            <View style={styles.section}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('addMedication.medicineName')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('addMedication.medicineNamePlaceholder')}
                        placeholderTextColor="#9ca3af"
                        value={medicationName}
                        onChangeText={setMedicationName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('addMedication.photoUpload')}</Text>
                    <TouchableOpacity style={styles.photoUploadContainer}>
                        <View style={styles.cameraIconContainer}>
                            <MaterialIcons name="photo-camera" size={28} color="#89d0ec" />
                        </View>
                        <Text style={styles.uploadTitle}>{t('addMedication.takeOrUpload')}</Text>
                        <Text style={styles.uploadSubtitle}>{t('addMedication.captureBox')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Step 2: Schedule */}
            <View style={[styles.section, styles.borderTop]}>
                <Text style={styles.sectionTitle}>{t('addMedication.schedule')}</Text>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('addMedication.startDate')}</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowStartDatePicker(true)}>
                        <Text style={styles.inputText}>{startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowStartDatePicker(Platform.OS === 'ios');
                                if (selectedDate) setStartDate(selectedDate);
                            }}
                        />
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('addMedication.frequency')}</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={frequency}
                            onValueChange={(itemValue) => setFrequency(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label={t('addMedication.every8h')} value="8h" />
                            <Picker.Item label={t('addMedication.every12h')} value="12h" />
                            <Picker.Item label={t('addMedication.daily')} value="daily" />
                            <Picker.Item label={t('addMedication.weekly')} value="weekly" />
                            <Picker.Item label={t('addMedication.customSchedule')} value="custom" />
                        </Picker>
                    </View>
                </View>
            </View>

            {/* Step 3: Integration & Notes */}
            <View style={[styles.section, styles.borderTop]}>
                <View style={styles.syncCard}>
                    <View style={styles.syncCardLeft}>
                        <MaterialIcons name="calendar-month" size={24} color="#89d0ec" />
                        <View style={styles.syncCardText}>
                            <Text style={styles.syncTitle}>{t('addMedication.syncCalendar')}</Text>
                        </View>
                    </View>
                    <Switch
                        trackColor={{ false: "#cbd5e1", true: "#89d0ec" }}
                        thumbColor="#ffffff"
                        onValueChange={setSyncCalendar}
                        value={syncCalendar}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('addMedication.notes')}</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder={t('addMedication.notesPlaceholder')}
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={3}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>
            </View>
        </ScrollView>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{t('addMedication.saveMedication')}</Text>
                <MaterialIcons name="check-circle" size={20} color="#ffffff" />
            </TouchableOpacity>
        </View>
        </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  progressSection: {
    padding: 16,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  stepCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(137, 208, 236, 0.2)',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '33.33%',
    backgroundColor: '#89d0ec',
    borderRadius: 9999,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
    paddingVertical: 16,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(137, 208, 236, 0.2)',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0f172a',
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    height: 80,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  photoUploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(137, 208, 236, 0.3)',
    backgroundColor: 'rgba(137, 208, 236, 0.05)',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  cameraIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(137, 208, 236, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'rgba(137, 208, 236, 0.2)',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 56,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(137, 208, 236, 0.1)',
    borderRadius: 12,
  },
  syncCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  syncCardText: {
    justifyContent: 'center',
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  saveButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#89d0ec',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#89d0ec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicationForm;
