import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import { AppText } from '@/src/components/forms/global-text';
import API_CONFIG from '@/src/config/api';
import Colors from '@/src/constants/colors';

const COUNTRIES = [
    { label: 'Poland', value: '+48' },
    { label: 'Germany', value: '+49' }
];

interface OnboardingOverlayProps {
    visible: boolean;
    initialEmail: string;
    onClose: (updatedName?: string) => void; // FIXED: Emits the fresh name value back to parent layers on success
}

export function ProfileOnboardingOverlay({ visible, initialEmail, onClose }: OnboardingOverlayProps) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+48');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isFormValid = name.trim().length > 0 && surname.trim().length > 0 && phone.trim().length > 0;

    const handleSaveProfile = async () => {
        if (!isFormValid) {
            Alert.alert('Required Fields', 'Please fill in your First Name, Last Name, and Phone Number.');
            return;
        }

        setIsSaving(true);
        try {
            const token = await SecureStore.getItemAsync('accessToken'); //
            const fullPhoneNumber = phone.trim() ? `${countryCode} ${phone.trim()}` : '';

            // CONNECTED: Matches the POST /profile handler configuration from your Express engine
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '', //
                    'app': 'Food Trckr'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    surname: surname.trim(),
                    phoneNumber: fullPhoneNumber // Maps cleanly to req.body.phoneNumber on the server
                })
            });

            if (response.ok) {
                Alert.alert('Welcome!', `Profile configured successfully.`, [
                    { text: "Let's Go!", onPress: () => onClose(name.trim()) } // Pass name on dismiss
                ]);
            } else {
                Alert.alert('Error', 'Unable to complete your profile setup. Please try again.');
            }
        } catch (error) {
            Alert.alert('Connection Error', 'Unable to reach backend servers.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlayBackdrop}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardContainer}>
                        <View style={styles.modalCard}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="account-heart-outline" size={44} color={Colors.primary} />
                            </View>

                            <AppText style={styles.headlineTitle}>Help us know you better!</AppText>
                            <AppText style={styles.captionSubtitle}>
                                Complete your profile parameters to unlock personalized food truck recommendations and quick tracking details.
                            </AppText>

                            <View style={styles.formGroup}>
                                <View style={styles.inputWrapper}>
                                    <AppText style={styles.floatingLabel}>First Name *</AppText>
                                    <TextInput style={styles.inputElement} value={name} onChangeText={setName} placeholder="Alex" placeholderTextColor="rgba(27, 4, 31, 0.3)" autoCorrect={false} />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <AppText style={styles.floatingLabel}>Last Name *</AppText>
                                    <TextInput style={styles.inputElement} value={surname} onChangeText={setSurname} placeholder="Smith" placeholderTextColor="rgba(27, 4, 31, 0.3)" autoCorrect={false} />
                                </View>

                                <View style={[styles.inputWrapper, { zIndex: 10 }]}>
                                    <AppText style={styles.floatingLabel}>Phone Number *</AppText>
                                    <View style={styles.phoneInputRow}>
                                        <TouchableOpacity style={styles.countrySelector} onPress={() => setShowCountryPicker(!showCountryPicker)}>
                                            <AppText style={styles.inputElement}>{countryCode}</AppText>
                                            <Feather name="chevron-down" size={14} color={Colors.primary} style={{ marginLeft: 4 }} />
                                        </TouchableOpacity>
                                        <View style={styles.divider} />
                                        <TextInput style={[styles.inputElement, { flex: 1, padding: 0 }]} value={phone} onChangeText={setPhone} placeholder="987 654 321" placeholderTextColor="rgba(27, 4, 31, 0.3)" keyboardType="phone-pad" />
                                    </View>

                                    {showCountryPicker && (
                                        <View style={styles.pickerDropdown}>
                                            {COUNTRIES.map((c) => (
                                                <TouchableOpacity key={c.value} style={styles.pickerItem} onPress={() => { setCountryCode(c.value); setShowCountryPicker(false); }}>
                                                    <AppText style={styles.pickerText}>{c.label} ({c.value})</AppText>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.actionBlock}>
                                <TouchableOpacity style={[styles.primarySubmitButton, (!isFormValid || isSaving) && styles.submitButtonDisabled]} onPress={handleSaveProfile} disabled={!isFormValid || isSaving}>
                                    {isSaving ? <ActivityIndicator color={Colors.primary} /> : <AppText style={styles.primaryButtonText}>Save Details</AppText>}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.skipButton} onPress={() => onClose()} disabled={isSaving}>
                                    <AppText style={styles.skipButtonText}>Skip for now</AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlayBackdrop: { flex: 1, backgroundColor: 'rgba(27, 4, 31, 0.75)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    keyboardContainer: { width: '100%', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 32, paddingHorizontal: 24, paddingVertical: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F5F3F7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    headlineTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 8 },
    captionSubtitle: { fontSize: 14, color: '#7C7C7C', textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 8 },
    formGroup: { width: '100%', gap: 12, marginBottom: 24 },
    inputWrapper: { position: 'relative', backgroundColor: '#F5F3F7', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, width: '100%' },
    floatingLabel: { color: '#7B4D8A', fontSize: 11, fontWeight: '600', marginBottom: 2 },
    inputElement: { fontSize: 16, color: Colors.primary, fontWeight: '500', padding: 0 },
    phoneInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    countrySelector: { flexDirection: 'row', alignItems: 'center', paddingRight: 4 },
    divider: { width: 1, height: 16, backgroundColor: 'rgba(27, 4, 31, 0.2)', marginHorizontal: 12 },
    pickerDropdown: { backgroundColor: '#FFF', borderRadius: 12, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5, position: 'absolute', top: 60, left: 12, zIndex: 999, width: 150 },
    pickerItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EEE' },
    pickerText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
    actionBlock: { width: '100%', gap: 12, alignItems: 'center' },
    primarySubmitButton: { backgroundColor: Colors.mintGreen, width: '100%', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    submitButtonDisabled: { backgroundColor: 'rgba(27, 4, 31, 0.15)', opacity: 0.6 },
    primaryButtonText: { color: Colors.primary, fontSize: 16, fontWeight: 'bold' },
    skipButton: { paddingVertical: 8 },
    skipButtonText: { color: 'rgba(27, 4, 31, 0.5)', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
});