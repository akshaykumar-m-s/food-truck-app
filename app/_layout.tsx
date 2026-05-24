import { useFonts } from '@expo-google-fonts/inter';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import React, { Suspense, useEffect } from "react";
import { I18nextProvider } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n';
import i18n from '../i18n';
import '../src/components/forms/global-text';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'Manrope_400Regular': require('../assets/fonts/Manrope-Regular.ttf'),
    'Manrope_500Medium': require('../assets/fonts/Manrope-Medium.ttf'),
    'Manrope_600SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope_700Bold': require('../assets/fonts/Manrope-Bold.ttf'),
  });

  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // or a proper splash/loading screen
  }

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        {/* Suspense handles the "ready" state for all child routes automatically */}
        <Suspense fallback={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }>
          <Stack screenOptions={{
            headerShown: false,
            animation: 'slide_from_right', // Ensures standard horizontal transition
            gestureEnabled: true,          // Enables the swipe-back gesture
            gestureDirection: 'horizontal' // Explicitly sets the swipe axis
          }} />
        </Suspense>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
