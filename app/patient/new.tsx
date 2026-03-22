
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/lib/i18n';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { usePatient } from '@/hooks/usePatient';
import { useRouter } from 'expo-router';

const Icon = ({ name, size = 24, color = '#000' }) => (
    <Text style={{ fontFamily: 'Material Symbols Outlined', fontSize: size, color }}>{name}</Text>
);

export default function NewPatientScreen() {
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('');
    const [profilePicUri, setProfilePicUri] = useState(null);
    const { addPatient } = usePatient();
    const router = useRouter();

    const backgroundColor = useThemeColor({}, 'background');
    const tintColor = useThemeColor({}, 'tint');
    const cardBackgroundColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const white = useThemeColor({light: '#fff', dark: '#000'}, 'background');

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const sourceUri = result.assets[0].uri;
            const filename = `patient_${Date.now()}.jpg`;
            const destUri = FileSystem.documentDirectory + filename;

            try {
                await FileSystem.copyAsync({
                    from: sourceUri,
                    to: destUri
                });
                setProfilePicUri(destUri);
            } catch (error) {
                console.error('Error al guardar la imagen:', error);
                alert(i18n.t('new_patient.form.errors.save_photo') || 'Error al guardar la imagen de perfil.');
            }
        }
    };

    const handleSave = async () => {
        if (!name) {
            alert(i18n.t('new_patient.form.validations.name_required'));
            return;
        }
        await addPatient({ name, relation, profile_pic_uri: profilePicUri });
        router.back();
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
                    <ThemedText type="title" style={styles.title}>{i18n.t('new_patient.title')}</ThemedText>

                    <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
                        <TouchableOpacity onPress={pickImage} style={styles.profilePicContainer}>
                            {profilePicUri ? (
                                <Image source={{ uri: profilePicUri }} style={styles.profilePic} />
                            ) : (
                                <View style={styles.profilePicPlaceholder}>
                                    <Icon name="add_a_photo" size={48} color={textColor} />
                                    <ThemedText>{i18n.t('new_patient.form.add_photo')}</ThemedText>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={styles.inputGroup}>
                            <ThemedText>{i18n.t('new_patient.form.name')}</ThemedText>
                            <TextInput
                                style={[styles.input, { color: textColor, borderColor: tintColor }]}
                                value={name}
                                onChangeText={setName}
                                placeholder={i18n.t('new_patient.form.name_placeholder')}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText>{i18n.t('new_patient.form.relation')}</ThemedText>
                            <TextInput
                                style={[styles.input, { color: textColor, borderColor: tintColor }]}
                                value={relation}
                                onChangeText={setRelation}
                                placeholder={i18n.t('new_patient.form.relation_placeholder')}
                            />
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: tintColor }]}>
                        <Icon name="save" size={24} color={white} />
                        <Text style={[styles.saveButtonText, {color: white}]}>{i18n.t('new_patient.form.save')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    card: {
        width: '100%',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    profilePicContainer: {
        marginBottom: 24,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profilePicPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        borderBottomWidth: 1,
        paddingVertical: 8,
        fontSize: 16,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
