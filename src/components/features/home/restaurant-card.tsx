import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export const RestaurantCard = () => {
    const router = useRouter();

    const handlePress = () => {
        // Navigate to restaurant screen
        router.push('/restaurant-screen');
    };

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handlePress}>
            {/* Image Container */}
            <View style={styles.imageWrapper}>
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0' }} // Using local asset
                    style={styles.image} 
                    resizeMode="cover"
                />
                {/* Promo Badge */}
                <View style={styles.promoBadge}>
                    <Feather name="zap" size={10} color="#FFF" />
                    <AppText style={styles.promoText}>Buy 1 Get 1 Free</AppText>
                </View>
                {/* Rating Badge */}
                <View style={styles.ratingBadge}>
                    <Feather name="star" size={10} color="#FFF" />
                    <AppText style={styles.ratingText}>4.7</AppText>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <AppText style={styles.resName} numberOfLines={1}>Saravana's Curry & Dosa</AppText>
                    <Feather name="heart" size={18} color={Colors.primary} />
                </View>
                
                <View style={styles.infoRow}>
                    <Feather name="map-pin" size={12} color="#666" />
                    <AppText style={styles.infoText}>0.6 km</AppText>
                    <Feather name="zap" size={12} color="#666" style={{marginLeft: 8}} />
                    <AppText style={styles.infoText}>Ready in 10 min</AppText>
                    <Feather name="info" size={12} color="#666" style={{marginLeft: 8}} />
                    <AppText style={styles.infoText}>No hidden charges</AppText>
                </View>

                <View style={styles.timeRow}>
                    <Feather name="clock" size={12} color="#666" />
                    <AppText style={styles.timeText}>Open Until : 2 am</AppText>
                    <AppText style={styles.priceText}> 17 PLN to 34 PLN</AppText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { width: 240, marginRight: 15, backgroundColor: '#FFF', borderRadius: 15 },
    imageWrapper: { width: '100%', height: 140, borderRadius: 15, overflow: 'hidden' },
    image: { width: '100%', height: '100%' },
    promoBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#E11D48', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, gap: 4 },
    promoText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    ratingBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#34D399', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, gap: 4 },
    ratingText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    content: { paddingVertical: 10 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    resName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, flex: 1, marginRight: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    infoText: { fontSize: 10, color: '#666', marginLeft: 2 },
    timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    timeText: { fontSize: 10, color: '#666', marginLeft: 4 },
    priceText: { fontSize: 10, fontWeight: 'bold', color: '#10B981' }
});