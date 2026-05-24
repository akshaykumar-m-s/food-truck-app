import Colors from '@/src/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

export const BackButton = ({ color = Colors.primary }: { color?: string }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
            {Platform.OS === 'ios' ? (
                <Ionicons name="chevron-back" size={28} color={color} />
            ) : (
                <MaterialIcons name="arrow-back" size={26} color={color} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
    }
});