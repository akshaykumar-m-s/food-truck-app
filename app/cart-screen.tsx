import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import EmptyCartScreen from '@/src/components/features/cart/empty-cart-screen';
import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { cartManager } from '@/src/services/cart-manager';

const { width } = Dimensions.get('window');

export default function CartScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    // Subscribe directly to the live structured store dictionary data
    const [cartStore, setCartStore] = useState(cartManager.getCartStore());
    const [instructions, setInstructions] = useState('');

    useEffect(() => {
      const unsubscribe = cartManager.subscribe((latestStore) => {
        setCartStore(latestStore);
      });
      return () => unsubscribe();
    }, []);

    // Format the items from the cart manager so they work with our layout list renderer
    const activeCartItems = useMemo(() => {
      return Object.entries(cartStore)
        .filter(([, item]) => item.qty > 0)
        .map(([instanceKey, item]) => ({
          instanceKey,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          subtext: item.subtext,
        }));
    }, [cartStore]);

    const updateQuantity = (instanceKey: string, increment: boolean) => {
        const currentQty = cartStore[instanceKey]?.qty || 0;
        const targetQty = increment ? currentQty + 1 : currentQty - 1;
        cartManager.setQuantity(instanceKey, targetQty);
    };

    // Financial Calculation Engines
    const financialSummary = useMemo(() => {
      const subtotal = activeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalUnitsCount = activeCartItems.reduce((sum, item) => sum + item.quantity, 0);
      
      let freeDosaDiscount = 0;
      let freeVadaDiscount = 0;
      let conditionalPromoDiscount = 0;

      if (subtotal > 0) {
        if (totalUnitsCount >= 3) {
          freeDosaDiscount = 8.00;
          conditionalPromoDiscount = 22.00;
        }
        if (totalUnitsCount >= 2) {
          freeVadaDiscount = 18.00;
        }
      }

      const aggregateDiscounts = freeDosaDiscount + freeVadaDiscount + conditionalPromoDiscount;
      const definitiveTotal = Math.max(0, subtotal - aggregateDiscounts);
      const computedWalletSavings = aggregateDiscounts + 15.50;

      return {
        subtotal: subtotal.toFixed(2),
        freeDosaDiscount: freeDosaDiscount.toFixed(2),
        freeVadaDiscount: freeVadaDiscount.toFixed(2),
        conditionalPromoDiscount: conditionalPromoDiscount.toFixed(2),
        definitiveTotal: definitiveTotal.toFixed(2),
        computedWalletSavings: computedWalletSavings.toFixed(2)
      };
    }, [activeCartItems]);

    const hasItemsInCart = activeCartItems.length > 0;

    if (!hasItemsInCart) {
        return <EmptyCartScreen />;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>

                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>Your Cart</AppText>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
                >

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

                    {/* Standard Live Cart Products List */}
                    {activeCartItems.map(item => (
                        <View key={item.instanceKey} style={styles.productRow}>
                            <View style={styles.quantitySquare}>
                                <AppText style={styles.quantitySquareText}>{item.quantity}x</AppText>
                            </View>
                            
                            <View style={styles.productDetails}>
                                <AppText style={styles.productName}>{item.name}</AppText>
                                {item.subtext ? (
                                    <AppText style={styles.productSubtext}>{item.subtext}</AppText>
                                ) : null}
                            </View>

                            {/* Right Side Controls and Pricing Stack */}
                            <View style={styles.productActionColumn}>
                                <View style={styles.stepper}>
                                    <TouchableOpacity onPress={() => updateQuantity(item.instanceKey, false)} style={styles.stepperAction}>
                                        <Feather name="minus" size={14} color={Colors.primary} />
                                    </TouchableOpacity>
                                    <View style={styles.stepperValueBox}>
                                        <AppText style={styles.stepperValue}>{item.quantity}</AppText>
                                    </View>
                                    <TouchableOpacity onPress={() => updateQuantity(item.instanceKey, true)} style={styles.stepperAction}>
                                        <Feather name="plus" size={14} color={Colors.primary} />
                                    </TouchableOpacity>
                                </View>
                                <AppText style={styles.productPrice}>PLN {(item.price * item.quantity).toFixed(2)}</AppText>
                            </View>
                        </View>
                    ))}

                    {/* Unlocked Special Offer Rows */}
                    {hasItemsInCart && (
                      <View style={styles.offerContainer}>
                          <View style={styles.offerHeaderBar}>
                              <Feather name="gift" size={12} color="#FFF" />
                              <AppText style={styles.offerHeaderBarText}>Offer unlocked via Foodtracker! BUY 3 GET 1 FREE</AppText>
                          </View>
                          <View style={styles.offerBodyRow}>
                              <View style={styles.offerItemBadge}>
                                  <AppText style={styles.offerItemBadgeText}>1x</AppText>
                              </View>
                              <View style={styles.offerDetails}>
                                  <AppText style={styles.offerItemName}>Masala Dosa — FREE You bought 3</AppText>
                                  <AppText style={styles.offerItemSubtext}>(Your 4th one is on the house!)</AppText>
                              </View>
                              <View style={styles.offerPriceContainer}>
                                  <AppText style={styles.offerOriginalPrice}>PLN 30.00</AppText>
                                  <AppText style={styles.offerFinalPrice}>PLN 00.00</AppText>
                              </View>
                          </View>
                      </View>
                    )}

                    {/* Add More Products Trigger Button */}
                    <TouchableOpacity style={styles.addMoreButton} onPress={() => router.back()}>
                        <AppText style={styles.addMoreButtonText}>+ Add more products</AppText>
                    </TouchableOpacity>

                    {/* Cooking Instructions Text Box */}
                    <View style={styles.instructionsContainer}>
                        <AppText style={styles.instructionsTitle}>Cooking Instructions</AppText>
                        <TextInput
                            style={styles.instructionsInput}
                            placeholder="Add a note (e.g. no onions, extra spicy...)"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            value={instructions}
                            onChangeText={setInstructions}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Live Financial Breakdown Summary Section */}
                    <View style={styles.paymentSummaryContainer}>
                        <AppText style={styles.summaryHeading}>Payment Summary</AppText>

                        <View style={styles.summaryRow}>
                            <AppText style={styles.summaryLabel}>Subtotal</AppText>
                            <AppText style={styles.summaryValue}>PLN {financialSummary.subtotal}</AppText>
                        </View>

                        <View style={styles.summaryRow}>
                            <AppText style={styles.summaryLabel}>Service fee</AppText>
                            <AppText style={[styles.summaryValue, { color: '#10B981', fontWeight: '600' }]}>Free</AppText>
                        </View>

                        {hasItemsInCart && (
                          <>
                            <View style={styles.summaryRow}>
                                <AppText style={styles.summaryLabel}>🎉 Free Masala Dosa (BUY 3 GET 1)</AppText>
                                <AppText style={[styles.summaryValue, styles.discountText]}>-PLN {financialSummary.freeDosaDiscount}</AppText>
                            </View>
                            <View style={styles.summaryRow}>
                                <AppText style={styles.summaryLabel}>Promo (Buy 3, get 1 free)</AppText>
                                <AppText style={[styles.summaryValue, styles.discountText]}>-PLN {financialSummary.conditionalPromoDiscount}</AppText>
                            </View>
                          </>
                        )}

                        <View style={styles.dividerLine} />

                        <View style={styles.totalRow}>
                            <AppText style={styles.totalLabel}>Total:</AppText>
                            <AppText style={styles.totalValue}>PLN {financialSummary.definitiveTotal}</AppText>
                        </View>
                    </View>

                    {/* Savings Notification Badge */}
                    {hasItemsInCart && (
                      <View style={styles.savingsHighlightBar}>
                          <MaterialCommunityIcons name="percent" size={14} color="#16A34A" />
                          <AppText style={styles.savingsHighlightText}>
                              Great choice — you saved <AppText style={{ fontWeight: 'bold' }}>{financialSummary.computedWalletSavings} PLN!</AppText> today!
                          </AppText>
                      </View>
                    )}

                    </ScrollView>

                {/* Sticky Checkout Action Component Container */}
                <View style={[styles.footerContainer, { paddingBottom: 24 + insets.bottom }]}> 
                    <TouchableOpacity 
                      style={[styles.placeOrderButton, !hasItemsInCart && styles.disabledButton]} 
                      activeOpacity={hasItemsInCart ? 0.9 : 1}
                      disabled={!hasItemsInCart}
                    >
                        <AppText style={styles.placeOrderButtonText}>Place order</AppText>
                    </TouchableOpacity>

                    <View style={styles.securityRow}>
                        <Feather name="lock" size={12} color="#6B7280" />
                        <AppText style={styles.securityText}>Secure payments. Your data is protected.</AppText>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, marginTop: 4 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
    restaurantSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    restaurantLeft: { flex: 1 },
    restaurantName: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
    distanceTag: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#F3F4F6', borderRadius: 6 },
    distanceText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
    addressText: { fontSize: 12, color: '#6B7280' },
    directionsButton: { alignItems: 'center', justifyContent: 'center', paddingLeft: 12 },
    directionsText: { fontSize: 11, color: '#6B7280', marginTop: 2 },
    emptyStateBox: { padding: 32, alignItems: 'center', justifyContent: 'center', gap: 12 },
    emptyStateText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginBottom: 16, marginTop: 8 },
    
    // Adjusted Products Row Styles to accommodate dynamic add-on subtexts
    productRow: { 
        flexDirection: 'row', 
        paddingVertical: 14, 
        borderBottomWidth: 1, 
        borderBottomColor: '#F3F4F6',
        alignItems: 'center'
    },
    quantitySquare: { 
        width: 44, 
        height: 44, 
        backgroundColor: '#F7F6F9', 
        borderRadius: 4, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 12 
    },
    quantitySquareText: { fontSize: 15, fontWeight: '500', color: '#1B041F' },
    productDetails: { 
        flex: 1,
        paddingRight: 8
    },
    productName: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#1B041F',
        lineHeight: 22
    },
    productSubtext: { 
        fontSize: 11, 
        color: '#4B5563', 
        marginTop: 4, 
        lineHeight: 16,
        fontWeight: '400'
    },
    productActionColumn: { 
        alignItems: 'center',
        justifyContent: 'flex-start',
        minWidth: 90
    },
    stepper: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F5F3F7', 
        borderRadius: 15, 
        height: 30, 
        overflow: 'hidden'
    },
    stepperAction: { 
        width: 30,
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    stepperValueBox: {
        paddingHorizontal: 8,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepperValue: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: Colors.primary, 
        textAlign: 'center' 
    },
    productPrice: { 
        fontSize: 13, 
        fontWeight: 'bold', 
        color: '#1B041F',
        marginTop: 8,
        textAlign: 'center'
    },

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
    addMoreButton: { width: '100%', height: 48, backgroundColor: Colors.primary, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginVertical: 16 },
    addMoreButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
    instructionsContainer: { marginVertical: 8 },
    instructionsTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
    instructionsInput: { 
        width: '100%', 
        height: 72, 
        backgroundColor: '#F9FAFB', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#E5E7EB',
        padding: 12,
        fontSize: 14,
        color: '#1B041F',
        textAlignVertical: 'top'
    },
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
    savingsHighlightBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#DCFCE7', padding: 12, borderRadius: 8, marginVertical: 16, justifyContent: 'center' },
    savingsHighlightText: { fontSize: 13, color: '#16A34A', textAlign: 'center' },
    footerContainer: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFF' },
    placeOrderButton: { width: '100%', height: 54, backgroundColor: Colors.primary, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
    disabledButton: { backgroundColor: '#9CA3AF', opacity: 0.6 },
    placeOrderButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    securityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
    securityText: { fontSize: 12, color: '#6B7280' },
});
