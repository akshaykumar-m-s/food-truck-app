import { BackButton } from '@/src/components/common/back-button';
import GradientWrapper from '@/src/components/common/gradient-wrapper';
import { AppText } from '@/src/components/forms/global-text';
import API_CONFIG from '@/src/config/api';
import Colors from '@/src/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Keyboard, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

function OTPVerification() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation();
    const email = String(params.email || '');
    const verificationId = String(params.verificationId || '');
    const debugOtp = String(params.debugOtp || '');

    const [value, setValue] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    /**
     * Updated Verification Logic
     * Now accepts an optional 'code' parameter to verify immediately on input change
     */
    const handleVerify = async (otpCode?: string) => {
        const codeToVerify = otpCode || value;
        if (codeToVerify.length !== CELL_COUNT) return;

        Keyboard.dismiss();
        setStatus('loading');

        try {
            const response = await fetch(API_CONFIG.AUTH.VALIDATE_EMAIL_OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    app: 'Food Trckr',
                },
                body: JSON.stringify({
                    email,
                    otp: codeToVerify,
                    verificationId,
                    deviceId: Platform.OS,
                }),
            });

            if (!response.ok) {
                throw new Error('Invalid verification code.');
            }

            setStatus('success');
            setTimeout(() => {
                router.replace('/tabs/home');
            }, 600);
        } catch (e) {
            setStatus('error');
            setValue('');
        }
    };

    /**
     * New Handler for Auto-Trigger
     * Checks if the user reached the digit limit
     */
    const onTextChange = (text: string) => {
        setValue(text);
        if (text.length === CELL_COUNT) {
            handleVerify(text); // Auto-trigger
        }
    };

    useEffect(() => {
        if (value.length > 0 && status === 'error') {
            setStatus('idle');
        }
    }, [value]);

    return (
        <GradientWrapper>
            <View style={styles.container}>
                <BackButton color='#FFF'/>
                <View style={styles.header}>
                    <AppText style={styles.title}>{t('welcome')}</AppText>
                    <AppText style={styles.subtitle}>{t('welcome_quote')}</AppText>
                </View>

                <View style={styles.otpSection}>
                    <AppText style={styles.inputLabel}>
                        {t('enter_opt_title')}
                    </AppText>

                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={onTextChange} // Updated to auto-trigger handler
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode" // Enables iOS SMS auto-fill
                        autoFocus={true}
                        renderCell={({ index, symbol, isFocused }) => {
                            const cellStyle = [
                                styles.cell,
                                isFocused && styles.focusCell,
                                status === 'error' && styles.errorCell,
                                status === 'success' && styles.successCell,
                            ];

                            return (
                                <View
                                    key={index}
                                    style={cellStyle}
                                    onLayout={getCellOnLayoutHandler(index)}
                                >
                                    <AppText style={styles.cellText}>
                                        {symbol || (isFocused ? <Cursor /> : '-')}
                                    </AppText>
                                </View>
                            );
                        }}
                    />

                    {status === 'error' && (
                        <AppText style={styles.errorMessage}>
                            {t('invalid_code')}
                        </AppText>
                    )}

                    <View style={styles.resendContainer}>
                        <AppText style={styles.resendText}>
                            {t('invalid_otp')}
                        </AppText>
                        <TouchableOpacity
                            onPress={() => console.log('Resend')}
                            disabled={status === 'loading'}
                        >
                            <AppText style={styles.resendAction}>{t('send_code_again')}</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    {/* The button remains as a fallback or for re-submission if needed */}
                    <TouchableOpacity
                        style={[styles.submitButton, status === 'loading' && styles.disabledButton]}
                        onPress={() => handleVerify()}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <ActivityIndicator color={Colors.primary} />
                        ) : (
                            <AppText style={styles.submitButtonText}>{t('verify_otp')}</AppText>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </GradientWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 25, paddingTop: 40 },
    header: { marginBottom: 60 },
    title: { fontSize: 42, color: '#FFF', fontWeight: 'bold', marginBottom: 20 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },
    otpSection: { alignItems: 'center' },
    inputLabel: { color: '#FFF', fontSize: 16, marginBottom: 30 },
    codeFieldRoot: { width: '100%', marginBottom: 20 },
    cell: {
        width: 45,
        height: 55,
        borderRadius: 12,
        backgroundColor: '#F5F3F7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    focusCell: { borderColor: '#76E49D' },
    errorCell: { borderColor: '#FF4D4D', backgroundColor: '#FFF1F1' },
    successCell: { borderColor: '#76E49D', backgroundColor: '#E8F5E9' },
    cellText: { fontSize: 24, color: Colors.primary, fontWeight: '600' },
    errorMessage: { color: '#FF4D4D', marginTop: 10, fontSize: 14, fontWeight: '500' },
    resendContainer: { marginTop: 40, alignItems: 'center' },
    resendText: { color: '#FFF', fontSize: 14, opacity: 0.9 },
    resendAction: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginTop: 5, textDecorationLine: 'underline' },
    footer: { marginTop: 'auto', marginBottom: 60 },
    submitButton: {
        backgroundColor: '#76E49D',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: { opacity: 0.7 },
    submitButtonText: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
});

export default OTPVerification;