import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: '#333',
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
});

const CartScreen: React.FC = () => {
    // Mock cart data - in real app this would come from context/state management
    const cartItems: CartItem[] = [
        {
            id: '1',
            name: 'Margherita Pizza',
            price: 25,
            quantity: 2,
        },
        {
            id: '2',
            name: 'Caesar Salad',
            price: 18,
            quantity: 1,
        },
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5;
    const total = subtotal + deliveryFee;

    const handleQuantityChange = (id: string, change: number) => {
        // In real app, this would update the cart state
        Alert.alert('Quantity Updated', `Item zł{id} quantity changed by zł{change}`);
    };

    const handleRemoveItem = (id: string) => {
        Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => {
                // In real app, this would remove from cart
                Alert.alert('Item Removed', `Item zł{id} removed from cart`);
            }},
        ]);
    };

    const handleCheckout = () => {
        Alert.alert('Checkout', 'Proceeding to checkout...');
        // router.push('/checkout'); // TODO: Create checkout screen
    };

    return (
        <SafeAreaView style={localStyles.container}>
            {/* Header */}
            <View style={localStyles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <AppText style={localStyles.headerTitle}>Your Cart</AppText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={localStyles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Cart Items */}
                {cartItems.map((item) => (
                    <View key={item.id} style={cartStyles.cartItem}>
                        <View style={cartStyles.itemImage}>
                            {/* Placeholder for image */}
                            <View style={cartStyles.imagePlaceholder}>
                                <Feather name="image" size={24} color="#ccc" />
                            </View>
                        </View>

                        <View style={cartStyles.itemDetails}>
                            <AppText style={cartStyles.itemName}>{item.name}</AppText>
                            <AppText style={cartStyles.itemPrice}>{item.price} PLN</AppText>

                            <View style={cartStyles.quantityControls}>
                                <TouchableOpacity
                                    style={cartStyles.quantityButton}
                                    onPress={() => handleQuantityChange(item.id, -1)}
                                >
                                    <Feather name="minus" size={16} color={Colors.primary} />
                                </TouchableOpacity>

                                <AppText style={cartStyles.quantityText}>{item.quantity}</AppText>

                                <TouchableOpacity
                                    style={cartStyles.quantityButton}
                                    onPress={() => handleQuantityChange(item.id, 1)}
                                >
                                    <Feather name="plus" size={16} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={cartStyles.removeButton}
                            onPress={() => handleRemoveItem(item.id)}
                        >
                            <Feather name="trash-2" size={20} color="#ff4444" />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Order Summary */}
                <View style={cartStyles.summaryContainer}>
                    <View style={cartStyles.summaryRow}>
                        <AppText style={cartStyles.summaryLabel}>Subtotal</AppText>
                        <AppText style={cartStyles.summaryValue}>{subtotal} PLN</AppText>
                    </View>

                    <View style={cartStyles.summaryRow}>
                        <AppText style={cartStyles.summaryLabel}>Delivery Fee</AppText>
                        <AppText style={cartStyles.summaryValue}>{deliveryFee} PLN</AppText>
                    </View>

                    <View style={[cartStyles.summaryRow, cartStyles.totalRow]}>
                        <AppText style={[cartStyles.summaryLabel, cartStyles.totalLabel]}>Total</AppText>
                        <AppText style={[cartStyles.summaryValue, cartStyles.totalValue]}>{total} PLN</AppText>
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={cartStyles.addressContainer}>
                    <AppText style={cartStyles.sectionTitle}>Delivery Address</AppText>
                    <TouchableOpacity style={cartStyles.addressCard}>
                        <Feather name="map-pin" size={20} color={Colors.primary} />
                        <View style={cartStyles.addressDetails}>
                            <AppText style={cartStyles.addressText}>Home</AppText>
                            <AppText style={cartStyles.addressSubtext}>123 Main St, Warsaw, Poland</AppText>
                        </View>
                        <Feather name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Payment Method */}
                <View style={cartStyles.paymentContainer}>
                    <AppText style={cartStyles.sectionTitle}>Payment Method</AppText>
                    <TouchableOpacity style={cartStyles.paymentCard}>
                        <Feather name="credit-card" size={20} color={Colors.primary} />
                        <View style={cartStyles.paymentDetails}>
                            <AppText style={cartStyles.paymentText}>**** **** **** 1234</AppText>
                            <AppText style={cartStyles.paymentSubtext}>Visa</AppText>
                        </View>
                        <Feather name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Checkout Button */}
            <View style={cartStyles.checkoutContainer}>
                <TouchableOpacity style={cartStyles.checkoutButton} onPress={handleCheckout}>
                    <AppText style={cartStyles.checkoutText}>Place Order - {total} PLN</AppText>
                    <Feather name="arrow-right" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const cartStyles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row' as const,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#333',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500' as const,
        marginBottom: 8,
    },
    quantityControls: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600' as const,
        marginHorizontal: 16,
        minWidth: 20,
        textAlign: 'center' as const,
    },
    removeButton: {
        padding: 8,
    },
    summaryContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 8,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
        marginTop: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: '#333',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#333',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.primary,
    },
    addressContainer: {
        marginBottom: 16,
    },
    paymentContainer: {
        marginBottom: 100,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#333',
        marginBottom: 12,
    },
    addressCard: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    addressDetails: {
        flex: 1,
        marginLeft: 12,
    },
    addressText: {
        fontSize: 16,
        fontWeight: '500' as const,
        color: '#333',
        marginBottom: 2,
    },
    addressSubtext: {
        fontSize: 12,
        color: '#666',
    },
    paymentCard: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    paymentDetails: {
        flex: 1,
        marginLeft: 12,
    },
    paymentText: {
        fontSize: 16,
        fontWeight: '500' as const,
        color: '#333',
        marginBottom: 2,
    },
    paymentSubtext: {
        fontSize: 12,
        color: '#666',
    },
    checkoutContainer: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    checkoutButton: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600' as const,
        marginRight: 8,
    },
});

export default CartScreen;