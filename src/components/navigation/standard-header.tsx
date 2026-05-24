import { AppText } from '@/src/components/forms/global-text';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StandardHeaderProps {
    title?: string;
    subtitle?: string;
    showBackButton?: boolean;
    rightComponent?: ReactNode;
}

export const StandardHeader: React.FC<StandardHeaderProps> = ({
    title,
    subtitle,
    showBackButton = true,
    rightComponent
}) => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* This row mimics the native 44pt navigation bar height. 
                  Vertical centering here is key to the "default" look.
                */}
                <View style={styles.topRow}>
                    <View style={styles.leftSlot}>
                        {showBackButton && (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={styles.backButton}
                                hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                            >
                                {Platform.OS === 'ios' ? (
                                    <Ionicons name="chevron-back" size={30} color="#FFF" />
                                ) : (
                                    <MaterialIcons name="arrow-back" size={26} color="#FFF" />
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.rightSlot}>
                        {rightComponent}
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.textContainer}>
                    {title && <AppText style={styles.title}>{title}</AppText>}
                    {subtitle && <AppText style={styles.subtitle}>{subtitle}</AppText>}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
    },
    container: {
        paddingHorizontal: 20,
    },
    topRow: {
        height: 44, // Standard iOS Navbar height
        flexDirection: 'row',
        alignItems: 'center', // Centers button vertically in the bar
        justifyContent: 'space-between',
    },
    leftSlot: {
        flex: 1,
        justifyContent: 'center',
    },
    rightSlot: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    backButton: {
        marginLeft: -8, // Shifts chevron closer to edge to match iOS system
    },
    textContainer: {
        marginTop: 20, // Breathing room between the back button and the "Hi!" title
    },
    title: {
        fontSize: 42,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 22,
    },
});