import Constants from 'expo-constants';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const expoConfig = Constants.expoConfig as any;

const firebaseConfig = expoConfig?.extra?.firebase ?? {
  apiKey: '<YOUR_FIREBASE_API_KEY>',
  authDomain: '<YOUR_FIREBASE_AUTH_DOMAIN>',
  projectId: '<YOUR_FIREBASE_PROJECT_ID>',
  storageBucket: '<YOUR_FIREBASE_STORAGE_BUCKET>',
  messagingSenderId: '<YOUR_FIREBASE_MESSAGING_SENDER_ID>',
  appId: '<YOUR_FIREBASE_APP_ID>',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
