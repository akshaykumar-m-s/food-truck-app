import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data for Categories and Items
const CATEGORIES = ['Starter', 'Main', 'Salad', 'Drinks', 'Dessert'];
const MENU_ITEMS = [
  {
    id: 1,
    name: 'Masala Dosa',
    price: '33 PLN',
    rating: '80 (96)',
    vegan: true,
    spice: 3,
    promo: 'Buy 1 Get 1 Free',
    promoColor: '#E11D48',
    description: 'Crispy rice-lentil crepe with spiced potato masala, served with chutney and sambar.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0',
  },
  {
    id: 2,
    name: 'Paneer Tikka',
    price: '36 PLN',
    rating: '85 (120)',
    vegan: false,
    spice: 2,
    promo: undefined,
    promoColor: '#F59E0B',
    description: 'Smoky grilled cottage cheese marinated in chef’s special spices.',
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088',
  },
  {
    id: 3,
    name: 'Spicy Vegetable Curry',
    price: '29 PLN',
    rating: '78 (89)',
    vegan: true,
    spice: 3,
    promo: 'Count towards free item',
    promoColor: '#F59E0B',
    description: 'Rich vegetable curry simmered in a fragrant spicy tomato gravy.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  },
];

export const RestaurantScreen: React.FC = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Starter');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const handleIncrement = (id: number) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id: number) => {
    setQuantities(prev => {
      const currentQty = prev[id] || 0;
      if (currentQty <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: currentQty - 1 };
    });
  };

  // Memoized count tracking sum across all unique active quantities
  const totalCartCount = useMemo(() => {
    return Object.values(quantities).reduce((sum, val) => sum + val, 0);
  }, [quantities]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero Header Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' }}
          style={styles.heroImage}
        >
          <SafeAreaView edges={['top']} style={styles.heroOverlay}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
                <Feather name="arrow-left" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <Feather name="heart" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroPillsContainer}>
              <TouchableOpacity style={styles.heroPill}>
                <Feather name="truck" size={12} color="#FFF" />
                <AppText style={styles.pillText}>Invite Foodtruck</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.heroPill, styles.whitePill]}>
                <Feather name="users" size={12} color={Colors.primary} />
                <AppText style={styles.pillTextDark}>Group Order</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.heroPill, styles.whitePill]}>
                <Feather name="user-plus" size={12} color={Colors.primary} />
                <AppText style={styles.pillTextDark}>Follow Us</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.heroPill, styles.whitePill]}>
                <Feather name="info" size={12} color={Colors.primary} />
                <AppText style={styles.pillTextDark}>About</AppText>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* Restaurant Details Text Block */}
        <View style={styles.detailsSection}>
          <AppText style={styles.restaurantName}>Saravana Dosa & Curry</AppText>

          <View style={styles.tagRow}>
            <View style={styles.tag}><Feather name="star" size={10} color={Colors.primary} /><AppText style={styles.tagText}>4.7</AppText></View>
            <View style={styles.tag}><AppText style={styles.tagText}>Indian</AppText></View>
            <View style={styles.tag}><Feather name="zap" size={10} color={Colors.primary} /><AppText style={styles.tagText}>10 Min Pickup</AppText></View>
            <View style={styles.tag}><AppText style={styles.tagText}>17 PLN to 34 PLN</AppText></View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}><Feather name="clock" size={10} color={Colors.primary} /><AppText style={styles.tagText}>Open Until : 2 am</AppText></View>
            <View style={styles.tag}><Feather name="map-pin" size={10} color={Colors.primary} /><AppText style={styles.tagText}>0.6 km</AppText></View>
            <View style={styles.tag}><Feather name="shield" size={10} color={Colors.primary} /><AppText style={styles.tagText}>No Hidden Charges</AppText></View>
          </View>

          {/* Special Promotional Offers Banner Card */}
          <View style={styles.offerBanner}>
            <MaterialCommunityIcons name="gift-outline" size={32} color="#EAB308" />
            <View style={styles.offerTextContainer}>
              <AppText style={styles.offerTitle}>Todays Offer!</AppText>
              <AppText style={styles.offerSubtitle}>Buy 3 Get 1 Free</AppText>
            </View>
            <TouchableOpacity style={styles.viewItemsBtn}>
              <AppText style={styles.viewItemsText}>View Items</AppText>
            </TouchableOpacity>
          </View>

          {/* Section: Ready in 10 Minutes */}
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Ready in 10 Minutes</AppText>
            <AppText style={styles.sectionSubtitle}>Just try this out, you will like it!</AppText>
          </View>

          {/* Horizontal Swiper Cards Container */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {MENU_ITEMS.slice(0, 2).map((item) => (
              <HorizontalMenuCard
                key={item.id}
                item={item}
                quantity={quantities[item.id] || 0}
                onIncrement={() => handleIncrement(item.id)}
                onDecrement={() => handleDecrement(item.id)}
              />
            ))}
          </ScrollView>

          {/* Filters Subheader: Category Selection Pills Tab Layout */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.chip, activeCategory === cat && styles.activeChip]}
              >
                <AppText style={[styles.chipText, activeCategory === cat && styles.activeChipText]}>{cat}</AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Section: Picked For You List */}
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Picked for you!</AppText>
            <AppText style={styles.sectionSubtitle}>Just try this out, you will like it</AppText>
          </View>

          {/* Vertical Menu Cards Render Stack */}
          {MENU_ITEMS.map((item) => (
            <VerticalMenuCard
              key={item.id}
              item={item}
              quantity={quantities[item.id] || 0}
              onIncrement={() => handleIncrement(item.id)}
              onDecrement={() => handleDecrement(item.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Bars Stack Context: View Cart takes layout precedence when populated */}
      {totalCartCount > 0 ? (
        <TouchableOpacity style={styles.viewCartBar} activeOpacity={0.95} onPress={() => router.push('/cart-screen')}>
          <View style={styles.viewCartLeft}>
            <Feather name="shopping-cart" size={22} color="#FFF" />
            <AppText style={styles.viewCartTitle}>View Cart</AppText>
          </View>
          <View style={styles.viewCartRight}>
            <View style={styles.cartCountBadge}>
              <AppText style={styles.cartCountText}>{totalCartCount}</AppText>
            </View>
            <Feather name="arrow-right" size={22} color="#FFF" />
          </View>
        </TouchableOpacity>
      ) : null /* Placeholder for potential secondary action button when cart is empty, e.g. "Start Order" */ }
    </View>
  );
}

// Fixed sizing stepper to clear component dimensional jitter
const StepperCounter = ({ count, onPlus, onMinus }: { count: number; onPlus: () => void; onMinus: () => void }) => (
  <View style={styles.stepperContainer}>
    <TouchableOpacity onPress={onMinus} style={styles.stepperButton} activeOpacity={0.7}>
      <Feather name="minus" size={12} color="#FFF" />
    </TouchableOpacity>
    <View style={styles.stepperTextBox}>
      <AppText style={styles.stepperText}>{count}</AppText>
    </View>
    <TouchableOpacity onPress={onPlus} style={styles.stepperButton} activeOpacity={0.7}>
      <Feather name="plus" size={12} color="#FFF" />
    </TouchableOpacity>
  </View>
);

// Horizontal Card View
const HorizontalMenuCard = ({ item, quantity, onIncrement, onDecrement }: any) => (
  <View style={styles.hCard}>
    <Image source={{ uri: item.image }} style={styles.hCardImage} />
    <View style={styles.hCardContent}>
      <AppText style={styles.itemName}>{item.name}</AppText>

      <View style={styles.metaRow}>
        <View style={styles.metaIcons}>
          {item.vegan && (
            <MaterialCommunityIcons name="leaf" size={12} color="#10B981" style={styles.veganIcon} />
          )}
          {Array.from({ length: item.spice }).map((_, idx) => (
            <MaterialCommunityIcons key={idx} name="fire" size={12} color="#F97316" style={styles.spiceIcon} />
          ))}
        </View>

        {item.promo && (
          <View style={[styles.promoBadge, { backgroundColor: item.promoColor }]}>
            <Feather name="zap" size={10} color="#FFF" />
            <AppText style={styles.promoText}>{item.promo}</AppText>
          </View>
        )}
      </View>

      <AppText style={styles.itemDescription} numberOfLines={2}>{item.description}</AppText>

      <View style={styles.hCardStats}>
        <Feather name="thumbs-up" size={12} color={Colors.primary} />
        <AppText style={styles.statText}>{item.rating}</AppText>
        <AppText style={styles.priceText}>{item.price}</AppText>

        <View style={styles.actionBtnFixedBound}>
          {quantity > 0 ? (
            <StepperCounter count={quantity} onPlus={onIncrement} onMinus={onDecrement} />
          ) : (
            <TouchableOpacity style={styles.addBtn} onPress={onIncrement} activeOpacity={0.8}>
              <Feather name="plus" size={12} color="#FFF" />
              <AppText style={styles.addBtnText}>ADD</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  </View>
);

// Vertical Card Row View
const VerticalMenuCard = ({ item, quantity, onIncrement, onDecrement }: any) => (
  <View style={styles.vCard}>
    <Image source={{ uri: item.image }} style={styles.vCardImage} />
    <View style={styles.vCardContent}>
      <AppText style={styles.itemName}>{item.name}</AppText>

      <View style={styles.promoRow}>
        <View style={styles.metaIconsContainer}>
          {item.vegan && (
            <MaterialCommunityIcons name="leaf" size={12} color="#10B981" style={styles.vCardLeaf} />
          )}
          {Array.from({ length: item.spice }).map((_, idx) => (
            <MaterialCommunityIcons key={idx} name="fire" size={12} color="#F97316" style={styles.vCardFire} />
          ))}
        </View>
        {item.promo && (
          <View style={[styles.promoBadge, { backgroundColor: item.promoColor }]}>
            <Feather name="zap" size={8} color="#FFF" />
            <AppText style={styles.promoText}>{item.promo}</AppText>
          </View>
        )}
      </View>

      <AppText style={styles.itemDesc} numberOfLines={2}>{item.description}</AppText>

      <View style={styles.vCardFooter}>
        <Feather name="thumbs-up" size={10} color={Colors.primary} />
        <AppText style={styles.statText}>{item.rating}</AppText>
        <AppText style={styles.priceTextCenter}>{item.price}</AppText>

        <View style={styles.actionBtnFixedBound}>
          {quantity > 0 ? (
            <StepperCounter count={quantity} onPlus={onIncrement} onMinus={onDecrement} />
          ) : (
            <TouchableOpacity style={styles.addBtn} onPress={onIncrement} activeOpacity={0.8}>
              <Feather name="plus" size={12} color="#FFF" />
              <AppText style={styles.addBtnText}>ADD</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingBottom: 140 },
  heroImage: { width: '100%', height: 260 },
  heroOverlay: { flex: 1, paddingHorizontal: 16, justifyContent: 'space-between', paddingBottom: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  heroPillsContainer: { flexDirection: 'row', gap: 4, justifyContent: 'center' },
  heroPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  whitePill: { backgroundColor: '#FFF' },
  pillText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  pillTextDark: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
  detailsSection: { paddingHorizontal: 16, paddingTop: 16 },
  restaurantName: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 12 },
  tagRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#D1C6E1' },
  tagText: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  offerBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9C4', padding: 12, borderRadius: 12, marginVertical: 16, borderLeftWidth: 4, borderLeftColor: '#FACC15' },
  offerTextContainer: { flex: 1, marginLeft: 12 },
  offerTitle: { fontSize: 16, fontWeight: 'bold', color: '#854D0E' },
  offerSubtitle: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  viewItemsBtn: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  viewItemsText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  horizontalList: { marginBottom: 16 },
  hCard: { width: 220, marginRight: 12, borderRadius: 12, backgroundColor: '#F8F8F8', overflow: 'hidden' },
  hCardImage: { width: '100%', height: 110 },
  hCardContent: { padding: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, justifyContent: 'space-between' },
  metaIcons: { flexDirection: 'row', alignItems: 'center' },
  veganIcon: { marginRight: 4 },
  spiceIcon: { marginRight: 2 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  itemDescription: { fontSize: 11, color: '#6B7280', lineHeight: 16, marginTop: 4, marginBottom: 8 },
  hCardStats: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statText: { fontSize: 11, color: '#4B5563', marginLeft: 4, flex: 1 },
  priceText: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginRight: 8 },
  vCard: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  vCardImage: { width: 90, height: 90, borderRadius: 12 },
  vCardContent: { flex: 1, marginLeft: 12 },
  vCardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priceTextCenter: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, flex: 1, textAlign: 'center' },
  promoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4, justifyContent: 'space-between' },
  metaIconsContainer: { flexDirection: 'row', alignItems: 'center' },
  vCardLeaf: { marginRight: 6 },
  vCardFire: { marginRight: 2 },
  promoBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  promoText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  itemDesc: { fontSize: 11, color: '#999', lineHeight: 15 },
  sectionHeader: { marginVertical: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  sectionSubtitle: { fontSize: 12, color: '#999' },
  chipsContainer: { marginVertical: 12 },
  chip: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, backgroundColor: '#EBEBEB', marginRight: 10 },
  activeChip: { backgroundColor: Colors.primary },
  chipText: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  activeChipText: { color: '#FFF' },

  // Strict Sizing Layout bounding box parameters to secure seamless state transition
  actionBtnFixedBound: {
    width: 85,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  addBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  stepperButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  stepperTextBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Manrope-Bold',
  },

  // View Cart Floating Layout Configuration
  viewCartBar: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',       // Centers the component container perfectly horizontally
    width: 349,                // Requested explicit design width
    height: 56,                // Requested explicit design height
    backgroundColor: Colors.primary,
    borderRadius: 28,          // Perfect pill shape calculation for 56px height
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',  // Centers content cluster cleanly inside the container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  viewCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewCartTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Manrope-Bold',
    marginRight: 6,
  },
  viewCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartCountBadge: {
    backgroundColor: '#86EFAC', // Light mint green matched from design
    borderRadius: 12,
    height: 24,
    minWidth: 24,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Manrope-Bold',
  },
});

export default RestaurantScreen;