import GradientWrapper from '@/src/components/common/gradient-wrapper';
import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { auth } from '@/src/firebase';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Linking, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = 'https://your-server-url.com';

function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  const IOS_GOOGLE_CLIENT_ID = '38982039206-u00krp4145kaqmn5iroeqqa3ftobceg6.apps.googleusercontent.com';
  const WEB_GOOGLE_CLIENT_ID = '38982039206-1o2to0b758830jh3dm9okokkirpab3uk.apps.googleusercontent.com'; // Replace this with your Google Cloud Web OAuth client ID for Expo Go / browser proxy
  const EXPO_PROXY_REDIRECT_URI = 'https://auth.expo.io/@akshaykumar-ms/food-truck-app';

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: isExpoGo ? WEB_GOOGLE_CLIENT_ID : undefined,
      iosClientId: !isExpoGo ? IOS_GOOGLE_CLIENT_ID : undefined,
      webClientId: WEB_GOOGLE_CLIENT_ID,
      responseType: 'id_token',
      redirectUri: isExpoGo ? EXPO_PROXY_REDIRECT_URI : undefined,
      scopes: ['openid', 'profile', 'email'],
      extraParams: { prompt: 'select_account' },
    }
  );

  useEffect(() => {
    if (response && response.type === 'success') {
      const successResponse = response as any;
      const idToken = successResponse.authentication?.idToken ?? successResponse.params?.id_token;
      if (idToken) {
        handleGoogleFirebaseSignIn(idToken, successResponse.authentication?.accessToken);
      }
    }
  }, [response]);

  const showError = (message: string) => {
    setIsLoading(false);
    Alert.alert('Sign-In Error', message);
  };

  const createUserUsingFirebase = async (payload: {
    displayName?: string;
    email: string;
    emailVerified: boolean;
    uid: string;
    verificationToken: string;
    deviceId: string;
    provider: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/v1/auth/create_user_firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        app: 'Food Trckr',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Server error: ${response.status} ${responseText}`);
    }

    return response.json();
  };

  const signInWithFirebaseUser = async (
    provider: 'google' | 'apple',
    user: any,
    firebaseToken: string
  ) => {
    if (!user?.email) {
      throw new Error('Unable to read email from the authentication provider.');
    }

    const userPayload = {
      displayName: user.displayName || '',
      email: user.email,
      emailVerified: !!user.emailVerified,
      uid: user.uid,
      verificationToken: firebaseToken,
      deviceId: Platform.OS,
      provider,
    };

    await createUserUsingFirebase(userPayload);
    router.push('/tabs/home');
  };

  const handleGoogleFirebaseSignIn = async (idToken: string, accessToken?: string) => {
    setIsLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseToken = await userCredential.user.getIdToken();
      await signInWithFirebaseUser('google', userCredential.user, firebaseToken);
    } catch (error: any) {
      showError(error?.message || 'Google sign in failed.');
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert('Google Sign-In', 'Unable to initialize Google sign-in.');
      return;
    }

    await promptAsync();
  };

  const generateNonce = (length = 32) => {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._';
    let result = '';
    const randomValues = Array.from({ length }, () => Math.floor(Math.random() * charset.length));
    for (const value of randomValues) {
      result += charset[value];
    }
    return result;
  };

  const handleAppleLogin = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Apple Sign-In', 'Apple sign-in is only available on iOS devices.');
      return;
    }

    setIsLoading(true);

    try {
      const rawNonce = generateNonce();
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        throw new Error('Apple sign in did not return an identity token.');
      }

      const provider = new OAuthProvider('apple.com');
      const authCredential = provider.credential({
        idToken: credential.identityToken,
        rawNonce,
      });

      const userCredential = await signInWithCredential(auth, authCredential);
      const firebaseToken = await userCredential.user.getIdToken();
      await signInWithFirebaseUser('apple', userCredential.user, firebaseToken);
    } catch (error: any) {
      showError(error?.message || 'Apple sign in failed.');
    }
  };

  return (
    <GradientWrapper>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <AppText style={styles.title}>{t('welcome')}</AppText>
          <AppText style={styles.subtitle}>
            {t('welcome_quote')}
          </AppText>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <AppText style={styles.inputLabel}>
            {t('get_otp_sub_title')}
          </AppText>

          <View style={styles.inputContainer}>
            <AppText style={styles.floatingLabel}>{t('email_input_title')}</AppText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="j.smith@food.trckr"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Terms Checkbox */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkbox, agreed && styles.checkboxChecked]}
              onPress={() => setAgreed(!agreed)}
            >
              {agreed && <AppText style={styles.checkMark}>✓</AppText>}
            </TouchableOpacity>
            <AppText style={styles.privacyText}>
              {t('privacy_note')}{' '}
              <AppText
                onPress={() => Linking.openURL('https://example.com/privacy')}
                style={styles.link}
              >
                {t('privacy_note_link')}
              </AppText>
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => router.push('/auth/otp-verification')}
          >
            <AppText style={styles.submitButtonText}>{t('send_code_button_title')}</AppText>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <AppText style={styles.dividerText}>{t('or')}</AppText>
          <View style={styles.line} />
        </View>

        {/* Social Login Section */}
        <View style={styles.socialSection}>
          <AppText style={styles.socialTitle}>{t('sign_in')}</AppText>
          <View style={styles.socialButtonsRow}>
            {/* Google Login - Always Visible */}
            <TouchableOpacity style={styles.socialCircle} onPress={handleGoogleLogin}>
              <Image source={require('../../assets/icons/google-logo.png')} style={styles.socialIcon} />
            </TouchableOpacity>

            {/* Apple Login - Only Visible on iOS */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.socialCircle} onPress={handleAppleLogin}>
                <Image source={require('../../assets/icons/apple-logo.png')} style={styles.socialIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </GradientWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  header: { marginBottom: 50 },
  title: { fontSize: 42, color: '#FFF', fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },

  formSection: { marginBottom: 40 },
  inputLabel: { color: '#FFF', fontSize: 14, marginBottom: 15, textAlign: 'center' },
  inputContainer: {
    backgroundColor: '#F5F3F7',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  floatingLabel: { color: '#7B4D8A', fontSize: 12, fontWeight: '600' },
  input: { fontSize: 16, color: Colors.primary, marginTop: 5 },

  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 30 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#76E49D',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#76E49D' },
  checkMark: { color: Colors.primary, fontSize: 14, fontWeight: 'bold' },
  termsText: { flex: 1, color: '#FFF', fontSize: 12, lineHeight: 18 },
  linkText: { textDecorationLine: 'underline', fontWeight: 'bold' },
  privacyText: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
    flexWrap: 'wrap',
  },
  link: {
    color: '#FFF',
    textDecorationLine: 'underline',
  },

  submitButton: {
    backgroundColor: '#76E49D',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 40 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  dividerText: { color: '#FFF', marginHorizontal: 15, fontSize: 14 },

  socialSection: { alignItems: 'center' },
  socialTitle: { color: '#FFF', fontSize: 24, marginBottom: 25 },
  socialButtonsRow: { flexDirection: 'row', gap: 20 },
  socialCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: { width: 30, height: 30, resizeMode: 'contain' }
});

export default LoginScreen;