import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppText } from '../src/components/forms/global-text';
import Colors from '../src/constants/colors';
import { useAuth } from './auth/auth-provider'; // 1. Import your auth context hook

export default function Index() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth(); // 2. Grab your authentic state parameters

  useEffect(() => {
    // Wait until the auth state has completed reading from SecureStore
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isLoggedIn) {
        // If an active session signature exists, route them straight onto the dashboard
        router.replace('/tabs/home');
      } else {
        // Otherwise, send them down the language selector onboarding flow
        router.replace('/auth/lets-go-language-selector');
      }
    }, 50); 

    return () => clearTimeout(timer);
  }, [isLoggedIn, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
      <ActivityIndicator size="large" color={Colors.primary} style={{ marginBottom: 16 }} />
      <AppText style={{ color: Colors.primary, fontWeight: '500' }}>
        {isLoggedIn ? 'Welcome back...' : 'Loading foodtrckr...'}
      </AppText>
    </View>
  );
}