
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { theme } from '../../constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import GoogleSignIn from '../../components/GoogleSignIn';
import { exportData } from '../../lib/backup';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleExport = async () => {
    try {
      await exportData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar los datos.');
    }
  };

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  const SettingRow = ({ icon, label, isSwitch, value, onValueChange, onPress, customContent }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={isSwitch}>
      <View style={styles.settingLabelContainer}>
        <MaterialIcons name={icon} size={24} color={theme.palette.primary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#ccc', true: theme.palette.primary }} thumbColor={theme.palette.white}/>
      ) : customContent ? (
        customContent
      ) : (
        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Section title="General">
          <SettingRow icon="language" label="Idioma" />
          <SettingRow icon="dark-mode" label="Modo Oscuro" isSwitch value={isDarkMode} onValueChange={setIsDarkMode} />
          <SettingRow icon="notifications" label="Notificaciones" isSwitch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </Section>

        <Section title="Gestión de Datos">
          <SettingRow icon="calendar-today" label="Sincronizar Calendario" customContent={<GoogleSignIn />} />
          <SettingRow icon="download" label="Exportar Datos" onPress={handleExport} />
          <SettingRow icon="upload" label="Importar Datos" />
        </Section>

        <Section title="Acerca de">
          <SettingRow icon="help-outline" label="Ayuda y Soporte" />
          <SettingRow icon="privacy-tip" label="Política de Privacidad" />
          <SettingRow icon="info-outline" label="Sobre CareSync" />
        </Section>
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
        paddingBottom: theme.spacing.spacingExtraLarge,
    },
    section: {
        marginBottom: theme.spacing.spacingExtraLarge,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#888',
        textTransform: 'uppercase',
        marginBottom: theme.spacing.spacingMedium,
        paddingHorizontal: theme.spacing.spacingSmall,
    },
    sectionCard: {
        backgroundColor: theme.palette.white,
        borderRadius: theme.borders.borderRadiusLarge,
        ...theme.shadows.shadow,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.spacingLarge,
        paddingVertical: theme.spacing.spacingMedium,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.spacingMedium,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default SettingsScreen;
