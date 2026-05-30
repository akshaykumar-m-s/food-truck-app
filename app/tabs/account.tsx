import { AppText } from '@/src/components/forms/global-text';
import API_CONFIG from '@/src/config/api'; // Integrated base API configuration paths
import Colors from '@/src/constants/colors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // Secure store integration for token parsing
import { StatusBar } from 'expo-status-bar';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react'; // Hook integrations
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
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

function AccountScreen() {
    const router = useRouter();
    
    // Dynamic profile and loading state handles
    const [firstName, setFirstName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user details from backend collection on mount
    useEffect(() => {
        const loadUserHeaderProfile = async () => {
            try {
                const token = await SecureStore.getItemAsync('accessToken');
                
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/profile`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                        'app': 'Food Trckr'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFirstName(data.name || 'User');
                }
            } catch (error) {
                console.error("Account view context failed to load profile header:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserHeaderProfile();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingCenter}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

                {/* Header Section */}
                <View style={styles.userHeader}>
                    <AppText style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                        {firstName}
                    </AppText>
                    <TouchableOpacity style={styles.profileCircle}>
                        <Feather name="user" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* 3x2 Grid Section - Restructured with tighter Figma spacing alignments */}
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
        backgroundColor: '#FFF',
    },
    loadingCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    container: {
        paddingHorizontal: 25,
        paddingBottom: 120,
    },
    userHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        flex: 1,
        marginRight: 12,
    },
    profileCircle: {
        width: 55, height: 55, borderRadius: 27.5,
        backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    },
    iconBackground: {
        marginBottom: 2,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // FIXED: Cleared messy flex padding bugs and introduced crisp rowGap layout controls
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        rowGap: 12, 
        marginBottom: 28,
    },
    // FIXED: Removed unstable aspectRatio, setting explicit proportions matching your 91x89 figma spec profile
    actionCard: {
        width: '31.2%',
        height: 90, 
        backgroundColor: Colors.accent,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    actionText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '500',
        marginTop: 4,
        textAlign: 'center',
    },
    section: {
        marginTop: 0,
        marginBottom: 20,
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
});

export default AccountScreen;