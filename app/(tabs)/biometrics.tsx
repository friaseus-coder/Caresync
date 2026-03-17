
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

// Dummy data for biometric measurements
const initialMeasurements = [
  { id: '1', name: 'Presión Arterial', value: '120/80', unit: 'mmHg' },
  { id: '2', name: 'Glucosa en Sangre', value: '95', unit: 'mg/dL' },
  { id: '3', name: 'Peso Corporal', value: '70', unit: 'kg' },
];

const BiometricScreen = () => {
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [customMeasurementFields, setCustomMeasurementFields] = useState([]);

  const addCustomField = () => {
    setCustomMeasurementFields([...customMeasurementFields, { id: Date.now().toString(), name: '', value: '', unit: '' }]);
  };

  const renderMeasurementItem = ({ item }) => (
    <View style={styles.measurementCard}>
      <Text style={styles.measurementName}>{item.name}</Text>
      <Text style={styles.measurementValue}>{item.value} {item.unit}</Text>
    </View>
  );

  const renderCustomField = ({ item, index }) => (
    <View style={styles.customFieldContainer}>
      <TextInput
        style={styles.customInput}
        placeholder="Nombre de la Medición"
        // Handle input changes
      />
      <TextInput
        style={styles.customInput}
        placeholder="Valor"
        // Handle input changes
      />
      <TextInput
        style={styles.customInput}
        placeholder="Unidad"
        // Handle input changes
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mediciones Biométricas</Text>
      </View>
      <ScrollView>
        <View style={styles.mainContent}>
          <FlatList
            data={measurements}
            renderItem={renderMeasurementItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.measurementList}
          />
          <FlatList
            data={customMeasurementFields}
            renderItem={renderCustomField}
            keyExtractor={item => item.id}
          />
          <TouchableOpacity style={styles.addButton} onPress={addCustomField}>
            <MaterialIcons name="add-circle" size={24} color={theme.palette.primary} />
            <Text style={styles.addButtonLabel}>Añadir Medición Personalizada</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.backgroundLight,
  },
  header: {
    backgroundColor: theme.palette.white,
    padding: theme.spacing.spacingLarge,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
  mainContent: {
    padding: theme.spacing.spacingLarge,
  },
  measurementList: {
    marginBottom: theme.spacing.spacingLarge,
  },
  measurementCard: {
    backgroundColor: theme.palette.white,
    padding: theme.spacing.spacingLarge,
    borderRadius: theme.borders.borderRadiusLarge,
    marginBottom: theme.spacing.spacingMedium,
    ...theme.shadows.shadow,
  },
  measurementName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  measurementValue: {
    fontSize: 14,
    color: '#666',
    marginTop: theme.spacing.spacingSmall,
  },
  customFieldContainer: {
    flexDirection: 'row',
    gap: theme.spacing.spacingMedium,
    marginBottom: theme.spacing.spacingMedium,
  },
  customInput: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    padding: theme.spacing.spacingMedium,
    borderRadius: theme.borders.borderRadiusLarge,
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.spacingLarge,
    borderRadius: theme.borders.borderRadiusLarge,
    backgroundColor: theme.palette.white,
    ...theme.shadows.shadow,
    gap: theme.spacing.spacingMedium,
  },
  addButtonLabel: {
    color: theme.palette.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BiometricScreen;
