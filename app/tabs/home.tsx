import { FloatingOrderStatus, HomeSection, HomeSectionData, OngoingOrderData } from '@/src/components/features/home';
import { AppText } from '@/src/components/forms/global-text';
import API_CONFIG from '@/src/config/api'; // Import your API layout definitions
import Colors from '@/src/constants/colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfileOnboardingOverlay } from 'app/screens/profile-onboarding-overlay';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for authorization tokens
import React, { useEffect, useState } from 'react'; // Added hook lifecycle tracking handlers
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// IMPORT THE NEW ONBOARDING OVERLAY COMPONENT

function HomeScreen() {
    // 1. ADD INTERCEPTION AND INTERACTION STATES
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [displayedName, setDisplayedName] = useState('Alex'); // Defaults to Alex if empty/skipped

    // Mock data for sections - this can come from API/state management
    const homeSections: HomeSectionData[] = [
        {
            id: '10-min-pickup',
            title: '10 Min Pickup',
            subtitle: 'No waiting. No delivery.',
            showSponsored: true,
        },
        {
            id: 'rescue-bites',
            title: 'Rescue Bites',
            subtitle: 'Fresh food. Reduced price. Limited time.',
            showSponsored: true,
        },
        {
            id: 'your-free-picks',
            title: 'Your Free Picks',
            subtitle: 'Free delivery on orders above zł25',
            showSponsored: false,
        },
    ];

    // Mock ongoing order data - this can come from state/API
    const ongoingOrder: OngoingOrderData = {
        id: 'order-123',
        restaurantName: 'Saravana',
        status: 'Ready in 12 Mins',
        progressSteps: 4,
        activeSteps: 3,
    };

    // 2. LIFECYCLE CHECK TO INTERCEPT COLD SESSION ENTRIES ON MOUNT
    useEffect(() => {
        const verifyProfileCompleteness = async () => {
            try {
                const token = await SecureStore.getItemAsync('accessToken');
                
                // CONNECTED: Hits GET /profile to see if the authenticated MongoDB record has name parameters filled
                const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/profile`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '', //
                        'app': 'Food Trckr'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setUserEmail(data.email || '');
                    
                    if (data.name && data.name.trim() !== "") {
                        setDisplayedName(data.name); // Hydrate name from MongoDB
                    } else {
                        setShowOnboarding(true); // Enforce onboarding modal if database fields are blank
                    }
                }
            } catch (error) {
                console.error("Profile check interception failure:", error);
            }
        };

        verifyProfileCompleteness();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Header Section */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.addressContainer}>
                            <AppText style={styles.addressText}>ul.Wiejska 12B</AppText>
                            <Feather name="chevron-down" size={18} color={Colors.primary} />
                        </TouchableOpacity>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.circleIcon}>
                                <Feather name="bell" size={20} color="#FFF" />
                                <View style={styles.badge}><AppText style={styles.badgeText}>6</AppText></View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.circleIcon}>
                                <Feather name="maximize" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* User Greeting - Made dynamic using user data properties */}
                    <View style={styles.greetingRow}>
<AppText style={styles.greetingText}>Hi {displayedName}! What's cooking near to you?</AppText>
                        <MaterialCommunityIcons name="silverware-variant" size={22} color={Colors.primary} />
                    </View>

                    {/* Filter Chips */}
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.chipsScroll}
                        contentContainerStyle={styles.chipsScrollContent}
                    >
                        <TouchableOpacity style={styles.chip}>
                            <MaterialCommunityIcons name="lightning-bolt" size={16} color="#FFF" />
                            <AppText style={styles.chipText}>Fast Pickup</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chip}>
                            <MaterialCommunityIcons name="percent" size={16} color="#FFF" />
                            <AppText style={styles.chipText}>Offers</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chip}>
                            <MaterialCommunityIcons name="leaf" size={16} color="#FFF" />
                            <AppText style={styles.chipText}>Vegan</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chip}>
                            <MaterialCommunityIcons name="fire" size={14} color="#FFF" />
                            <AppText style={styles.chipText}>Free Picks</AppText>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Dynamic Home Sections */}
                    {homeSections.map((section) => (
                        <HomeSection
                            key={section.id}
                            id={section.id}
                            title={section.title}
                            subtitle={section.subtitle}
                            showSponsored={section.showSponsored}
                            restaurants={section.restaurants}
                        />
                    ))}

                </ScrollView>

                {/* Floating Order Status - Only show when there's an ongoing order */}
                {ongoingOrder && (
                    <FloatingOrderStatus
                        id={ongoingOrder.id}
                        restaurantName={ongoingOrder.restaurantName}
                        status={ongoingOrder.status}
                        progressSteps={ongoingOrder.progressSteps}
                        activeSteps={ongoingOrder.activeSteps}
                    />
                )}
            </SafeAreaView>

            {/* MOUNT AND SURFACE THE TINTED GATED ONBOARDING MODAL ACCORDINGLY */}
            <ProfileOnboardingOverlay 
                visible={showOnboarding}
                initialEmail={userEmail}
                onClose={(updatedName) => {
                    setShowOnboarding(false);
                    if (updatedName) setDisplayedName(updatedName); // Real-time title rerender hook
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    scrollContent: { paddingBottom: 160 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingHorizontal: 20 },
    addressContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    addressText: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
    headerIcons: { flexDirection: 'row', gap: 12 },
    circleIcon: { backgroundColor: Colors.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#E11D48', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.primary },
    badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, paddingHorizontal: 20 },
    greetingText: { fontSize: 16, color: Colors.primary, fontWeight: '500' },
    chipsScroll: { marginVertical: 20 },
    chipsScrollContent: { paddingHorizontal: 20 },
    chip: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, marginRight: 10 },
    chipText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});

export default HomeScreen;