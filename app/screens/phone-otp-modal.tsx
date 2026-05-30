import { Feather } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
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

// Firebase verification imports
import { Snackbar } from "@/components/common/snackbar";
import { auth } from '@/src/firebase';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

interface PhoneOtpModalProps {
    visible: boolean;
    verificationId: string | null;
    countryCode: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    onClose: () => void;
    onSuccess: () => void;
    onResendRequested: () => Promise<void>;
}

export function PhoneOtpModal({
    visible,
    verificationId,
    countryCode,
    phoneNumber,
    firstName,
    lastName,
    onClose,
    onSuccess,
    onResendRequested
}: PhoneOtpModalProps) {
    const [otpValue, setOtpValue] = useState('');
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [countdownSeconds, setCountdownSeconds] = useState(60);
    const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // 2. REFACTORED: Local state configuration parameters to run the snackbar alert profile
    const [snackbarConfig, setSnackbarConfig] = useState({
        visible: false,
        message: '',
        type: 'info' as 'success' | 'error' | 'info'
    });

    const startCountdown = () => {
        setCountdownSeconds(60);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = setInterval(() => {
            setCountdownSeconds((prev) => {
                if (prev <= 1) {
                    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        if (visible) {
            startCountdown();
            setOtpValue('');
        }
        return () => { if (countdownTimerRef.current) clearInterval(countdownTimerRef.current); };
    }, [visible, verificationId]);

    // Automatic submission listener once 6 digits are fully populated
    useEffect(() => {
        const cleanOtp = otpValue.trim();
        if (cleanOtp.length === 6 && !isVerifyingOtp) {
            handleVerifyPhoneCodeSubmit(cleanOtp);
        }
    }, [otpValue]);

    // Intercept method to route messaging arrays into the fluid snackbar state
    const displayToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
        setSnackbarConfig({ visible: true, message, type });
    };

    // Wraps the parent resend hook to append an elegant success banner notification smoothly
    const handleLocalResendPass = async () => {
        try {
            await onResendRequested();
            displayToast('A fresh verification code has been dispatched to your device.', 'success');
        } catch (resendError) {
            displayToast('Failed to reinitialize code broadcast. Please check connection profiles.');
        }
    };

    const handleVerifyPhoneCodeSubmit = async (forcedCode?: string) => {
        const targetCode = forcedCode || otpValue;
        if (targetCode.trim().length !== 6) {
            displayToast('Format Error: Please input a complete 6-digit confirmation key.');
            return;
        }

        if (!verificationId) {
            displayToast('Session Expired: Code window timed out. Please request a new code.');
            return;
        }

        Keyboard.dismiss();
        setIsVerifyingOtp(true);

        try {
            const credential = PhoneAuthProvider.credential(verificationId, targetCode.trim());
            
            if (auth.currentUser) {
                await signInWithCredential(auth, credential);
            }

            const token = await SecureStore.getItemAsync('accessToken');
            const completePhoneString = `${countryCode} ${phoneNumber.trim()}`;

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                    'app': 'Food Trckr'
                },
                body: JSON.stringify({
                    name: firstName.trim(),
                    surname: lastName.trim(),
                    phoneNumber: completePhoneString,
                    isPhoneVerified: true 
                })
            });

            if (response.ok) {
                onSuccess();
            } else {
                throw new Error('Database updates encountered an issue linking verification.');
            }
        } catch (error: any) {
            setOtpValue(''); 
            displayToast(error?.message || 'The verification code supplied does not match.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    return (
        <View style={{ position: 'absolute' }}>
            <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalBackdropBlur}>
                        <View style={styles.otpCardWrapper}>
                            <View style={styles.modalIndicatorIcon}>
                                <Feather name="shield" size={32} color={Colors.primary} />
                            </View>
                            
                            <AppText style={styles.modalHeadline}>Enter Verification Code</AppText>
                            <AppText style={styles.modalSubCaption}>
                                We have sent a 6-digit code to the phone number {countryCode} {phoneNumber}.
                            </AppText>

                            <TextInput
                                style={styles.otpInputBox}
                                value={otpValue}
                                onChangeText={setOtpValue}
                                placeholder="123456"
                                placeholderTextColor="rgba(27, 4, 31, 0.2)"
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                                editable={!isVerifyingOtp}
                                textContentType="oneTimeCode"
                                autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                            />

                            <View style={styles.timerRow}>
                                <AppText style={styles.timerText}>
                                    {countdownSeconds > 0 
                                        ? `Resend available in ${countdownSeconds}s` 
                                        : "Didn't get a code?"}
                                </AppText>
                                {countdownSeconds === 0 && (
                                    <TouchableOpacity onPress={handleLocalResendPass} disabled={isVerifyingOtp}>
                                        <AppText style={styles.resendActionLink}>Resend OTP</AppText>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.modalActionRow}>
                                <TouchableOpacity style={styles.cancelModalBtn} onPress={onClose} disabled={isVerifyingOtp}>
                                    <AppText style={styles.cancelBtnText}>Cancel</AppText>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.confirmModalBtn, otpValue.trim().length !== 6 && styles.confirmBtnDisabled]} 
                                    onPress={() => handleVerifyPhoneCodeSubmit()}
                                    disabled={otpValue.trim().length !== 6 || isVerifyingOtp}
                                >
                                    {isVerifyingOtp ? <ActivityIndicator color="#FFF" /> : <AppText style={styles.confirmBtnText}>Confirm</AppText>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* 3. INTEGRATE THE SNACKBAR NOTIFICATION CONTAINER TO HANDLE FLOATING TOAST INTERACTIONS */}
            <Snackbar 
                visible={snackbarConfig.visible}
                message={snackbarConfig.message}
                type={snackbarConfig.type}
                onDismiss={() => setSnackbarConfig(prev => ({ ...prev, visible: false }))}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    modalBackdropBlur: { flex: 1, backgroundColor: 'rgba(27, 4, 31, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    otpCardWrapper: { width: '100%', backgroundColor: '#FFF', borderRadius: 28, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
    modalIndicatorIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5F3F7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    modalHeadline: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
    modalSubCaption: { fontSize: 14, color: '#7C7C7C', textAlign: 'center', lineHeight: 20, marginBottom: 20, paddingHorizontal: 12 },
    otpInputBox: { backgroundColor: '#F5F3F7', width: '80%', height: 56, borderRadius: 16, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: Colors.primary, letterSpacing: 8, marginBottom: 16 },
    timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 },
    timerText: { fontSize: 13, color: '#7C7C7C' },
    resendActionLink: { fontSize: 13, fontWeight: '700', color: Colors.primary, textDecorationLine: 'underline' },
    modalActionRow: { flexDirection: 'row', width: '100%', gap: 12 },
    cancelModalBtn: { flex: 1, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: 'rgba(27, 4, 31, 0.2)', justifyContent: 'center', alignItems: 'center' },
    cancelBtnText: { color: 'rgba(27, 4, 31, 0.6)', fontSize: 15, fontWeight: '600' },
    confirmModalBtn: { flex: 1, height: 50, borderRadius: 25, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
    confirmBtnDisabled: { backgroundColor: 'rgba(27, 4, 31, 0.1)', opacity: 0.5 },
    confirmBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});