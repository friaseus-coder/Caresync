import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { usePatient } from '../../hooks/usePatient';
import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import i18n from '@/lib/i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

const PatientsScreen = () => {
  const { patients } = usePatient();

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name="person-add-alt-1" size={80} color={theme.palette.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: textColor }]}>
        {i18n.t('patients.empty_state_title') || 'No hay pacientes aún'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {i18n.t('patients.empty_state_subtitle') || 'Añade a tu primer paciente para empezar a gestionar su medicación.'}
      </Text>
      <Link href="/patient/new" asChild>
        <TouchableOpacity style={styles.emptyAddButton}>
          <Text style={styles.emptyAddButtonText}>{i18n.t('patients.add_first_patient') || 'Añadir Paciente'}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  const renderItem = ({ item }) => (
    <Link href={`/patient/${item.id}`} asChild>
      <TouchableOpacity style={styles.patientCard}>
        <View style={[styles.profileImage, { backgroundColor: item.bg_color_hex || '#ccc' }]} />
        <View style={styles.patientInfo}>
          <Text style={[styles.patientName, { color: textColor }]}>{item.name}</Text>
          <Text style={styles.patientRelationship}>{item.relation}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
    </Link>
  );

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const headerBackground = useThemeColor({}, 'card');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: headerBackground }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>{i18n.t('bottom_nav.patients')}</Text>
        <Link href="/patient/new" asChild>
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="add" size={24} color={theme.palette.white} />
          </TouchableOpacity>
        </Link>
      </View>
      <FlatList
        data={patients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.listContainer, patients.length === 0 && { flex: 1 }]}
        ListEmptyComponent={EmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    backgroundColor: theme.palette.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: theme.palette.primary,
    padding: theme.spacing.small,
    borderRadius: theme.borders.radius.full,
  },
  listContainer: {
    padding: theme.spacing.medium,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.palette.white,
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.shadow,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borders.radius.full,
    marginRight: theme.spacing.medium,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientRelationship: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(137, 208, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyAddButton: {
    backgroundColor: theme.palette.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PatientsScreen;
