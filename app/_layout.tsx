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

// Import your application's specific contextual state providers
import { AuthProvider, useAuth } from './auth/auth-provider';

SplashScreen.preventAutoHideAsync();

// Intermediate Navigator Component that manages view boundaries based on login state
function RootStackNavigation() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: 'slide_from_right', 
      gestureEnabled: true,          
      gestureDirection: 'horizontal' 
    }}>
      {isLoggedIn ? (
        // Stack tree segment exposed ONLY when authenticated
        // This isolates your application from hitting or popping into auth forms
        <Stack.Screen name="tabs" options={{ gestureEnabled: false }} />
      ) : (
        // Stack tree segment exposed ONLY when logged out
        <Stack.Screen name="login" options={{ gestureEnabled: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
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
    return null; 
  }

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <AuthProvider>
          <Suspense fallback={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" />
            </View>
          }>
            <RootStackNavigation />
          </Suspense>
        </AuthProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}