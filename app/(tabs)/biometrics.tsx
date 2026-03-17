
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from '@/lib/i18n';
import { usePatient } from '@/hooks/usePatient';
import { useMeasurements } from '@/hooks/useMeasurements';

const BiometricScreen = () => {
  const { patients } = usePatient();
  const [activePatient, setActivePatient] = useState<any>(null);
  const { measurements, addMeasurement, loading } = useMeasurements(activePatient?.id);

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [pressure, setPressure] = useState('');
  const [glucose, setGlucose] = useState('');
  const [comments, setComments] = useState('');
  const [customFields, setCustomFields] = useState<any[]>([]);

  useEffect(() => {
    if (patients.length > 0 && !activePatient) {
      setActivePatient(patients[0]);
    }
  }, [patients]);

  const handleSave = async () => {
    if (!activePatient) return;

    await addMeasurement({
      patientId: activePatient.id,
      dateTime: new Date().toISOString(),
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      bloodPressure: pressure || undefined,
      bloodGlucose: glucose ? parseFloat(glucose) : undefined,
      otherMeasures: customFields.length > 0 ? JSON.stringify(customFields) : undefined,
      comments: comments || undefined,
    });

    // Reset fields
    setWeight('');
    setHeight('');
    setPressure('');
    setGlucose('');
    setComments('');
    setCustomFields([]);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '', unit: '' }]);
  };

  const getTrendIcon = (current: number, field: string, index: number) => {
    if (index === measurements.length - 1) return null; // No previous measurement
    const previous = (measurements[index + 1] as any)[field];
    if (!previous) return null;

    if (current > previous) return <MaterialIcons name="trending-up" size={16} color="#ff3b30" />;
    if (current < previous) return <MaterialIcons name="trending-down" size={16} color="#34c759" />;
    return <MaterialIcons name="trending-flat" size={16} color="#888" />;
  };

  const renderMeasurementItem = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.measurementCard}>
      <View style={styles.measurementHeader}>
        <Text style={styles.measurementDate}>{new Date(item.dateTime).toLocaleDateString()}</Text>
      </View>
      <View style={styles.measurementGrid}>
        {item.weight && (
          <View style={styles.gridItemContainer}>
            <Text style={styles.gridItem}>{i18n.t('biometrics.weight')}: {item.weight} kg</Text>
            {getTrendIcon(item.weight, 'weight', index)}
          </View>
        )}
        {item.height && <Text style={styles.gridItem}>{i18n.t('biometrics.height')}: {item.height} cm</Text>}
        {item.bloodPressure && <Text style={styles.gridItem}>{i18n.t('biometrics.blood_pressure')}: {item.bloodPressure}</Text>}
        {item.bloodGlucose && (
          <View style={styles.gridItemContainer}>
            <Text style={styles.gridItem}>{i18n.t('biometrics.blood_glucose')}: {item.bloodGlucose} mg/dL</Text>
            {getTrendIcon(item.bloodGlucose, 'bloodGlucose', index)}
          </View>
        )}
      </View>
      {item.otherMeasures && (
        <View style={styles.customValuesContainer}>
          {JSON.parse(item.otherMeasures).map((cf: any, idx: number) => (
            <Text key={idx} style={styles.customValueText}>{cf.name}: {cf.value} {cf.unit}</Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, activePatient?.bg_color_hex && { borderBottomColor: activePatient.bg_color_hex }]}>
        <Text style={[styles.headerTitle, activePatient?.bg_color_hex && { color: activePatient.bg_color_hex }]}>{i18n.t('biometrics.title')}</Text>
      </View>

      <View style={styles.patientSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.patientList}>
          {patients.map(p => (
            <TouchableOpacity 
              key={p.id} 
              onPress={() => setActivePatient(p)} 
              style={[styles.patientItem, activePatient?.id === p.id && styles.patientItemActive]}
            >
              <Image source={{ uri: p.profile_pic_uri || 'https://via.placeholder.com/150' }} style={[styles.patientAvatar, activePatient?.id === p.id && p.bg_color_hex && { borderColor: p.bg_color_hex, borderWidth: 2 }]} />
              <Text style={[styles.patientName, activePatient?.id === p.id && { color: p.bg_color_hex || theme.palette.primary, fontWeight: 'bold' }]}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{i18n.t('biometrics.weight')} (kg)</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="0.0" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{i18n.t('biometrics.height')} (cm)</Text>
            <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="0" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{i18n.t('biometrics.blood_pressure')}</Text>
            <TextInput style={styles.input} value={pressure} onChangeText={setPressure} placeholder="120/80" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{i18n.t('biometrics.blood_glucose')} (mg/dL)</Text>
            <TextInput style={styles.input} value={glucose} onChangeText={setGlucose} keyboardType="numeric" placeholder="0" />
          </View>

          {customFields.map((field, index) => (
            <View key={index} style={styles.customFieldRow}>
              <TextInput 
                style={[styles.input, { flex: 2 }]} 
                placeholder={i18n.t('biometrics.placeholder_name')}
                value={field.name}
                onChangeText={(text) => {
                  const newFields = [...customFields];
                  newFields[index].name = text;
                  setCustomFields(newFields);
                }}
              />
              <TextInput 
                style={[styles.input, { flex: 1 }]} 
                placeholder={i18n.t('biometrics.placeholder_value')}
                value={field.value}
                onChangeText={(text) => {
                  const newFields = [...customFields];
                  newFields[index].value = text;
                  setCustomFields(newFields);
                }}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addCustomButton} onPress={addCustomField}>
            <MaterialIcons name="add" size={20} color={activePatient?.bg_color_hex || theme.palette.primary} />
            <Text style={[styles.addCustomText, activePatient?.bg_color_hex && { color: activePatient.bg_color_hex }]}>{i18n.t('biometrics.add_custom')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.saveButton, activePatient?.bg_color_hex && { backgroundColor: activePatient.bg_color_hex }]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{i18n.t('biometrics.save_measurement')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>{i18n.t('analytics.history_title')}</Text>
          {loading ? (
            <ActivityIndicator color={activePatient?.bg_color_hex || theme.palette.primary} />
          ) : (
            <FlatList
              data={measurements}
              renderItem={(props) => renderMeasurementItem({ ...props })}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          )}
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  patientSelector: {
    backgroundColor: theme.palette.white,
    paddingVertical: theme.spacing.spacingMedium,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  patientList: {
    paddingHorizontal: theme.spacing.spacingLarge,
    gap: 16,
  },
  patientItem: {
    alignItems: 'center',
    gap: 4,
    opacity: 0.6,
  },
  patientItemActive: {
    opacity: 1,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  patientName: {
    fontSize: 12,
  },
  patientNameActive: {
    fontWeight: 'bold',
    color: theme.palette.primary,
  },
  scrollContent: {
    padding: theme.spacing.spacingLarge,
  },
  formCard: {
    backgroundColor: theme.palette.white,
    padding: theme.spacing.spacingLarge,
    borderRadius: theme.borders.borderRadiusLarge,
    ...theme.shadows.shadow,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f6f7f8',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  customFieldRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  addCustomText: {
    color: theme.palette.primary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: theme.palette.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historySection: {
    gap: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  measurementCard: {
    backgroundColor: theme.palette.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...theme.shadows.shadow,
  },
  measurementHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  measurementDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.palette.primary,
  },
  measurementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridItem: {
    fontSize: 14,
    color: '#444',
  },
  customValuesContainer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f9f9f9',
  },
  customValueText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  }
});

export default BiometricScreen;
