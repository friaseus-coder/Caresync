
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/lib/i18n'; // Import the i18n instance
import { usePatient } from '@/hooks/usePatient';
import { useMedication } from '@/lib/useMedication';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

// Placeholder Icon component
const Icon = ({ name, size = 24, color = '#000' }: { name: string, size?: number, color?: string }) => (
    <Text style={{ fontFamily: 'Material Symbols Outlined', fontSize: size, color, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{name}</Text>
);

const quickActions = [
    { icon: 'straighten', label: i18n.t('dashboard.quick_actions.new_measurement') },
    { icon: 'medical_services', label: i18n.t('dashboard.quick_actions.add_medication') },
    { icon: 'history', label: i18n.t('dashboard.quick_actions.view_history') },
];

export default function HomeScreen() {
    const { patients } = usePatient();
    const { medications } = useMedication();
    const router = useRouter();
    const [activePatient, setActivePatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (patients.length > 0) {
            setActivePatient(patients[0]);
        }
        setLoading(false);
    }, [patients]);

    const backgroundColor = useThemeColor({}, 'background');
    const tintColor = useThemeColor({}, 'tint');
    const textColor = useThemeColor({}, 'text');
    const iconColor = useThemeColor({}, 'icon');
    const cardBackgroundColor = useThemeColor({}, 'card');
    const cardBorderColor = useThemeColor({}, 'cardBorder');
    const white = useThemeColor({light: '#fff', dark: '#000'}, 'background');
    
    const currentDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.','');

    if (loading) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}/>
    }

    if (patients.length === 0) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
                <View style={styles.emptyStateContainer}>
                    <ThemedText type="title" style={styles.emptyStateTitle}>{i18n.t('dashboard.empty_state.title')}</ThemedText>
                    <ThemedText style={styles.emptyStateSubtitle}>{i18n.t('dashboard.empty_state.subtitle')}</ThemedText>
                    <TouchableOpacity style={[styles.emptyStateButton, {backgroundColor: tintColor}]} onPress={() => router.push('/patient/new')}>
                        <Icon name="add" size={24} color={white} />
                        <Text style={[styles.emptyStateButtonText, {color: white}]}>{i18n.t('dashboard.empty_state.add_patient')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView style={[styles.header, { backgroundColor: 'rgba(255, 255, 255, 0.8)', borderBottomColor: cardBorderColor }]}>
                    <View style={styles.headerTop}>
                        <View style={styles.logoContainer}>
                            <Icon name="health_and_safety" size={24} color={tintColor} />
                            <ThemedText style={styles.title}>{i18n.t('dashboard.title')}</ThemedText>
                        </View>
                        <TouchableOpacity style={styles.notificationButton}>
                            <Icon name="notifications" size={24} color={textColor} />
                        </TouchableOpacity>
                    </View>
                </ThemedView>

                <View style={styles.mainContent}>
                    <View style={styles.welcomeSection}>
                        <View>
                            <ThemedText type="title" style={styles.welcomeTitle}>{i18n.t('dashboard.welcome', { name: activePatient?.name || '' })}</ThemedText>
                            <ThemedText type="default" style={[styles.welcomeSubtitle, {color: iconColor}]}>{i18n.t('dashboard.welcome_back')}</ThemedText>
                        </View>
                        <View style={styles.profileSelector}>
                            {patients.map(patient => (
                                <TouchableOpacity key={patient.id} onPress={() => setActivePatient(patient)} style={activePatient?.id === patient.id ? styles.profileItemActive: styles.profileItemInactive}>
                                    <Image source={{ uri: patient.profile_picture || 'https://via.placeholder.com/150' }} style={activePatient?.id === patient.id ? [styles.profileImage, {borderColor: tintColor}] : styles.profileImageInactive} />
                                    <ThemedText style={activePatient?.id === patient.id ? [styles.profileNameActive, {color: tintColor}] : styles.profileNameInactive}>{patient.name}</ThemedText>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity style={styles.addProfileButton} onPress={() => router.push('/patient/new')}>
                                <Icon name="add" size={24} color={iconColor} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.quickActions}>
                        {quickActions.map((action, index) => (
                            <TouchableOpacity key={index} style={[styles.actionButton, {backgroundColor: cardBackgroundColor, borderColor: cardBorderColor}]}>
                                <View style={[styles.actionIconContainer, {backgroundColor: 'rgba(137, 208, 236, 0.1)'}]}>
                                    <Icon name={action.icon} size={20} color={tintColor} />
                                </View>
                                <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.upcomingIntakes}>
                        <View style={styles.intakesHeader}>
                            <ThemedText type="subtitle" style={styles.intakesTitle}>{i18n.t('dashboard.upcoming_intakes.title')}</ThemedText>
                            <ThemedText style={[styles.intakesDate, {color: tintColor}]}>{i18n.t('dashboard.upcoming_intakes.today', { date: currentDate })}</ThemedText>
                        </View>
                        <View style={styles.intakesList}>
                            {medications.filter(med => med.patient_id === activePatient?.id).map((intake, index) => (
                                <View key={index} style={[styles.intakeCard, { opacity: intake.opacity ?? 1, backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }]}>
                                    <Image source={{ uri: intake.image || 'https://via.placeholder.com/150' }} style={styles.medicationImage} />
                                    <View style={styles.medicationDetails}>
                                        <ThemedText style={styles.medicationName}>{intake.name}</ThemedText>
                                        <View style={styles.detailRow}>
                                            <Icon name="pill" size={12} color={iconColor} />
                                            <ThemedText style={[styles.detailText, {color: iconColor}]}>{intake.dosage}</ThemedText>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Icon name="schedule" size={12} color={intake.taken ? tintColor : iconColor} />
                                            <ThemedText style={[styles.detailText, {color: iconColor}, intake.taken && [styles.timeTaken, {color: tintColor}]]}>{intake.time}</ThemedText>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={[styles.statusButton, intake.taken ? [styles.statusButtonTaken, {backgroundColor: tintColor}] : [styles.statusButtonPending, {backgroundColor: 'rgba(137, 208, 236, 0.1)', borderColor: 'rgba(137, 208, 236, 0.2)'}]]}>
                                        {intake.taken && <Icon name="check_circle" size={14} color={white} />}
                                        <Text style={[styles.statusButtonText, intake.taken ? [styles.statusButtonTextTaken, {color: white}] : [styles.statusButtonTextPending, {color: tintColor}]]}>
                                            {intake.status}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 500,
        marginHorizontal: 'auto',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    notificationButton: {
        padding: 8,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 32,
        maxWidth: 500,
        marginHorizontal: 'auto',
        width: '100%',
    },
    welcomeSection: {
        gap: 16,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    welcomeSubtitle: {
    },
    profileSelector: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    profileItemActive: {
        alignItems: 'center',
        gap: 8,
    },
    profileImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 4,
        backgroundColor: '#E5E7EB'
    },
    profileNameActive: {
        fontSize: 12,
        fontWeight: '600',
    },
    profileItemInactive: {
        alignItems: 'center',
        gap: 8,
        opacity: 0.6,
    },
    profileImageInactive: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E5E7EB'
    },
    profileNameInactive: {
        fontSize: 12,
        fontWeight: '500',
    },
    addProfileButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1.5,
        elevation: 2,
        borderWidth: 1,
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 12,
    },
    upcomingIntakes: {
        gap: 16,
    },
    intakesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    intakesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    intakesDate: {
        fontSize: 14,
        fontWeight: '500',
    },
    intakesList: {
        gap: 12,
    },
    intakeCard: {
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1.5,
        elevation: 2,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    medicationImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    medicationDetails: {
        flex: 1,
        gap: 4,
    },
    medicationName: {
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 14,
    },
    timeTaken: {
        fontWeight: '600',
    },
    statusButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusButtonTaken: {
    },
    statusButtonPending: {
        borderWidth: 1,
    },
    statusButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusButtonTextTaken: {
    },
    statusButtonTextPending: {
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        gap: 16,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        textAlign: 'center',
    },
    emptyStateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyStateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
