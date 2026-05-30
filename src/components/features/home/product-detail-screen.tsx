import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/src/components/common/back-button';
import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { cartManager } from '@/src/services/cart-manager';

// Configurable Mock Dataset supporting Multi-Select & Single-Select forms
const ALLERGENS = [
  { id: '1', name: 'Seler', icon: 'sprout' },
  { id: '2', name: 'Jajka', icon: 'egg-outline' },
  { id: '3', name: 'Mleko', icon: 'bottle-wine-outline' },
];

const CUSTOMIZATION_SECTIONS = [
  {
    id: 'sauces',
    title: 'Choose your sauce (Select One)',
    isMultiSelect: false,
    options: [
      { id: 'tartar', name: 'Tartar Sauce', price: 2.0 },
      { id: 'garlic', name: 'Garlic Sauce', price: 2.0 },
      { id: 'ketchup', name: 'Ketchup', price: 2.0 },
    ]
  },
  {
    id: 'toppings',
    title: 'Extra toppings (Multi-Select Optional)',
    isMultiSelect: true,
    options: [
      { id: 'extra_cheese', name: 'Extra Cheese', price: 3.50 },
      { id: 'grilled_onions', name: 'Grilled Onions', price: 1.50 },
    ]
  }
];

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  
  // State definitions handling scaling quantities and composite selections
  const [quantity, setQuantity] = useState(1);
  const [singleSelections, setSingleSelections] = useState<{ [key: string]: string }>({ sauces: 'tartar' });
  const [multiSelections, setMultiSelections] = useState<{ [key: string]: boolean }>({});
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const productName = String(params.name || 'Fish & Chips');
  const productDescription = String(
    params.description ||
      'Description of an item. It may contain extra information. More sentences about the ingredients, preparation details, and history of the dish can go right here.',
  );
  const productImage = String(params.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2');
  const productPriceLabel = String(params.price || '22,32 zł');
  const productRating = String(params.rating || '4.7 (128)');
  const productPromo = String(params.promo || '20% OFF');
  const isVegan = String(params.vegan || 'true') === 'true'; 
  const spiceLevel = Number(params.spice || 1);
  const priceMatch = productPriceLabel.replace(',', '.').match(/\d+(\.\d+)?/);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleOptionPress = (sectionId: string, optionId: string, isMulti: boolean) => {
    if (isMulti) {
      setMultiSelections(prev => ({ ...prev, [optionId]: !prev[optionId] }));
    } else {
      setSingleSelections(prev => ({ ...prev, [sectionId]: optionId }));
    }
  };

  const handleAddToOrder = () => {
    const baseId = String(params.id || 'undefined');
    
    // 1. Build out the readable customization text dynamically based on current selections
    const selectedSauceObj = CUSTOMIZATION_SECTIONS[0].options.find(
      o => o.id === singleSelections.sauces
    );
    
    const activeToppings = CUSTOMIZATION_SECTIONS[1].options
      .filter(o => multiSelections[o.id])
      .map(o => `• ${o.name} (${o.price.toFixed(2).replace('.', ',')} zł)`);

    let customizationLines: string[] = [];
    if (selectedSauceObj) {
      customizationLines.push(`Sauce: ${selectedSauceObj.name}`);
    }
    if (activeToppings.length > 0) {
      customizationLines.push('Toppings:');
      customizationLines.push(...activeToppings);
    }
    
    const finalizedSubtext = customizationLines.join('\n');

    // 2. Create a unique key for this combination so identical items with different sauces don't overwrite each other
    const uniqueInstanceKey = `${baseId}_${singleSelections.sauces}_${Object.keys(multiSelections).filter(k => multiSelections[k]).join('-')}`;

    // 3. Save the item, its calculated item price, and the custom text directly into the cart manager
    const unitPrice = baseItemPrice + totalAddonPrice;
    
    cartManager.addConfiguredItem(
      uniqueInstanceKey,
      productName,
      unitPrice,
      quantity,
      finalizedSubtext || undefined
    );
    
    router.back();
  };

  // Compute exact costs based on core items and any combined active dynamic selections
  const baseItemPrice = priceMatch ? Number(priceMatch[0]) : 22.32;
  const originalItemPrice = baseItemPrice * 1.25;
  const itemSavings = originalItemPrice - baseItemPrice;

  const totalAddonPrice = useMemo(() => {
    let addonSum = 0;
    CUSTOMIZATION_SECTIONS.forEach(section => {
      section.options.forEach(option => {
        if (section.isMultiSelect) {
          if (multiSelections[option.id]) addonSum += option.price;
        } else {
          if (singleSelections[section.id] === option.id) addonSum += option.price;
        }
      });
    });
    return addonSum;
  }, [singleSelections, multiSelections]);

  const computedTotalPrice = ((baseItemPrice + totalAddonPrice) * quantity).toFixed(2);
  const formatPrice = (amount: number) => `${amount.toFixed(2).replace('.', ',')} zł`;
  
  // Dynamic scaling bounds based on system metrics
  const heroHeight = Math.min(300, Math.max(220, height * 0.28));
  const isCompact = width < 380;

  return (
    <View style={styles.container}>
      {/* Top Header Bar Layer */}
      <View style={[styles.headerBar, { height: insets.top + 52, paddingTop: insets.top }]}>
        <BackButton color={Colors.primary} style={styles.headerBackButton} />
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Feather name="share-2" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Feather name="heart" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Product Image Banner */}
        <ImageBackground source={{ uri: productImage }} style={[styles.heroImage, { height: heroHeight }]}>
          <View style={styles.heroOverlay}>
            {productPromo ? (
              <View style={styles.discountBadge}>
                <MaterialCommunityIcons name="flash" size={11} color="#FFF" />
                <AppText style={styles.discountText}>{productPromo}</AppText>
              </View>
            ) : null}

            <View style={styles.popularBadge}>
              <Feather name="star" size={13} color={Colors.primary} />
              <View style={styles.popularTextWrapper}>
                <AppText style={styles.ratingText}>{productRating}</AppText>
                <AppText style={styles.popularSubtext}>Popular</AppText>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Product Heading Slat Section */}
<View style={styles.contentBody}>
  <View style={styles.titleRow}>
    
    {/* Left Column Container: Holds everything that needs to align to the left edge */}
    <View style={styles.leftInfoColumn}>
      
      {/* Product Title */}
      <AppText style={styles.productTitle}>{productName}</AppText>

      {/* Diets and Preferences Meta Tags Row - Nested inside left column for perfect alignment */}
      <View style={styles.prefTagRow}>
        {(isVegan || true) && (
          <View style={styles.prefTag}>
            <MaterialCommunityIcons name="leaf" size={14} color="#10B981" />
            <AppText style={styles.prefTagText}>Vegetarian</AppText>
          </View>
        )}
        {(spiceLevel > 0 || true) && (
          <View style={styles.prefTag}>
            <MaterialCommunityIcons name="fire" size={14} color="#F97316" />
            <AppText style={styles.prefTagText}>Hot</AppText>
          </View>
        )}
      </View>
      
    </View>

    {/* Right Column Container: Pricing Stack */}
    <View style={styles.priceColumn}>
      <AppText style={styles.activePrice}>{productPriceLabel}</AppText>
      <AppText style={styles.originalPrice}>{formatPrice(originalItemPrice)}</AppText>
      <View style={styles.savingsMicroBadge}>
        <MaterialCommunityIcons name="check-circle" size={11} color="#16A34A" style={styles.checkIcon} />
        <AppText style={styles.savingsMicroText}>You Save {formatPrice(itemSavings)}</AppText>
      </View>
    </View>

  </View>

  {/* Collapsible Content Description Text Block */}
  <View style={styles.descriptionBlock}>
    <AppText style={styles.descriptionText} numberOfLines={isDescriptionExpanded ? undefined : 2}>
      {productDescription}
    </AppText>
    <TouchableOpacity onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)} style={styles.readMoreBtn}>
      <AppText style={styles.readMoreText}>{isDescriptionExpanded ? 'Read less ▲' : 'Read more ▼'}</AppText>
    </TouchableOpacity>
  </View>

          {/* Grid Metric Information Highlights */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Feather name="clock" size={16} color="#10B981" />
              <View style={styles.metricTexts}>
                <AppText style={styles.metricLabel}>Prep time</AppText>
                <AppText style={styles.metricValue}>8-10 min</AppText>
              </View>
            </View>
            <View style={styles.metricItem}>
              <Feather name="trending-up" size={16} color="#10B981" />
              <View style={styles.metricTexts}>
                <AppText style={styles.metricLabel}>Popular</AppText>
                <AppText style={styles.metricValue}>#2 Best Seller</AppText>
              </View>
            </View>
            <View style={styles.metricItem}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={16} color="#10B981" />
              <View style={styles.metricTexts}>
                <AppText style={styles.metricLabel}>Serves</AppText>
                <AppText style={styles.metricValue}>1 Person</AppText>
              </View>
            </View>
          </View>

          {/* Allergens Selection Segment */}
          <AppText style={styles.sectionHeaderTitle}>Alergenes:</AppText>
          <View style={styles.allergensRow}>
            {ALLERGENS.map(item => (
              <View key={item.id} style={styles.allergenChip}>
                <MaterialCommunityIcons name={item.icon as any} size={14} color={Colors.primary} />
                <AppText style={styles.allergenChipText}>{item.name}</AppText>
              </View>
            ))}
          </View>

          {/* Custom Customization Option Mapping (Handles both Radio and Checkbox Layouts) */}
          {CUSTOMIZATION_SECTIONS.map(section => {
            const isMulti = section.isMultiSelect;
            return (
              <View key={section.id} style={styles.customizationBlock}>
                <View style={styles.customizeHeaderBar}>
                  <AppText style={styles.customizeHeaderText}>{section.title}</AppText>
                </View>

                {section.options.map(option => {
                  const isSelected = isMulti ? !!multiSelections[option.id] : singleSelections[section.id] === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={styles.optionRow}
                      onPress={() => handleOptionPress(section.id, option.id, isMulti)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionLeft}>
                        {/* Dynamic Shape Selector Representation based on select configuration type */}
                        <View style={[
                          styles.selectorFrame, 
                          isMulti ? styles.checkboxShape : styles.radioShape,
                          isSelected && styles.selectorActiveBackground
                        ]}>
                          {isSelected && (
                            isMulti ? (
                              <Feather name="check" size={11} color="#FFF" />
                            ) : (
                              <View style={styles.innerRadioPoint} />
                            )
                          )}
                        </View>
                        <AppText style={[styles.optionNameText, isSelected && styles.boldOptionText]}>
                          {option.name}
                        </AppText>
                      </View>
                      <AppText style={styles.optionPriceText}>+{option.price.toFixed(2).replace('.', ',')} zł</AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}

          {/* Recommended Carousel Sub-segment */}
          <AppText style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>You may also like</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendScroll}>
            <RecommendationCard name="Calamari Rings" price="24,90 zł" />
            <RecommendationCard name="Onion Rings" price="24,90 zł" />
            <RecommendationCard name="Cabbage Pakoda" price="24,90 zł" />
          </ScrollView>

        </View>
      </ScrollView>

      {/* Persistent Bottom Action Bar */}
      <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 12), height: 64 + Math.max(insets.bottom, 12) }]}>
        <View style={styles.stepperInterface}>
          <TouchableOpacity onPress={handleDecrement} style={styles.stepperActionTouch}>
            <Feather name="minus" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.stepperValueBox}>
            <AppText style={styles.stepperValueText}>{quantity}</AppText>
          </View>
          <TouchableOpacity onPress={handleIncrement} style={styles.stepperActionTouch}>
            <Feather name="plus" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToOrderBtn} activeOpacity={0.9} onPress={handleAddToOrder}>
          <AppText style={styles.addToOrderText}>Add to order</AppText>
          <AppText style={styles.addToOrderPrice}>{computedTotalPrice.replace('.', ',')} zł</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const RecommendationCard = ({ name, price }: { name: string; price: string }) => (
  <View style={styles.recCard}>
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641' }} 
      style={styles.recImage}
      imageStyle={{ borderRadius: 8 }}
    />
    <AppText style={styles.recName} numberOfLines={1}>{name}</AppText>
    <AppText style={styles.recPrice}>{price}</AppText>
    <TouchableOpacity style={styles.recAddBtn}>
      <Feather name="plus" size={10} color="#FFF" />
      <AppText style={styles.recAddText}>ADD</AppText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingBottom: 140 },
  headerBar: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  headerBackButton: { width: 40, height: 40, marginBottom: 0, alignItems: 'flex-start', backgroundColor: 'transparent' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  
  // Hero Section
  heroImage: { width: '100%', overflow: 'hidden' },
  heroOverlay: { flex: 1 },
  discountBadge: { position: 'absolute', top: 12, left: 16, backgroundColor: '#FF0032', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  discountText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  popularBadge: { position: 'absolute', bottom: 12, right: 16, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  popularTextWrapper: { alignItems: 'flex-start' },
  ratingText: { fontSize: 11, fontWeight: 'bold', color: Colors.primary },
  popularSubtext: { fontSize: 9, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' },

  // Header Content Layout Realignment
  contentBody: { paddingHorizontal: 24, paddingTop: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' },
  titleContainer: { flex: 1, marginRight: 12 },
  productTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, lineHeight: 30, textAlign: 'left' },
  priceColumn: { alignItems: 'flex-end', minWidth: 100, paddingTop: 2 },
  activePrice: { fontSize: 22, fontWeight: 'bold', color: '#16A34A', lineHeight: 28 },
  originalPrice: { fontSize: 14, color: '#FF0032', textDecorationLine: 'line-through', marginTop: 2, fontWeight: '500' },
  savingsMicroBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginTop: 6, flexDirection: 'row', alignItems: 'center' },
  checkIcon: { marginRight: 3 },
  savingsMicroText: { color: '#16A34A', fontSize: 10, fontWeight: 'bold' },
  
  leftInfoColumn: {
    flex: 1,
    alignItems: 'flex-start', // Forces all children to lock to the left edge
    marginRight: 12,
  },

  // Preference Subtags Layout
  prefTagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 16, alignSelf: 'flex-start' },
  prefTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  prefTagText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  
  // Descriptions
  descriptionBlock: { marginTop: 14 },
  descriptionText: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  readMoreBtn: { marginTop: 4 },
  readMoreText: { fontSize: 13, fontWeight: 'bold', color: Colors.primary },
  
  // Metrics Grid
  metricsBar: { flexDirection: 'row', backgroundColor: '#F0FDF4', borderRadius: 12, padding: 12, marginTop: 16, justifyContent: 'space-between' },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  metricTexts: { alignItems: 'flex-start' },
  metricLabel: { fontSize: 9, color: '#6B7280' },
  metricValue: { fontSize: 11, fontWeight: 'bold', color: Colors.primary },
  
  // Allergens Component Box
  sectionHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 10, marginTop: 16 },
  allergensRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  allergenChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  allergenChipText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  
  // Multi/Single Custom Selection Rows
  customizationBlock: { marginTop: 12 },
  customizeHeaderBar: { backgroundColor: '#DCFCE7', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginBottom: 4 },
  customizeHeaderText: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  
  // Selector Geometric Form Parameters
  selectorFrame: { width: 18, height: 18, borderWidth: 2, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  radioShape: { borderRadius: 9 },
  checkboxShape: { borderRadius: 4 },
  selectorActiveBackground: { backgroundColor: Colors.primary },
  innerRadioPoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' },
  optionNameText: { fontSize: 14, color: '#4B5563' },
  boldOptionText: { fontWeight: '600', color: Colors.primary },
  optionPriceText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  
  // Recommendation Carousel
  recommendScroll: { flexDirection: 'row', marginTop: 4 },
  recCard: { width: 105, marginRight: 12, backgroundColor: '#FFF', borderRadius: 8, padding: 6, borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center' },
  recImage: { width: 90, height: 60, marginBottom: 6 },
  recName: { fontSize: 11, fontWeight: '600', color: Colors.primary, width: '100%' },
  recPrice: { fontSize: 10, color: '#6B7280', marginBottom: 6, width: '100%' },
  recAddBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, width: '100%', justifyContent: 'center' },
  recAddText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },

  // Bottom Interface Controls
  bottomActionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between' },
  stepperInterface: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 28, height: 56, backgroundColor: '#FFF', width: 110, justifyContent: 'space-between', paddingHorizontal: 6 },
  stepperActionTouch: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  stepperValueBox: { justifyContent: 'center', alignItems: 'center' },
  stepperValueText: { fontSize: 15, fontWeight: 'bold', color: Colors.primary },
  addToOrderBtn: { 
    width: 194, 
    height: 56, 
    backgroundColor: '#76E49D', 
    borderRadius: 28, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20 
  },
  addToOrderText: { color: Colors.primary, fontSize: 15, fontWeight: 'bold' },
  addToOrderPrice: { color: Colors.primary, fontSize: 15, fontWeight: 'bold' },
});