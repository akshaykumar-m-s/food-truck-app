import { Feather } from '@expo/vector-icons';
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
// 1. IMPORT NATIVE SVG PRIMITIVES TO MANAGE VECTOR ASSETS SAFELY
import Svg, { Defs, Mask, Path, Rect } from 'react-native-svg';

import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';

const { width } = Dimensions.get('window');

const RECOMMENDATIONS = [
    { id: 'rec-1', name: 'Calamari Rings', price: '24,90 zł', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641' },
    { id: 'rec-2', name: 'Onion Rings', price: '24,90 zł', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641' },
    { id: 'rec-3', name: 'Cabbage Pakoda', price: '24,90 zł', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641' },
];

// 2. INLINE THE SVG GRAPHIC AS A VALID COMPOSITE FUNCTION COMPONENT
function EmptyCartSmiley({ width = 60, height = 100 }: { width?: number; height?: number }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 60 102" fill="none">
            <Defs>
                <Mask id="path-3-inside-1_3487_7513" fill="white">
                    <Rect y="38.4197" width="59.6664" height="63.0248" rx="2" />
                </Mask>
            </Defs>
            <Path d="M7.94141 4.86572L17.2692 15.3305M51.7245 4.86572L42.3967 15.3305L51.7245 4.86572ZM29.7911 1.25V15.3305V1.25Z" stroke={Colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M53.4688 29.5805L50.0527 34.7045L49.3965 35.6879L50.3428 36.3979L53.625 38.8588H5.75L9.38184 36.4379L10.501 35.6918L9.6748 34.6303L5.74805 29.5805H53.4688Z" fill="#D3C7D5" stroke="#D3C7D5" strokeWidth="2.5" />
            <Rect y="38.4197" width="59.6664" height="63.0248" rx="2" fill="white" stroke={Colors.primary} strokeWidth="5" mask="url(#path-3-inside-1_3487_7513)" />
            <Path d="M1.33203 72.6184V41.5665C1.33203 40.2871 2.37239 39.25 3.65573 39.25H56.8189C57.6546 39.25 58.332 39.9414 58.332 40.7943V97.1614C58.332 98.8672 56.9772 100.25 55.3058 100.25H4.35824C2.68691 100.25 1.33203 98.8672 1.33203 97.1614V85.6213V82.4905M1.33203 79.3227V75.845" stroke={Colors.primary} strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M2.40247 39.3283V29.9056C2.40247 29.0382 3.03351 28.3351 3.81193 28.3351L55.9616 28.3351C56.7401 28.3351 57.3711 29.0382 57.3711 29.9056V39.3283" stroke={Colors.primary} strokeWidth="2.5" />
            <Path d="M42.8453 56.4119C41.3274 56.4119 40.0969 57.6423 40.0969 59.1602C40.0969 60.678 41.3274 61.9084 42.8453 61.9084C44.3632 61.9084 45.5938 60.678 45.5938 59.1602C45.5938 57.6423 44.3632 56.4119 42.8453 56.4119Z" fill="#E8F0FE" stroke={Colors.primary} strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M1.33203 72.6184V41.5665C1.33203 40.2871 2.37239 39.25 3.65573 39.25H56.8189C57.6546 39.25 58.332 39.9414 58.332 40.7943V97.1614C58.332 98.8672 56.9772 100.25 55.3058 100.25H4.35824C2.68691 100.25 1.33203 98.8672 1.33203 97.1614V85.6213V82.4905M1.33203 79.3227V75.845" stroke={Colors.primary} strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M16.9313 56.4119C15.4133 56.4119 14.1828 57.6423 14.1828 59.1602C14.1828 60.678 15.4133 61.9084 16.9313 61.9084C18.4492 61.9084 19.6797 60.678 19.6797 59.1602C19.6797 57.6423 18.4492 56.4119 16.9313 56.4119Z" fill="#E8F0FE" stroke={Colors.primary} strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M17.3246 81.0454C17.3246 74.1067 22.9498 68.4818 29.8889 68.4818C36.8279 68.4818 42.4531 74.1067 42.4531 81.0454" stroke={Colors.primary} strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M3.23554 29.1127L8.76385 34.5695C9.09415 34.8956 9.0976 35.4276 8.77155 35.7579C8.71513 35.8151 8.6508 35.8638 8.58053 35.9027L2.40234 39.3231" stroke={Colors.primary} strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M56.6755 29.168L51.3854 34.5633C51.0605 34.8947 51.0657 35.4267 51.3971 35.7517C51.4524 35.8059 51.515 35.8522 51.583 35.8893L57.875 39.3215" stroke={Colors.primary} strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
    );
}

export default function EmptyCartScreen() {
    const router = useRouter();
    const routerNavigation = useNavigation();
    const insets = useSafeAreaInsets();
    const tabBarHeight = Platform.OS === 'ios' ? 95 : 80;
    const footerBottomOffset = tabBarHeight + insets.bottom;

    // Android Hardware Back Button Hook
    useEffect(() => {
        const handleHardwareBack = () => {
            router.navigate('/tabs/home');
            return true; 
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
        return () => subscription.remove();
    }, [router]);

    // iOS Swipe-Back Gesture Interception Hook
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
                            <EmptyCartSmiley width={59} height={100} />
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

            {/* Persistent Bottom Call-to-Action */}
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
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, marginTop: 4 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginLeft: 8 },
    
    // FIXED: Shifted child elements into full center grid positioning configurations safely
    splashContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, marginTop: 24, marginBottom: 10, flexShrink: 1, width: '100%' },
    iconCircleWrapper: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
    screenContent: { flexGrow: 1, alignItems: 'center', paddingTop: 24 },
    
    // FIXED: Repositioned flex alignments from 'flex-start' to center to fix the asymmetry layout distortion
    textGradientContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 12, width: '100%', height: 100 },
    
    // FIXED: Adjusted text alignment property blocks to handle paragraph lines natively centered
    gradientLineText: { fontSize: 40, fontWeight: '700', color: Colors.primary, textAlign: 'center', alignSelf: 'stretch', lineHeight: 48 },
    
    subtitle: { fontSize: 15, color: '#A1A1A1', textAlign: 'center', lineHeight: 22, marginTop: 2, paddingHorizontal: 12, fontWeight: '400' },
    recommendationHeader: { width: '100%', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 18, marginTop: 26 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, textAlign: 'left' },
    horizontalList: { marginVertical: 4 },
    horizontalListContent: { paddingHorizontal: 14, gap: 10 },
    foodCard: { width: 220, height: 80, backgroundColor: '#FFF', borderRadius: 18, borderWidth: 1, borderColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
    foodCardImage: { width: 56, height: 56, borderRadius: 12 },
    foodCardText: { flex: 1, justifyContent: 'center' },
    foodName: { fontSize: 13, fontWeight: '700', color: Colors.primary, width: '100%', marginBottom: 2 },
    foodPrice: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    addBtn: { backgroundColor: Colors.primary, width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    footerContainer: { left: 0, right: 0, paddingHorizontal: 20, backgroundColor: '#FFF', alignItems: 'center' },
    fillTummyButton: { width: 315, maxWidth: '100%', height: 56, backgroundColor: Colors.mintGreen, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    fillTummyButtonText: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
});