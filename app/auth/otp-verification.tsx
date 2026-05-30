import { BackButton } from '@/src/components/common/back-button';
import GradientWrapper from '@/src/components/common/gradient-wrapper';
import { AppText } from '@/src/components/forms/global-text';
import API_CONFIG from '@/src/config/api';
import Colors from '@/src/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Keyboard, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useAuth } from './auth-provider';

const CELL_COUNT = 6;

function OTPVerification() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation();
    const { login } = useAuth();
    
    const email = String(params.email || '');
    const debugOtp = String(params.debugOtp || '');

    // FIXED: Dynamically extract verificationId from the reactive params object on every thread cycle
    const currentVerificationId = String(params.verificationId || '');

    const [value, setValue] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [resendSeconds, setResendSeconds] = useState(90);
    const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useEffect(() => {
        if (debugOtp && debugOtp.length === CELL_COUNT) {
            setValue(debugOtp);
            handleVerify(debugOtp);
        }
    }, []);

    useEffect(() => {
        resendTimerRef.current && clearInterval(resendTimerRef.current);
        setResendSeconds(90);
        resendTimerRef.current = setInterval(() => {
            setResendSeconds((previous) => {
                if (previous <= 1) {
                    resendTimerRef.current && clearInterval(resendTimerRef.current);
                    resendTimerRef.current = null;
                    return 0;
                }
                return previous - 1;
            });
        }, 1000);

        return () => {
            resendTimerRef.current && clearInterval(resendTimerRef.current);
        };
    }, []);

    const formatCountdown = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const resetResendTimer = () => {
        resendTimerRef.current && clearInterval(resendTimerRef.current);
        setResendSeconds(90);
        resendTimerRef.current = setInterval(() => {
            setResendSeconds((previous) => {
                if (previous <= 1) {
                    resendTimerRef.current && clearInterval(resendTimerRef.current);
                    resendTimerRef.current = null;
                    return 0;
                }
                return previous - 1;
            });
        }, 1000);
    };

    const handleVerify = async (otpCode?: string) => {
        const codeToVerify = otpCode || value;
        if (codeToVerify.length !== CELL_COUNT) return;

        Keyboard.dismiss();
        setStatus('loading');

        try {
            const response = await fetch(API_CONFIG.AUTH.VALIDATE_EMAIL_OTP, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'app': 'Food Trckr',
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    otp: codeToVerify.trim(),
                    // FIXED: Always pulls the most recent dynamic routing token value safely
                    verificationId: currentVerificationId, 
                    verificationID: currentVerificationId, 
                    deviceId: Platform.OS,
                }),
            });

            const rawText = await response.text();
            
            let data: any = {};
            try {
                data = JSON.parse(rawText);
            } catch (jsonParseError) {
                throw new Error(`Server tracking fault (HTTP ${response.status}). HTML data unexpected.`);
            }

            if (!response.ok || !data.accessToken) {
                throw new Error(data.error || 'Invalid verification code or session expired.');
            }

            await SecureStore.setItemAsync('refreshToken', data.refreshToken);
            await SecureStore.setItemAsync('accessToken', data.accessToken);

            setStatus('success');
            setTimeout(() => {
                login(); 
            }, 600);
        } catch (e: any) {
            setStatus('error');
            setValue('');
            Alert.alert('Verification Error', e.message || 'Invalid verification code.');
        }
    };

    const handleResend = async () => {
        setStatus('loading');
        try {
            const response = await fetch(API_CONFIG.AUTH.EMAIL_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    app: 'Food Trckr',
                },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend OTP.');
            }

            const updatedVerificationId = String(data.verificationId || '');
            const newDebugOtp = String(data.debugOtp || '');

            if (!updatedVerificationId) {
                throw new Error('Failed to request OTP.');
            }

            router.setParams({ verificationId: updatedVerificationId });
            setValue('');
            setStatus('idle');
            resetResendTimer();

            if (__DEV__ && newDebugOtp) {
                Alert.alert('Debug OTP', `New code: ${newDebugOtp}`);
            } else {
                Alert.alert('Resend Code', 'A new verification code has been sent to your email.');
            }
        } catch (error: any) {
            Alert.alert('Resend Error', error?.message || 'Unable to request a new code.');
            setStatus('idle');
        }
    };

    const onTextChange = (text: string) => {
        setValue(text);
        if (text.length === CELL_COUNT) {
            handleVerify(text); 
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
                        onChangeText={onTextChange} 
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        textContentType="oneTimeCode"
                        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                        importantForAutofill="yes"
                        autoCorrect={false}
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
                            {resendSeconds > 0
                                ? `Resend available in ${formatCountdown(resendSeconds)}`
                                : `Didn't receive a code?`}
                        </AppText>
                        <TouchableOpacity
                            onPress={handleResend}
                            disabled={status === 'loading' || resendSeconds > 0}
                            activeOpacity={0.8}
                            style={{ opacity: status === 'loading' || resendSeconds > 0 ? 0.5 : 1 }}
                        >
                            <AppText style={styles.resendAction}>{t('send_code_again')}</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
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