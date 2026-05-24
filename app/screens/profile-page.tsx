import { BackButton } from "@/src/components/common/back-button";
import { AppText } from "@/src/components/forms/global-text";
import Colors from "@/src/constants/colors";
import { Feather } from "@expo/vector-icons";
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { t } from 'i18next';
import React, { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, KeyboardType, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

const COUNTRIES = [
    { label: 'Poland', value: '+48' },
    { label: 'Germany', value: '+49' }
];

function ProfilePage() {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState('+48');
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const [backendData] = useState({
        name: 'Jeremy',
        surname: 'Smith',
        phone: '987 654 321',
        email: 'j.smith@foodtrckr.com',
        isPhoneVerified: false,
        isEmailVerified: true
    });

    const [formData, setFormData] = useState({ ...backendData });

    const inputRefs = {
        name: useRef<TextInput>(null),
        surname: useRef<TextInput>(null),
        phone: useRef<TextInput>(null),
        email: useRef<TextInput>(null),
    };

    const handleEditTrigger = (field: keyof typeof inputRefs) => {
        setEditingField(field);
        setTimeout(() => inputRefs[field].current?.focus(), 100);
    };

    const handleCancelEdit = (field: keyof typeof formData) => {
        setFormData(prev => ({ ...prev, [field]: backendData[field] }));
        setEditingField(null);
        if (field === 'phone') setShowCountryPicker(false);
    };

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(backendData) || countryCode !== '+48';

    const handleSave = () => {
        if (hasChanges) {
            setEditingField(null);
            setShowCountryPicker(false);
        }
    };

    const isEmailChanged = formData.email !== backendData.email;
    const isPhoneChanged = formData.phone !== backendData.phone;

    const showEmailVerify = (isEmailChanged || !backendData.isEmailVerified) && editingField !== 'email';
    const showPhoneVerify = (isPhoneChanged || !backendData.isPhoneVerified) && editingField !== 'phone';

    const router = useRouter();


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.safeArea}>
            <StatusBar style="dark" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <BackButton color={Colors.primary} />
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <AppText style={styles.title}>
                            {t('account_page.profile_page.title')}
                        </AppText>

                        <View style={styles.imageContainer}>
                            <View style={styles.profileCircle}>
                                <Feather name="user" size={60} color="#FFF" />
                            </View>
                            <TouchableOpacity style={styles.pencilButton}>
                                <Feather name="edit-2" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            {/* Render Name and Surname */}
                            {([
                                { id: 'name', label: t('account_page.profile_page.name'), type: 'default' },
                                { id: 'surname', label: t('account_page.profile_page.surename'), type: 'default' },
                            ] as const).map((field) => {
                                const isFieldActive = editingField === field.id;
                                return (
                                    <View key={field.id} style={[styles.inputWrapper, isFieldActive ? styles.activeWrapper : styles.disabledWrapper]}>
                                        <View style={{ flex: 1 }}>
                                            <AppText style={[styles.label, !isFieldActive && styles.disabledLabel]}>{field.label}</AppText>
                                            <TextInput
                                                ref={inputRefs[field.id]}
                                                style={[styles.inputValue, !isFieldActive && styles.disabledText]}
                                                value={formData[field.id]}
                                                editable={isFieldActive}
                                                keyboardType={field.type as KeyboardType}
                                                onChangeText={(txt) => setFormData({ ...formData, [field.id]: txt })}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => isFieldActive ? handleCancelEdit(field.id) : handleEditTrigger(field.id)}>
                                            <Feather name={isFieldActive ? "x" : "edit-3"} size={18} color={isFieldActive ? "#5c5b5bff" : Colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}

                            {/* Specialized Phone Field */}
                            <View style={[styles.inputWrapper, editingField === 'phone' ? styles.activeWrapper : styles.disabledWrapper]}>
                                <View style={{ flex: 1 }}>
                                    <AppText style={[styles.label, editingField !== 'phone' && styles.disabledLabel]}>{t('account_page.profile_page.phone_number')}</AppText>
                                    <View style={styles.phoneInputRow}>
                                        <TouchableOpacity
                                            style={styles.countrySelector}
                                            onPress={() => setShowCountryPicker(!showCountryPicker)}
                                            disabled={editingField !== 'phone'}
                                        >
                                            <AppText style={[styles.inputValue, editingField !== 'phone' && styles.disabledText]}>{countryCode}</AppText>
                                            <Feather name="chevron-down" size={14} color={editingField === 'phone' ? Colors.primary : 'rgba(27, 4, 31, 0.3)'} style={{ marginLeft: 4 }} />
                                        </TouchableOpacity>
                                        <View style={[styles.divider, editingField !== 'phone' && { opacity: 0.2 }]} />
                                        <TextInput
                                            ref={inputRefs.phone}
                                            style={[styles.inputValue, { flex: 1, padding: 0 }, editingField !== 'phone' && styles.disabledText]}
                                            value={formData.phone}
                                            editable={editingField === 'phone'}
                                            keyboardType="phone-pad"
                                            onChangeText={(txt) => setFormData({ ...formData, phone: txt })}
                                        />
                                    </View>
                                </View>

                                <View style={styles.rightActionContainer}>
                                    {showPhoneVerify && (
                                        <TouchableOpacity style={styles.verifyOutlineButton}>
                                            <AppText style={styles.verifyButtonText}>Verify</AppText>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => editingField === 'phone' ? handleCancelEdit('phone') : handleEditTrigger('phone')}>
                                        <Feather name={editingField === 'phone' ? "x" : "edit-3"} size={18} color={editingField === 'phone' ? "#5c5b5bff" : Colors.primary} />
                                    </TouchableOpacity>
                                </View>

                                {showCountryPicker && editingField === 'phone' && (
                                    <View style={styles.pickerDropdown}>
                                        {COUNTRIES.map((c) => (
                                            <TouchableOpacity
                                                key={c.value}
                                                style={styles.pickerItem}
                                                onPress={() => { setCountryCode(c.value); setShowCountryPicker(false); }}
                                            >
                                                <AppText style={styles.pickerText}>{c.label} ({c.value})</AppText>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Email Field */}
                            <View style={[styles.inputWrapper, editingField === 'email' ? styles.activeWrapper : styles.disabledWrapper]}>
                                <View style={{ flex: 1 }}>
                                    <AppText style={[styles.label, editingField !== 'email' && styles.disabledLabel]}>{t('account_page.profile_page.email_address')}</AppText>
                                    <TextInput
                                        ref={inputRefs.email}
                                        style={[styles.inputValue, editingField !== 'email' && styles.disabledText]}
                                        value={formData.email}
                                        editable={editingField === 'email'}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onChangeText={(txt) => setFormData({ ...formData, email: txt })}
                                    />
                                </View>

                                <View style={styles.rightActionContainer}>
                                    {showEmailVerify && (
                                        <TouchableOpacity
                                            style={styles.verifyOutlineButton}
                                            // Navigate to the verification screen
                                            onPress={() => {
                                                router.push('/screens/email-verification')}}
                                        >
                                            <AppText style={styles.verifyButtonText}>Verify</AppText>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => editingField === 'email' ? handleCancelEdit('email') : handleEditTrigger('email')}>
                                        <Feather
                                            name={editingField === 'email' ? "x" : "edit-3"}
                                            size={18}
                                            color={editingField === 'email' ? "#5c5b5bff" : Colors.primary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={!hasChanges}
                        >
                            <AppText style={styles.saveButtonText}>{t('account_page.profile_page.save_changes')}</AppText>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFF', paddingTop: Constants.statusBarHeight },
    header: { width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
    scrollContainer: { paddingHorizontal: 25, paddingBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginBottom: 30, textAlign: 'left', alignSelf: 'flex-start' },
    imageContainer: { width: 120, height: 120, marginBottom: 30, alignSelf: 'center' },
    profileCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
    pencilButton: { position: 'absolute', bottom: 5, right: 5, width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, borderWidth: 2, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
    inputGroup: { width: '100%', gap: 15 },
    inputWrapper: { borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12, width: '100%', borderWidth: 1.5, zIndex: 1 },
    phoneInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    countrySelector: { flexDirection: 'row', alignItems: 'center', paddingRight: 10 },
    divider: { width: 1, height: 18, backgroundColor: 'rgba(27, 4, 31, 0.2)', marginHorizontal: 12 },
    label: { fontSize: 12, color: Colors.primary, opacity: 0.6 },
    inputValue: { fontSize: 16, color: Colors.primary, fontWeight: '600', padding: 0 },
    disabledWrapper: { backgroundColor: '#E8E3F0', borderColor: 'transparent' },
    activeWrapper: { backgroundColor: '#D1C6E1', borderColor: Colors.primary },
    disabledLabel: { opacity: 0.4 },
    disabledText: { color: 'rgba(27, 4, 31, 0.4)' },
    rightActionContainer: { flexDirection: 'row', alignItems: 'center' },
    verifyPill: { borderBottomWidth: 1, borderBottomColor: Colors.primary, marginRight: 12, paddingBottom: 1 },
    verifyText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
    saveButton: { backgroundColor: Colors.primary, width: '100%', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    saveButtonDisabled: { backgroundColor: 'rgba(27, 4, 31, 0.2)', opacity: 0.5 },
    saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    pickerDropdown: { backgroundColor: '#FFF', borderRadius: 12, padding: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, position: 'absolute', top: -85, left: 20, zIndex: 999, width: 140 },
    pickerItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EEE' },
    pickerText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
    verifyOutlineButton: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 10,
        backgroundColor: 'transparent',
    },
    verifyButtonText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: '700',
    },
});

export default ProfilePage;