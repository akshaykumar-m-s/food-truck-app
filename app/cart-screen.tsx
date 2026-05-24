import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';

const { width } = Dimensions.get('window');

// Mock Data representing your exact cart items and special offer rows
const INITIAL_CART_ITEMS = [
    { id: 1, name: 'Butter Chicken with Ghee Topping', price: 30.0, quantity: 3 },
    {
        id: 2,
        name: 'Avocado Toast',
        price: 30.0,
        quantity: 3,
        subtext: 'Pepperoni (XXL)\nWybierz ciasto: Cienkie\nDodatki: Wołowina (6,98 PLN), Ananas (6,98 PLN), Sos śmietanowo-majo... (6,98 PLN)\nSos bazowy pizzy: Sos pomidorowy\nopłata za pudełko: opłata za pudełko x1 (1,99 PLN)'
    },
    { id: 3, name: 'Butter Chicken with Ghee Topping', price: 30.0, quantity: 3 },
];

const OFFER_ITEMS = [
    { id: 101, title: 'Offer unlocked via Foodtracker! BUY 3 GET 1 FREE', name: 'Masala Dosa — FREE You bought 3', subtext: '(Your 4th one is on the house!)', originalPrice: 'PLN 30.00', finalPrice: 'PLN 00.00' },
    { id: 102, title: 'Offer unlocked via Foodtracker! BUY 3 GET 1 FREE', name: 'Vada Set — FREE You bought 2', subtext: '• (Your 3rd one is on the house!)', originalPrice: 'PLN 12.00', finalPrice: 'PLN 00.00' },
];

export default function CartScreen() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

    const updateQuantity = (id: number, increment: boolean) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    const newQty = increment ? item.quantity + 1 : item.quantity - 1;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>

                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Your Cart</AppText>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Restaurant Sub-Header */}
                    <View style={styles.restaurantSection}>
                        <View style={styles.restaurantLeft}>
                            <AppText style={styles.restaurantName}>Saravana Dosa & Curry</AppText>
                            <View style={styles.locationRow}>
                                <View style={styles.distanceTag}>
                                    <Feather name="map-pin" size={10} color={Colors.primary} />
                                    <AppText style={styles.distanceText}>0.6 km</AppText>
                                </View>
                                <AppText style={styles.addressText}>44 Szewska, Wrocław</AppText>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.directionsButton}>
                            <MaterialCommunityIcons name="navigation-variant" size={20} color="#10B981" />
                            <AppText style={styles.directionsText}>Directions</AppText>
                        </TouchableOpacity>
                    </View>

                    <AppText style={styles.sectionTitle}>Your products</AppText>

                    {/* Standard Cart Products List */}
                    {cartItems.map(item => (
                        <View key={item.id} style={styles.productRow}>
                            <View style={styles.quantitySquare}>
                                <AppText style={styles.quantitySquareText}>{item.quantity}x</AppText>
                            </View>
                            <View style={styles.productDetails}>
                                <AppText style={styles.productName}>{item.name}</AppText>
                                {item.subtext && <AppText style={styles.productSubtext}>{item.subtext}</AppText>}

                                <View style={styles.productFooter}>
                                    <View style={styles.stepper}>
                                        <TouchableOpacity onPress={() => updateQuantity(item.id, false)} style={styles.stepperAction}>
                                            <Feather name="minus" size={14} color={Colors.primary} />
                                        </TouchableOpacity>
                                        <AppText style={styles.stepperValue}>{item.quantity}</AppText>
                                        <TouchableOpacity onPress={() => updateQuantity(item.id, true)} style={styles.stepperAction}>
                                            <Feather name="plus" size={14} color={Colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                    <AppText style={styles.productPrice}>PLN {(item.price * item.quantity).toFixed(2)}</AppText>
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* Unlocked Special Offer Rows */}
                    {OFFER_ITEMS.map(offer => (
                        <View key={offer.id} style={styles.offerContainer}>
                            <View style={styles.offerHeaderBar}>
                                <Feather name="gift" size={12} color="#FFF" />
                                <AppText style={styles.offerHeaderBarText}>{offer.title}</AppText>
                            </View>
                            <View style={styles.offerBodyRow}>
                                <View style={styles.offerItemBadge}>
                                    <AppText style={styles.offerItemBadgeText}>1x</AppText>
                                </View>
                                <View style={styles.offerDetails}>
                                    <AppText style={styles.offerItemName}>{offer.name}</AppText>
                                    <AppText style={styles.offerItemSubtext}>{offer.subtext}</AppText>
                                </View>
                                <View style={styles.offerPriceContainer}>
                                    <AppText style={styles.offerOriginalPrice}>{offer.originalPrice}</AppText>
                                    <AppText style={styles.offerFinalPrice}>{offer.finalPrice}</AppText>
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* Add More Products Trigger Button */}
                    <TouchableOpacity style={styles.addMoreButton} onPress={() => router.back()}>
                        <AppText style={styles.addMoreButtonText}>+ Add more products</AppText>
                    </TouchableOpacity>

                    {/* Cooking Instructions Text Box */}
                    <View style={styles.instructionsContainer}>
                        <AppText style={styles.instructionsTitle}>Cooking Instructions</AppText>
                        <View style={styles.instructionsInputPlaceholder} />
                    </View>

                    {/* Payment Breakdown Summary Layout */}
                    <View style={styles.paymentSummaryContainer}>
                        <AppText style={styles.summaryHeading}>Payment Summary</AppText>

                        <View style={styles.summaryRow}>
                            <AppText style={styles.summaryLabel}>Subtotal</AppText>
                            <AppText style={styles.summaryValue}>PLN 30.00</AppText>
                        </View>

                        <View style={styles.summaryRow}>
                            <AppText style={styles.summaryLabel}>Service fee</AppText>
                            <AppText style={[styles.summaryValue, { color: '#10B981', fontWeight: '600' }]}>Free</AppText>
                        </View>

                        <View style={styles.summaryRow}>
                            <AppText style={styles.summaryLabel}>🎉 Free Masala Dosa (BUY 3 GET 1)</AppText>
                            <AppText style={[styles.summaryValue, styles.discountText]}>-PLN 8.00</AppText>
                        </View>

                        <View style={styles.summaryRow}>
                            <AppText style={styles.summaryLabel}>🎁 Free Vada Set (BUY 2 GET 1)</AppText>
                            <AppText style={[styles.summaryValue, styles.discountText]}>-PLN 18.00</AppText>
                        </View>

                        <View style={styles.summaryRow}>
                            <AppText style={styles.summaryLabel}>Promo (Buy 3, get 1 free)</AppText>
                            <AppText style={[styles.summaryValue, styles.discountText]}>-PLN 22.00</AppText>
                        </View>

                        <View style={styles.dividerLine} />

                        <View style={styles.totalRow}>
                            <AppText style={styles.totalLabel}>Total:</AppText>
                            <AppText style={styles.totalValue}>PLN 98.00</AppText>
                        </View>
                    </View>

                    {/* Success / Savings Highlight Bar */}
                    <View style={styles.savingsHighlightBar}>
                        <MaterialCommunityIcons name="percent" size={14} color="#16A34A" />
                        <AppText style={styles.savingsHighlightText}>
                            Great choice — you saved <AppText style={{ fontWeight: 'bold' }}>64,000 PLN!</AppText> today!
                        </AppText>
                    </View>

                </ScrollView>
            </SafeAreaView>

            {/* Main Bottom Checkout Sticky Action Component Container */}
            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.placeOrderButton} activeOpacity={0.9}>
                    <AppText style={styles.placeOrderButtonText}>Place order</AppText>
                </TouchableOpacity>

                <View style={styles.securityRow}>
                    <Feather name="lock" size={12} color="#6B7280" />
                    <AppText style={styles.securityText}>Secure payments. Your data is protected.</AppText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

    // Header Layout Styles
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, marginTop: 4 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },

    // Restaurant Profile Slat Styles
    restaurantSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    restaurantLeft: { flex: 1 },
    restaurantName: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
    distanceTag: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#F3F4F6', borderRadius: 6 },
    distanceText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
    addressText: { fontSize: 12, color: '#6B7280' },
    directionsButton: { alignItems: 'center', justifyContent: 'center', paddingLeft: 12 },
    directionsText: { fontSize: 11, color: '#6B7280', marginTop: 2 },

    // General Sections Typography
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginBottom: 16, marginTop: 8 },

    // Standard Item Card Grid Structural Styles
    productRow: { flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    quantitySquare: { width: 40, height: 40, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    quantitySquareText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
    productDetails: { flex: 1 },
    productName: { fontSize: 15, fontWeight: '600', color: Colors.primary },
    productSubtext: { fontSize: 11, color: '#6B7280', marginTop: 4, lineHeight: 15 },
    productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    productPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },

    // Embedded Custom Counter Components
    stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, height: 30, backgroundColor: '#FFF' },
    stepperAction: { paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', height: '100%' },
    stepperValue: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, minWidth: 16, textAlign: 'center' },

    // Special Promotional Offers Presentation Grid Styles
    offerContainer: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', marginVertical: 8, backgroundColor: '#F0FDF4' },
    offerHeaderBar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#16A34A', paddingVertical: 6, paddingHorizontal: 12 },
    offerHeaderBarText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    offerBodyRow: { flexDirection: 'row', padding: 12, alignItems: 'center' },
    offerItemBadge: { width: 32, height: 32, backgroundColor: '#BBF7D0', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    offerItemBadgeText: { fontSize: 13, fontWeight: 'bold', color: '#16A34A' },
    offerDetails: { flex: 1 },
    offerItemName: { fontSize: 14, fontWeight: '600', color: Colors.primary },
    offerItemSubtext: { fontSize: 11, color: '#16A34A', marginTop: 2 },
    offerPriceContainer: { alignItems: 'flex-end', justifyContent: 'center' },
    offerOriginalPrice: { fontSize: 11, color: '#9CA3AF', textDecorationLine: 'line-through' },
    offerFinalPrice: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, marginTop: 2 },

    // Custom Action Trigger Intermediaries
    addMoreButton: { width: '100%', height: 48, backgroundColor: Colors.primary, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginVertical: 16 },
    addMoreButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
    instructionsContainer: { marginVertical: 8 },
    instructionsTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
    instructionsInputPlaceholder: { width: '100%', height: 72, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },

    // Bottom Financial Table Breakdown Metrics
    paymentSummaryContainer: { marginTop: 16, paddingVertical: 8 },
    summaryHeading: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginBottom: 14 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
    summaryLabel: { fontSize: 14, color: '#4B5563' },
    summaryValue: { fontSize: 14, fontWeight: '500', color: Colors.primary },
    discountText: { color: '#DC2626', fontWeight: '600' },
    dividerLine: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    totalLabel: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
    totalValue: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },

    // Marketing / Green Micro-Highlight Banners
    savingsHighlightBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#DCFCE7', padding: 12, borderRadius: 8, marginVertical: 16, justifyContent: 'center' },
    savingsHighlightText: { fontSize: 13, color: '#16A34A', textAlign: 'center' },

    // Checkout Fixed View Context Bounding Geometry
    footerContainer: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFF' },
    placeOrderButton: { width: '100%', height: 54, backgroundColor: Colors.primary, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
    placeOrderButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    securityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
    securityText: { fontSize: 12, color: '#6B7280' },
});