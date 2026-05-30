import { BackButton } from "@/src/components/common/back-button";
import { AppText } from "@/src/components/forms/global-text";
import Colors from "@/src/constants/colors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "app/auth/auth-provider";
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const SUPPORTED_LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pl', label: 'Polski', flag: '🇵🇱' },
];

function SettingsPage() {
    const { i18n, t } = useTranslation();
    const { logout } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [dropdownWidth, setDropdownWidth] = useState(0);
    const [pendingLanguageCode, setPendingLanguageCode] = useState(i18n.language);

    const currentLangDisplay = useMemo(() => {
        return SUPPORTED_LANGUAGES.find(l => l.code === pendingLanguageCode) || SUPPORTED_LANGUAGES[0];
    }, [pendingLanguageCode]);

    const handleSelectLanguage = (code: string) => {
        setPendingLanguageCode(code);
        setIsVisible(false);
    };

    const handleSave = async () => {
        if (pendingLanguageCode !== i18n.language) {
            await i18n.changeLanguage(pendingLanguageCode);
        }
    };

    // 4. ACTION CONTROLLER TO SANITIZE TOKENS AND SHIFT APP THE ROUTE GATE TREE
    const handleSystemLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
        } catch (e) {
            console.error('Storage clear failure during logout context transition:', e);
        } finally {
            logout(); // Forces root layout layout guard switch back to login screen tree
        }
    };

    const onPillLayout = (event: any) => {
        setDropdownWidth(event.nativeEvent.layout.width);
    };

    const hasChanges = pendingLanguageCode !== i18n.language;

    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <BackButton color={Colors.primary} />
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <AppText style={styles.title}>{t('account_page.settings_page.title')}</AppText>

                <TouchableOpacity
                    style={styles.inputWrapper}
                    onLayout={onPillLayout}
                    onPress={() => setIsVisible(true)}
                    activeOpacity={0.7}
                >
                    <View style={{ flex: 1 }}>
                        <AppText style={styles.label}>{t('account_page.settings_page.language_section_title')}</AppText>
                        <AppText style={styles.inputValue}>
                            {currentLangDisplay.flag} {currentLangDisplay.label}
                        </AppText>
                    </View>
                    <Feather name="chevron-down" size={20} color={Colors.primary} />
                </TouchableOpacity>

                <View style={styles.actionGroup}>
                    <TouchableOpacity style={styles.actionRow}>
                        <Feather name="trash-2" size={20} color="#FF5252" />
                        <AppText style={styles.actionTextRed}>{t('account_page.settings_page.delete_account')}</AppText>
                    </TouchableOpacity>

                    {/* WIRING RECONFIGURED TO INTERCEPT SYSTEM SESSION LOGOUT CONTEXT ACTIONS */}
                    <TouchableOpacity style={styles.actionRow} onPress={handleSystemLogout}>
                        <MaterialCommunityIcons name="power" size={20} color="#FF5252" />
                        <AppText style={styles.actionTextRed}>{t('account_page.settings_page.logout')}</AppText>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={isVisible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setIsVisible(false)}>
                    <View style={[styles.dropdownMenu, { width: dropdownWidth, top: Constants.statusBarHeight + 160 }]}>
                        <FlatList
                            data={SUPPORTED_LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleSelectLanguage(item.code)}
                                >
                                    <AppText style={styles.dropdownText}>{item.flag} {item.label}</AppText>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={!hasChanges}
                >
                    <AppText style={styles.saveButtonText}>
                        {t('account_page.settings_page.save_changes')}
                    </AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFF', paddingTop: Constants.statusBarHeight },
    header: { width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
    container: { paddingHorizontal: 25, paddingTop: 10 },
    title: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginBottom: 30 },
    inputWrapper: { backgroundColor: Colors.accent, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    label: { fontSize: 12, color: Colors.primary, opacity: 0.6, marginBottom: 2 },
    inputValue: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
    actionGroup: { paddingLeft: 5, gap: 30, marginTop: 20 },
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    actionTextRed: { fontSize: 16, color: '#FF5252', fontWeight: '500' },
    footer: { paddingHorizontal: 25, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
    saveButton: { backgroundColor: Colors.primary, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveButtonDisabled: { backgroundColor: 'rgba(27, 4, 31, 0.2)', opacity: 0.5 },
    saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    overlay: { flex: 1, backgroundColor: 'transparent' },
    dropdownMenu: { position: 'absolute', left: 25, backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    dropdownItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0F0F0' },
    dropdownText: { fontSize: 16, color: Colors.primary, fontWeight: '500' },
});

export default SettingsPage;