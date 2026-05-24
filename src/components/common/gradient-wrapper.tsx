import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GradientWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GradientWrapper: React.FC<GradientWrapperProps> = ({ children, style }) => {
  return (
    <LinearGradient
      colors={['#40024A', '#310039']}
      style={[styles.container, style]}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
});

export default GradientWrapper;