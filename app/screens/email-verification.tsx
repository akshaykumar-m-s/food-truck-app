import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { BackButton } from '@/src/components/common/back-button';
import { AppText } from "@/src/components/forms/global-text";
import Colors from "@/src/constants/colors";

function EmailVerificationScreen() {
    const { t } = useTranslation();

    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />

            {/* Header with consistent alignment */}
            <View style={styles.header}>
                <BackButton color={Colors.primary} />
            </View>

            <View style={styles.container}>
                {/* Visual Icon */}
                <MaterialCommunityIcons
                    name="email-outline"
                    size={100}
                    color={Colors.primary}
                    style={styles.icon}
                />

                {/* Main Heading */}
                <AppText style={styles.title}>
                    {t('auth.verify_email_title')}
                </AppText>

                {/* Descriptive Text with dynamic email */}
                <AppText style={styles.description}>
                    {t('auth.otp_sent_to')}
                    <AppText style={styles.emailHighlight}> j.smith@food.trckr</AppText>.
                    {"\n"}{t('auth.click_verification_link')}
                </AppText>

                {/* Resend Action */}
                <View style={styles.resendSection}>
                    <AppText style={styles.resendLabel}>{t('auth.didnt_receive_email')}</AppText>
                    <TouchableOpacity onPress={() => {/* Resend Logic */ }}>
                        <AppText style={styles.resendButton}>{t('auth.send_again')}</AppText>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Mint Green Primary Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => {/* Navigation Logic */ }}>
                    <AppText style={styles.buttonText}>{t('tak')}</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: Constants.statusBarHeight
    },
    header: {
        paddingHorizontal: 20,
        height: 50,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 40
    },
    icon: {
        marginBottom: 30
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#7C7C7C',
        textAlign: 'center',
        lineHeight: 22
    },
    emailHighlight: {
        color: '#5B9EE1',
        textDecorationLine: 'underline'
    },
    resendSection: {
        marginTop: 60,
        alignItems: 'center'
    },
    resendLabel: {
        fontSize: 14,
        color: '#7C7C7C',
        marginBottom: 5
    },
    resendButton: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    footer: {
        paddingHorizontal: 25,
        paddingBottom: Platform.OS === 'ios' ? 40 : 25
    },
    primaryButton: {
        backgroundColor: '#76E49D', // Mint green styling
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default EmailVerificationScreen;