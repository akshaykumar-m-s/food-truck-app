import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

const SUPPORTED_LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pl', label: 'Polski', flag: '🇵🇱' },
    // { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    const currentLang = useMemo(() => {
        return SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];
    }, [i18n.language]); // Dependency on i18n.language is critical

    const selectLanguage = async (code: string) => {
        await i18n.changeLanguage(code);
        setIsVisible(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.trigger} onPress={() => setIsVisible(true)}>
                <AppText style={styles.triggerFlag}>{currentLang.flag}</AppText>
                <AppText style={styles.triggerText}>{currentLang.code.toUpperCase()}</AppText>
            </TouchableOpacity>

            <Modal visible={isVisible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setIsVisible(false)}>
                    <View style={styles.menu}>
                        <FlatList
                            data={SUPPORTED_LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => selectLanguage(item.code)}
                                >
                                    <AppText style={styles.itemText}>
                                        {item.flag} {item.label}
                                    </AppText>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    triggerFlag: { fontSize: 18, marginRight: 8 },
    triggerText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 20,
    },
    menu: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        width: 180,
        maxHeight: 300, // Handle long lists with scrolling
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        paddingVertical: 5,
    },
    item: { padding: 15 },
    itemText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 10 },
});

export default LanguageSelector;