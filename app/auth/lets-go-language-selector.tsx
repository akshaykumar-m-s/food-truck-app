import GradientWrapper from '@/src/components/common/gradient-wrapper';
import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import LanguageSelector from '../../src/components/navigation/language-selector';

const LetsGoLanguageSelector: React.FC = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    return (
        <GradientWrapper>
            {/* 1. Language Selection Header */}
            <View style={styles.header}>
                <LanguageSelector />
            </View>

            {/* 2. Main Branding Content */}
            <View style={styles.content}>
                <Image
                    source={require('../../assets/images/FT_logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <AppText style={styles.urlText}>foodtrckr.com</AppText>

                <View>
                    <AppText style={styles.taglineText}>
                        {t('tagline')}
                    </AppText>
                </View>
            </View>

            {/* 3. Action Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.replace('/auth/login')}
                >
                    <AppText style={styles.buttonText}>{t('lets_go')}</AppText>
                </TouchableOpacity>
            </View>
        </GradientWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    langPickerTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    flagIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    langLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent', // Clicking outside closes the menu
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60, // Align with the trigger button height
        paddingRight: 20,
    },
    dropdownMenu: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        width: 150,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    dropdownItem: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    dropdownText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginHorizontal: 10,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    urlText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '300',
        marginTop: 10,
        marginBottom: 40,
    },
    taglineText: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 25,
        paddingBottom: 60,
    },
    primaryButton: {
        backgroundColor: Colors.mintGreen,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default LetsGoLanguageSelector;