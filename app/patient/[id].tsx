import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePatient } from '../../hooks/usePatient';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from '@/lib/i18n';

const PatientFormScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { patients, addPatient, updatePatient, deletePatient } = usePatient();

  const [isNew, setIsNew] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [backgroundColor, setBackgroundColor] = useState('');

  const colors = [useThemeColor({}, 'tint'), '#E6E6FA', '#FFD1DC', '#B0E0E6', '#F0FFF0', '#FFFACD'];

  useEffect(() => {
    if (id && id !== 'new') {
      const existingPatient = patients.find(p => p.id.toString() === id);
      if (existingPatient) {
        setPatient(existingPatient);
        setIsNew(false);
        setName(existingPatient.name);
        setAge(''); // age is not in Patient interface yet, but used in form
        setRelationship(existingPatient.relation || '');
        setNotes(''); // notes is not in Patient interface yet, but used in form
        setProfilePicture(existingPatient.profile_pic_uri || undefined);
        setBackgroundColor(existingPatient.bg_color_hex || colors[0]);
      }
    } else {
      setIsNew(true);
      setBackgroundColor(colors[0]);
    }
  }, [id, patients]);

  const handleSave = () => {
    const patientData = {
      name,
      relation: relationship,
      profile_pic_uri: profilePicture,
      bg_color_hex: backgroundColor,
    };

    if (isNew) {
      addPatient(patientData);
    } else {
      updatePatient({ ...patientData, id: patient.id });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!isNew) {
      deletePatient(patient.id);
      router.back();
    }
  };

  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const white = useThemeColor({light: '#fff', dark: '#000'}, 'background');
  const cardBorder = useThemeColor({}, 'cardBorder');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: background}}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={[styles.scrollViewContent, { flexGrow: 1 }]}>
          <View style={[styles.appBar, {borderBottomColor: cardBorder}]}>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.appBarTitle, {color: textColor}]}>{isNew ? i18n.t('patient_form.new_title') : i18n.t('patient_form.edit_title')}</Text>
            <TouchableOpacity onPress={handleSave}>
              <MaterialIcons name="check" size={24} color={primaryColor} />
            </TouchableOpacity>
          </View>

          <View style={[styles.profileHeader, {borderBottomColor: cardBorder}]}>
            <View style={styles.profileImageContainer}>
              <Image 
                // TODO: Replace with a proper image picker
                source={{ uri: profilePicture || 'https://via.placeholder.com/150' }} 
                style={[styles.profileImage, { borderColor: backgroundColor || 'transparent' }]} 
              />
              <TouchableOpacity style={[styles.editButton, {backgroundColor: primaryColor}]}>
                <MaterialIcons name="edit" size={16} color={white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainContent}>
              <View style={styles.section}>
                  <Text style={[styles.sectionTitle, {color: textColor}]}>{i18n.t('patient_form.personalization')}</Text>
                  <Text style={[styles.sectionSubtitle, {color: textColor}]}>{i18n.t('patient_form.color_context')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorPickerContainer}>
                  {colors.map((color) => (
                      <TouchableOpacity 
                          key={color} 
                          style={[styles.colorOption, { backgroundColor: color, borderColor: backgroundColor === color ? primaryColor : 'transparent' }]} 
                          onPress={() => setBackgroundColor(color)}
                      />
                  ))}
                  </ScrollView>
              </View>

              <View style={styles.section}>
                  <View style={styles.infoField}>
                      <Text style={[styles.infoLabel, {color: textColor}]}>{i18n.t('patient_form.full_name')}</Text>
                      <TextInput style={[styles.infoInput, {color: textColor}]} value={name} onChangeText={setName} />
                  </View>
                  <View style={styles.infoRow}>
                      <View style={[styles.infoField, { flex: 1 }]}>
                          <Text style={[styles.infoLabel, {color: textColor}]}>{i18n.t('patient_form.age')}</Text>
                          <TextInput style={[styles.infoInput, {color: textColor}]} value={age} onChangeText={setAge} keyboardType="numeric" />
                      </View>
                      <View style={[styles.infoField, { flex: 1 }]}>
                          <Text style={[styles.infoLabel, {color: textColor}]}>{i18n.t('patient_form.relation')}</Text>
                          <TextInput style={[styles.infoInput, {color: textColor}]} value={relationship} onChangeText={setRelationship} />
                      </View>
                  </View>
                    <View style={styles.infoField}>
                      <Text style={[styles.infoLabel, {color: textColor}]}>{i18n.t('patient_form.notes')}</Text>
                      <View style={[styles.notesInputContainer, {backgroundColor: 'rgba(137, 208, 236, 0.1)', borderColor: 'rgba(137, 208, 236, 0.2)'}]}>
                          <MaterialIcons name="warning" size={16} color={primaryColor} style={{marginTop: 2}}/>
                          <TextInput style={[styles.notesInput, {color: textColor}]} value={notes} onChangeText={setNotes} multiline />
                      </View>
                  </View>
              </View>

              {!isNew && (
                <View style={styles.section}>
                  <TouchableOpacity style={[styles.deleteButton, {backgroundColor: '#ff3b30'}]} onPress={handleDelete}>
                    <Text style={[styles.deleteButtonText, {color: white}]}>{i18n.t('patient_form.delete_patient')}</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 20,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
  },
  editButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    padding: 10,
    borderRadius: 20,
  },
  mainContent: {
      paddingHorizontal: 20,
      paddingVertical: 20,
  },
  section: {
      marginBottom: 20,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  sectionSubtitle: {
      fontSize: 14,
      marginBottom: 20,
  },
  colorPickerContainer: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
  },
  colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
  },
  infoField: {
      marginBottom: 20,
  },
  infoRow: {
      flexDirection: 'row',
      gap: 20,
  },
  infoLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      marginBottom: 10
  },
  infoInput: {
      backgroundColor: '#f6f7f8',
      padding: 20,
      borderRadius: 10,
      fontSize: 14,
      fontWeight: '500',
  },
  notesInputContainer:{
      padding: 20,
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 10,
  },
  notesInput: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
  },
  deleteButton: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: 'bold',
  },
});

export default PatientFormScreen;
