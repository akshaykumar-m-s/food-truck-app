import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/src/components/forms/global-text';

interface SnackbarProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    onDismiss: () => void;
    duration?: number;
}

export function Snackbar({ visible, message, type = 'info', onDismiss, duration = 3500 }: SnackbarProps) {
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(120)).current; // Slide down start offset
    const fadeAnim = useRef(new Animated.Value(0)).current;   // Fluid opacity default

    useEffect(() => {
        if (visible) {
            // Smooth micro-interaction entrance interpolation
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();

            // Self-terminating execution loop
            const dismissTimer = setTimeout(() => {
                handleTriggerDismiss();
            }, duration);

            return () => clearTimeout(dismissTimer);
        }
    }, [visible, message]);

    const handleTriggerDismiss = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 120,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start(() => {
            onDismiss();
        });
    };

    if (!visible) return null;

    const getIndicatorIcon = () => {
        switch (type) {
            case 'success':
                return <Feather name="check-circle" size={18} color="#76E49D" />;
            case 'error':
                return <Feather name="alert-circle" size={18} color="#FF5252" />;
            default:
                return <Feather name="info" size={18} color="#A1A1A1" />;
        }
    };

    return (
        <Animated.View 
            style={[
                styles.snackbarContainer, 
                { 
                    bottom: Platform.OS === 'ios' ? insets.bottom + 16 : 24,
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim
                }
            ]}
        >
            <View style={styles.innerLayoutRow}>
                {getIndicatorIcon()}
                <AppText style={styles.messageText} numberOfLines={2}>
                    {message}
                </AppText>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    snackbarContainer: {
        position: 'absolute',
        left: 16,
        right: 16,
        backgroundColor: '#1F1124', // Rich, low-profile dark brand slate canvas
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 9999,
    },
    innerLayoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '100%',
    },
    messageText: {
        flex: 1,
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 18,
    },
});