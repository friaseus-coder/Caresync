
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import i18n from '@/lib/i18n';
import GoogleSignIn from '../../components/GoogleSignIn';
import { exportData } from '../../lib/backup';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleExport = async () => {
    try {
      await exportData();
    } catch (error) {
      Alert.alert(i18n.t('common.error'), i18n.t('settings.errors.export_failed'));
    }
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  const SettingRow = ({ icon, label, isSwitch = false, value = false, onValueChange = () => {}, onPress = () => {}, customContent = null }: { 
    icon: any, 
    label: string, 
    isSwitch?: boolean, 
    value?: boolean, 
    onValueChange?: (val: boolean) => void, 
    onPress?: () => void, 
    customContent?: React.ReactNode 
  }) => (
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
        <Text style={styles.headerTitle}>{i18n.t('settings.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Section title={i18n.t('settings.sections.general')}>
          <SettingRow icon="language" label={i18n.t('settings.rows.language')} />
          <SettingRow icon="dark-mode" label={i18n.t('settings.rows.dark_mode')} isSwitch value={isDarkMode} onValueChange={setIsDarkMode} />
          <SettingRow icon="notifications" label={i18n.t('settings.rows.notifications')} isSwitch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </Section>

        <Section title={i18n.t('settings.sections.data')}>
          <SettingRow icon="calendar-today" label={i18n.t('settings.rows.sync_calendar')} customContent={<GoogleSignIn />} />
          <SettingRow icon="download" label={i18n.t('settings.rows.export_data')} onPress={handleExport} />
          <SettingRow icon="upload" label={i18n.t('settings.rows.import_data')} />
        </Section>

        <Section title={i18n.t('settings.sections.about')}>
          <SettingRow icon="help-outline" label={i18n.t('settings.rows.help')} />
          <SettingRow icon="privacy-tip" label={i18n.t('settings.rows.privacy')} />
          <SettingRow icon="info-outline" label={i18n.t('settings.rows.about')} />
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
