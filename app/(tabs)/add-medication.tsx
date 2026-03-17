
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MedicationForm from '../../components/medication-form';
import MedicationList from '../../components/MedicationList';

const AddMedicationScreen = () => {
  return (
    <View style={styles.container}>
      <MedicationForm />
      <MedicationList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddMedicationScreen;
