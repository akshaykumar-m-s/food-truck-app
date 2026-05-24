import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    isNew?: boolean;
    onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, isNew, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuLeft}>
            <View style={styles.iconContainer}>{icon}</View>
            <AppText style={styles.menuLabel}>{label}</AppText>
            {isNew && (
                <View style={styles.newBadge}>
                    <AppText style={styles.newBadgeText}>{t('account_page.new')}</AppText>
                </View>
            )}
        </View>
    </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
    <AppText style={styles.sectionHeader}>{title}</AppText>
);

const MOCK_GLOBAL_USER = {
    name: "Wojciech Stanisław",
    profileImage: null
};

function AccountScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

                {/* Header Section */}
                <View style={styles.userHeader}>
                    <AppText style={styles.userName}>{MOCK_GLOBAL_USER.name}</AppText>
                    <TouchableOpacity style={styles.profileCircle}>
                        <Feather name="user" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* 3x2 Grid Section */}
                <View style={styles.quickActionsGrid}>
                    {[
                        { icon: 'user', label: 'Profile', lib: 'Feather', route: '/screens/profile-page' },
                        { icon: 'bookmark-outline', label: 'Orders', lib: 'Material' },
                        { icon: 'heart', label: 'Favorites', lib: 'Feather' },
                        { icon: 'percent', label: 'Offers', lib: 'Feather' },
                        { icon: 'wallet-outline', label: 'Wallet', lib: 'Material' },
                        { icon: 'account-plus-outline', label: 'Invite', lib: 'Material' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.actionCard} onPress={() => item.route && router.push(item.route as any)} activeOpacity={0.7}>
                            <View style={styles.iconBackground}>
                                {item.lib === 'Material' && (
                                    <MaterialCommunityIcons name={item.icon as any} size={24} color={Colors.primary} />
                                )}
                                {item.lib === 'Feather' && (
                                    <Feather name={item.icon as any} size={24} color={Colors.primary} />
                                )}
                                {item.lib === 'Ionicons' && (
                                    <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
                                )}
                            </View>
                            <AppText style={styles.actionText}>{item.label}</AppText>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Menu Sections */}
                <View style={styles.section}>
                    <AppText style={styles.sectionHeader}>{t('account_page.title_head_one')}</AppText>
                    <MenuItem
                        label={t('account_page.group_order')}
                        isNew
                        icon={<Ionicons name="people-outline" size={20} color={Colors.primary} />}
                    />
                    <MenuItem
                        label={t('account_page.book_a_truck')}
                        isNew
                        icon={<Feather name="truck" size={20} color={Colors.primary} />}
                    />
                </View>

                <View style={styles.section}>
                    <AppText style={styles.sectionHeader}>{t('account_page.title_head_two')}</AppText>
                    <MenuItem
                        label={t('account_page.settings')}
                        onPress={() => router.push('/screens/settings-page')}
                        icon={<Ionicons name="settings-outline" size={20} color={Colors.primary} />}
                    />
                </View>

                <View style={styles.section}>
                    <AppText style={styles.sectionHeader}>{t('account_page.title_head_three')}</AppText>
                    <MenuItem label={t('account_page.help_support')} icon={<Ionicons name="help-circle-outline" size={22} color={Colors.primary} />} />
                    <MenuItem label={t('account_page.privacy_policy')} icon={<Feather name="lock" size={20} color={Colors.primary} />} />
                    <MenuItem label={t('account_page.terms_conditions')} icon={<MaterialCommunityIcons name="book-open-outline" size={20} color={Colors.primary} />} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF', // Reverted to clean white
    },
    container: {
        paddingHorizontal: 25,
        paddingBottom: 120, // Space for floating tab bar
    },
    userHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 25,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        flex: 1
    },
    profileCircle: {
        width: 55, height: 55, borderRadius: 27.5,
        backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    },
    iconBackground: {
        marginBottom: 4,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        // Reduce this margin to fix the excessive space issue
        marginBottom: 0,
    },
    actionCard: {
        width: '31%',
        aspectRatio: 1,
        backgroundColor: Colors.accent,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '500',
        marginTop: 6,
    },
    section: {
        // Ensure consistent spacing between grid and list sections
        marginTop: 0,
        marginBottom: 15,
        width: '100%',
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 30,
        alignItems: 'flex-start',
    },
    menuLabel: {
        fontSize: 16,
        color: Colors.primary,
        marginLeft: 15,
    },

    // Badges & Accents
    newBadge: {
        backgroundColor: Colors.mintGreen,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 10,
    },
    newBadgeText: {
        fontSize: 10,
        color: '#1B041F',
        fontWeight: 'bold',
    },

    // Logout Styling
    logoutButton: {
        backgroundColor: '#EB3C24',
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    logoutIcon: {
        marginRight: 10,
    },
    logoutText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AccountScreen;