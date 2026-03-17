import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const medications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg • Daily morning',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFSwT-5aadFHMhGKEa4rO9c6iSh69JjLHqZZ_fnc_9LYb39YDAG7itEm8ZRp7J9vBqXAaiotVlQlIBadyR7X21hVxOzUy8GdyOX_1tfo4J2xT8ag0KPQkgUxV_x1YYErQftFN53o2Q6zbY2E8xUzWXUHc66LdWYYOs1l3Wa4Rwn6SzXZ0C2cmoDOsTQtAQjlr9epFFw-KBRKIF6WCRnsDCSg1RmENovG5xeU43hv-SukdBQ3hdkRbffgDjZIUuE9TG_1FVTVoMdH4',
  },
  {
    id: '2',
    name: 'Atorvastatin',
    dosage: '20mg • Daily night',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-jDf7J-Q_noS3E7vqmgoOkNnibHrSVI3lIC2-OBzqW7GLxOyWB9a7JZGOS6tHXz4i4Gv9Dfx_IpfQgIe3t1fqAifiQXzbL8ajNpQOOfTd0rDfsEtE0w8gzxynDN2_DoEEtme3XwSvLwsUEC_dhNC3udgi0NDvquImmr_In5yrLmoyXniZ_bZPYg7aqSGRKNjcwv2Yuj5N6vj1rPxBa7QhilzSHta2aubuweNlfL4-92K-BwqxGyJxVJqr8KimDEfv4BAljnbP3Lw',
  },
];

const PatientProfileScreen = () => {
  const colors = ['#E6E6FA', '#FFD1DC', '#B0E0E6', '#F0FFF0', '#FFFACD', theme.palette.primary];
  const [selectedColor, setSelectedColor] = React.useState(theme.palette.primary);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Top App Bar */}
        <View style={styles.appBar}>
          <TouchableOpacity>
            <MaterialIcons name="arrow-back" size={24} color={theme.palette.black} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Patient Profile</Text>
          <TouchableOpacity>
            <MaterialIcons name="check" size={24} color={theme.palette.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5n5gJbi4-5X259Ajcx2BpGOtCXPjZtStb5vv_LioQxBv01foeHglq3llY5j1YC0NqU0MnIzA2ulV3bW8oeEGjWe825V6kSLcdCWQ1cqJpx5PYCJ6OrHbtrW_7CjAhY4PRsdz4Ot67JdtJAcJnLD-YoZNzyteFPTtJ1q2cCBMWa7RVSXF3ZdXm_ADDpkgOT6TpgBXYePvtKd5uKbQPA3G28onQGZnrq1FCNyBlDdfpJtZoKsqWg_EnBct-O1OZJMIeqbcaCUGBVb0' }} 
              style={styles.profileImage} 
            />
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={16} color={theme.palette.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.patientName}>María</Text>
          <Text style={styles.patientDetails}>Madre • 72 años</Text>
        </View>

        <View style={styles.mainContent}>
            {/* Personalization */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personalization</Text>
                <Text style={styles.sectionSubtitle}>Patient Color Context</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorPickerContainer}>
                {colors.map((color) => (
                    <TouchableOpacity 
                        key={color} 
                        style={[styles.colorOption, { backgroundColor: color, borderColor: selectedColor === color ? theme.palette.primary : 'transparent' }]} 
                        onPress={() => setSelectedColor(color)}
                    />
                ))}
                </ScrollView>
            </View>

            {/* Information Fields */}
            <View style={styles.section}>
                <View style={styles.infoField}>
                    <Text style={styles.infoLabel}>Full Name</Text>
                    <TextInput style={styles.infoInput} value="María" />
                </View>
                <View style={styles.infoRow}>
                    <View style={[styles.infoField, { flex: 1 }]}>
                        <Text style={styles.infoLabel}>Age</Text>
                        <TextInput style={styles.infoInput} value="72" />
                    </View>
                    <View style={[styles.infoField, { flex: 1 }]}>
                        <Text style={styles.infoLabel}>Relation</Text>
                        <TextInput style={styles.infoInput} value="Madre" />
                    </View>
                </View>
                 <View style={styles.infoField}>
                    <Text style={styles.infoLabel}>General Notes</Text>
                    <View style={styles.notesInputContainer}>
                        <MaterialIcons name="warning" size={16} color={theme.palette.primary} style={{marginTop: 2}}/>
                        <TextInput style={styles.notesInput} value="Alérgica a la penicilina" multiline />
                    </View>
                </View>
            </View>

            {/* Active Medications */}
            <View style={styles.section}>
                 <View style={styles.medicationHeader}>
                    <Text style={styles.sectionTitle}>Active Medications</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <MaterialIcons name="add-circle" size={18} color={theme.palette.primary} />
                        <Text style={styles.addButtonLabel}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.medicationsContainer}>
                {medications.map((med) => (
                    <TouchableOpacity key={med.id} style={styles.medicationCard}>
                        <Image source={{ uri: med.image }} style={styles.medicationImage} />
                        <View style={styles.medicationInfo}>
                            <Text style={styles.medicationName}>{med.name}</Text>
                            <Text style={styles.medicationDosage}>{med.dosage}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                    </TouchableOpacity>
                ))}
                </View>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.white,
  },
    scrollViewContent: {
    paddingBottom: theme.spacing.spacingExtraLarge,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.spacingMedium,
    paddingVertical: theme.spacing.spacingSmall,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    padding: theme.spacing.spacingLarge,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.spacingMedium,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.palette.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: theme.palette.primary,
    padding: theme.spacing.spacingSmall,
    borderRadius: theme.borders.borderRadiusFull,
    ...theme.shadows.shadow,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  patientDetails: {
    fontSize: 14,
    color: '#666',
  },
  mainContent: {
      paddingHorizontal: theme.spacing.spacingLarge,
      paddingVertical: theme.spacing.spacingMedium,
  },
  section: {
      marginBottom: theme.spacing.spacingLarge,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: theme.spacing.spacingSmall,
  },
  sectionSubtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: theme.spacing.spacingMedium,
  },
  colorPickerContainer: {
      flexDirection: 'row',
      gap: theme.spacing.spacingMedium,
      alignItems: 'center',
  },
  colorOption: {
      width: 40,
      height: 40,
      borderRadius: theme.borders.borderRadiusFull,
      borderWidth: 3,
  },
  infoField: {
      marginBottom: theme.spacing.spacingMedium,
  },
  infoRow: {
      flexDirection: 'row',
      gap: theme.spacing.spacingMedium,
  },
  infoLabel: {
      fontSize: 12,
      color: '#aaa',
      textTransform: 'uppercase',
      marginBottom: theme.spacing.spacingSmall
  },
  infoInput: {
      backgroundColor: '#f6f7f8',
      padding: theme.spacing.spacingMedium,
      borderRadius: theme.borders.borderRadiusLarge,
      fontSize: 14,
      fontWeight: '500',
  },
  notesInputContainer:{
      backgroundColor: 'rgba(137, 208, 236, 0.1)',
      padding: theme.spacing.spacingMedium,
      borderRadius: theme.borders.borderRadiusLarge,
      borderWidth: 1,
      borderColor: 'rgba(137, 208, 236, 0.2)',
      flexDirection: 'row',
      gap: theme.spacing.spacingSmall,
  },
  notesInput: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
  },
  medicationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.spacingMedium,
  },
  addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.spacingSmall,
  },
  addButtonLabel: {
      color: theme.palette.primary,
      fontWeight: 'bold',
      fontSize: 14,
  },
  medicationsContainer: {
      gap: theme.spacing.spacingMedium,
  },
  medicationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.palette.white,
      padding: theme.spacing.spacingMedium,
      borderRadius: theme.borders.borderRadiusLarge,
      ...theme.shadows.shadow,
  },
  medicationImage: {
      width: 50,
      height: 50,
      borderRadius: theme.borders.borderRadiusMedium,
  },
  medicationInfo: {
      flex: 1,
      marginLeft: theme.spacing.spacingMedium,
  },
  medicationName: {
      fontWeight: 'bold',
      fontSize: 14,
  },
  medicationDosage: {
      fontSize: 12,
      color: '#666',
  }
});

export default PatientProfileScreen;
