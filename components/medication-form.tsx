
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import i18n from '../lib/i18n';
import { useMedication } from '../lib/useMedication';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // Importar Picker

const MedicationForm = () => {
  const t = i18n.t.bind(i18n);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [patientId, setPatientId] = useState('');
  const [intakeFrequency, setIntakeFrequency] = useState('Daily');
  const [intakeTimes, setIntakeTimes] = useState([new Date()]); // Usar Date para las horas
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(-1); // -1: oculto, 0+: índice de la hora a editar


  const { addMedication } = useMedication();

  const handleSave = () => {
    // TODO: Implement actual patient ID handling
    const newMedication = {
        patient_id: parseInt(patientId) || 1, 
        name: medicationName,
        dosage: dosage,
        intake_frequency: intakeFrequency,
        // Formatear las horas como strings (HH:mm) antes de guardarlas
        intake_times: JSON.stringify(intakeTimes.map(date => date.toTimeString().slice(0, 5))),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        notes: notes
    };
    addMedication(newMedication);
    // Reset form
    setMedicationName('');
    setDosage('');
    setPatientId('');
    setIntakeFrequency('Daily');
    setIntakeTimes([new Date()]);
    setStartDate(new Date());
    setEndDate(new Date());
    setNotes('');
  };

  const handleIntakeTimeChange = (event: any, selectedDate: Date | undefined, index: number) => {
    const newIntakeTimes = [...intakeTimes];
    if (selectedDate) {
        newIntakeTimes[index] = selectedDate;
        setIntakeTimes(newIntakeTimes);
    }
    setShowTimePicker(-1); // Ocultar el selector de hora
  };

  const addIntakeTime = () => {
    setIntakeTimes([...intakeTimes, new Date()]);
  };

  const onStartDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowStartDatePicker(false); // Ocultar siempre el selector
    if (selectedDate) {
        setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowEndDatePicker(false); // Ocultar siempre el selector
    if (selectedDate) {
        setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('medication.name')}</Text>
      <TextInput
        style={styles.input}
        value={medicationName}
        onChangeText={setMedicationName}
        placeholder={t('medication.namePlaceholder')}
      />

      <Text style={styles.label}>{t('medication.dosage')}</Text>
      <TextInput
        style={styles.input}
        value={dosage}
        onChangeText={setDosage}
        placeholder={t('medication.dosagePlaceholder')}
        keyboardType="numeric"
      />
        
      <Text style={styles.label}>{t('medication.patientId')}</Text>
      <TextInput
        style={styles.input}
        value={patientId}
        onChangeText={setPatientId}
        placeholder={t('medication.patientIdPlaceholder')}
        keyboardType="numeric"
      />

        <Text style={styles.label}>{t('medication.intakeFrequency')}</Text>
        <Picker
            selectedValue={intakeFrequency}
            onValueChange={(itemValue) => setIntakeFrequency(itemValue)}
            style={styles.input}
        >
            <Picker.Item label={t('frequency.daily')} value="Daily" />
            <Picker.Item label={t('frequency.weekly')} value="Weekly" />
            <Picker.Item label={t('frequency.asNeeded')} value="As Needed" />
        </Picker>

        <Text style={styles.label}>{t('medication.intakeTimes')}</Text>
        {intakeTimes.map((time, index) => (
            <View key={index}>
                <Button onPress={() => setShowTimePicker(index)} title={time.toTimeString().slice(0, 5)} />
                {showTimePicker === index && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => handleIntakeTimeChange(event, selectedDate, index)}
                    />
                )}
            </View>
        ))}
        <Button title={t('medication.addIntakeTime')} onPress={addIntakeTime} />


        <View style={styles.datePickerContainer}>
            <Button onPress={() => setShowStartDatePicker(true)} title={t('medication.selectStartDate')} />
            <Text>{startDate.toLocaleDateString()}</Text>
            {showStartDatePicker && (
                <DateTimePicker
                testID="startDatePicker"
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
                />
            )}
        </View>

        <View style={styles.datePickerContainer}>
            <Button onPress={() => setShowEndDatePicker(true)} title={t('medication.selectEndDate')} />
            <Text>{endDate.toLocaleDateString()}</Text>
            {showEndDatePicker && (
                <DateTimePicker
                testID="endDatePicker"
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
                />
            )}
        </View>

        <Text style={styles.label}>{t('medication.notes')}</Text>
        <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('medication.notesPlaceholder')}
            multiline
        />

      <Button title={t('common.save')} onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  }
});

export default MedicationForm;
