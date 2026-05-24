import { FloatingOrderStatus, HomeSection, HomeSectionData, OngoingOrderData } from '@/src/components/features/home';
import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function HomeScreen() {
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

                    {/* User Greeting */}
                    <View style={styles.greetingRow}>
                        <AppText style={styles.greetingText}>Hi Alex! What's cooking near to you?</AppText>
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