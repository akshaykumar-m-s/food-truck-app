import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    BackHandler,
    Dimensions,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';

const { width } = Dimensions.get('window');

const RECOMMENDATIONS = [
    { id: 'rec-1', name: 'Calamari Rings', price: '24,90 zł', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641' },
    { id: 'rec-2', name: 'Onion Rings', price: '24,90 zł', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641' },
    { id: 'rec-3', name: 'Cabbage Pakoda', price: '24,90 zł', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641' },
];

export default function EmptyCartScreen() {
    const router = useRouter();
    const routerNavigation = useNavigation();
    const insets = useSafeAreaInsets();
    const tabBarHeight = Platform.OS === 'ios' ? 95 : 80;
    const footerBottomOffset = tabBarHeight + insets.bottom;

    // 1. Android Hardware Back Button Hook - Smoothly redirects back to home
    useEffect(() => {
        const handleHardwareBack = () => {
            router.navigate('/tabs/home');
            return true; 
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
        return () => subscription.remove();
    }, [router]);

    // 2. iOS Swipe-Back Gesture Interception Hook
    useEffect(() => {
        const unsubscribe = routerNavigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === 'GO_BACK' || e.data.action.type === 'POP') {
                e.preventDefault(); 
                router.navigate('/tabs/home'); 
            }
        });

        return unsubscribe;
    }, [routerNavigation, router]);

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>

                {/* Navigation Header Component */}
               <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.navigate('/tabs/home')} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Your Cart</AppText>
                </View>

                <View style={[styles.screenContent, { paddingBottom: footerBottomOffset + 24 }]}>

                    {/* Main Informational Splash Illustration Section */}
                    <View style={styles.splashContainer}>
                        <View style={styles.iconCircleWrapper}>
                            <MaterialCommunityIcons name="emoticon-sad-outline" size={90} color={Colors.primary} />
                        </View>

                        {/* Translated Gradient Header: Twój koszyk jest pusty! -> Your cart is empty! */}
                        <View style={styles.textGradientContainer}>
                            <AppText style={styles.gradientLineText}>
                                {'Your cart\nis empty!'}
                            </AppText>
                        </View>

                        {/* Translated Explanatory Subtitle */}
                        <AppText style={styles.subtitle}>
                            Your order has been successfully placed! The merchant will confirm your order shortly. Thank you for choosing foodtrckr.com!
                        </AppText>
                    </View>

                    {/* Section: Horizontal Recommendations (Styled like the Home Screen layouts) */}
                    <View style={styles.recommendationHeader}>
                        <AppText style={styles.sectionTitle}>Ready in 10 Minutes</AppText>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.horizontalList}
                        contentContainerStyle={styles.horizontalListContent}
                    >
                        {RECOMMENDATIONS.map((item) => (
                            <View key={item.id} style={styles.foodCard}>
                                <ImageBackground source={{ uri: item.image }} style={styles.foodCardImage} imageStyle={{ borderRadius: 12 }} />
                                <View style={styles.foodCardText}>
                                    <AppText style={styles.foodName} numberOfLines={1}>{item.name}</AppText>
                                    <AppText style={styles.foodPrice}>{item.price}</AppText>
                                </View>
                                <TouchableOpacity
                                    style={styles.addBtn}
                                    activeOpacity={0.8}
                                    onPress={() => router.push({
                                        pathname: '/product-detail-screen',
                                        params: {
                                            id: String(item.id),
                                            name: item.name,
                                            price: item.price,
                                            image: item.image,
                                        },
                                    })}
                                >
                                    <Feather name="plus" size={12} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                </View>
            </SafeAreaView>

            {/* Persistent Bottom Call-to-Action: Napełnij mój brzuszek! -> Fill my tummy! */}
            <View style={[styles.footerContainer, { paddingBottom: footerBottomOffset, paddingTop: 4 }]}>
                <TouchableOpacity
                    style={styles.fillTummyButton}
                    activeOpacity={0.9}
                    onPress={() => router.navigate('/tabs/home')}
                >
                    <AppText style={styles.fillTummyButtonText}>Fill my tummy!</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 0, paddingBottom: 120 },

    // Header Component Formatting Styles
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, marginTop: 4 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginLeft: 8 },

    // Center Splash Information Layout Metrics
    splashContainer: { alignItems: 'center', paddingHorizontal: 32, marginTop: 24, marginBottom: 10, flexShrink: 1 },
    iconCircleWrapper: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },

    // Custom Core Gradient Mechanics using an actual masked linear gradient
    screenContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 24,
    },
    textGradientContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginVertical: 12,
        width: '100%',
        paddingLeft: 24,
        height: 140,
    },
    maskedView: {
        width: '100%',
        height: '100%',
    },
    maskContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 24,
        backgroundColor: 'transparent',
    },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    gradientLineText: {
        fontSize: 40,
        fontWeight: '700',
        color: Colors.primary,
        textAlign: 'left',
        alignSelf: 'stretch',
        lineHeight: 48,
    },
    gradientDeepLeft: {
        color: '#2F1243', // Legacy color styles preserved for reference
    },
    gradientFadeRight: {
        color: '#7C678A',
        fontWeight: '600',
    },
    gradientFadeRightSub: {
        color: '#9C8BA6',
        fontWeight: '500',
    },

    subtitle: { fontSize: 15, color: '#A1A1A1', textAlign: 'center', lineHeight: 22, marginTop: 2, paddingHorizontal: 12, fontWeight: '400' },

    bottomContent: { width: '100%', flexShrink: 1 },
    // Home-style Category Headers layout adjustments
    recommendationHeader: { width: '100%', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 18, marginTop: 26 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, textAlign: 'left' },

    // Horizontal Slider Grid layout parameters
    horizontalList: { marginVertical: 4 },
    horizontalListContent: { paddingHorizontal: 14, gap: 10 },
    foodCard: {
        width: 220,
        height: 80,
        backgroundColor: '#FFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
    },
    foodCardImage: { width: 56, height: 56, borderRadius: 12 },
    foodCardText: { flex: 1, justifyContent: 'center' },
    foodName: { fontSize: 13, fontWeight: '700', color: Colors.primary, width: '100%', marginBottom: 2 },
    foodPrice: { fontSize: 12, color: '#6B7280', marginBottom: 0, fontWeight: '500' },
    addBtn: { backgroundColor: Colors.primary, width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    addBtnText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

    // Sticky Green Bottom Action Button Formatting parameters
    footerContainer: { left: 0, right: 0, paddingHorizontal: 20, backgroundColor: '#FFF', alignItems: 'center' },
    fillTummyButton: { width: 315, maxWidth: '100%', height: 56, backgroundColor: Colors.mintGreen, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    fillTummyButtonText: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
});