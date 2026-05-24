import { OngoingOrderData } from '@/src/components/features/home/types';
import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface FloatingOrderStatusProps extends OngoingOrderData {}

export const FloatingOrderStatus: React.FC<FloatingOrderStatusProps> = ({
  restaurantName,
  status,
  progressSteps = 4,
  activeSteps = 3,
}) => {
  return (
    <View style={styles.floatingStatus}>
      <View style={styles.statusLeft}>
        <View style={styles.statusDot} />
        <AppText style={styles.statusTitle}>{restaurantName}</AppText>
        <AppText style={styles.statusSubtitle}>• {status}</AppText>
      </View>
      <View style={styles.progressBar}>
        {Array.from({ length: progressSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index < activeSteps && styles.activeStep,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingStatus: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 5,
    shadowOpacity: 0.3,
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FACC15' },
  statusTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  statusSubtitle: { color: '#FFF', fontSize: 13, opacity: 0.8 },
  progressBar: { flexDirection: 'row', gap: 4 },
  progressStep: { width: 12, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  activeStep: { backgroundColor: '#4ADE80' },
});