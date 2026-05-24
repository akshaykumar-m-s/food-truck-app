import { RestaurantCard } from '@/src/components/features/home/restaurant-card';
import { HomeSectionData, RestaurantData } from '@/src/components/features/home/types';
import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface HomeSectionProps extends Omit<HomeSectionData, 'restaurants'> {
  restaurants?: RestaurantData[];
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  subtitle,
  restaurants = [],
  showSponsored = false,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>{title}</AppText>
        {subtitle && (
          <AppText style={styles.sectionSubtitle}>
            {showSponsored && 'Sponsored | '}{subtitle}
          </AppText>
        )}
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.horizontalList}
        contentContainerStyle={styles.horizontalListContent}
      >
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))
        ) : (
          // Default placeholder cards if no restaurants provided
          <>
            <RestaurantCard />
            <RestaurantCard />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  sectionHeader: { marginTop: 20, marginBottom: 10, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  sectionSubtitle: { fontSize: 13, color: '#A1A1A1', marginTop: 2 },
  horizontalList: { marginBottom: 10 },
  horizontalListContent: { paddingHorizontal: 20 },
});