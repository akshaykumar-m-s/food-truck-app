/**
 * API Configuration
 * Update the API_BASE_URL to match your backend server
 */
import Constants from 'expo-constants';

// For local development with Node server running on port 3000
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost ? debuggerHost.split(':').shift() : '192.168.100.34'; // Use your explicit local IPv4 machine address fallback

const API_BASE_URL = __DEV__ ? `http://${localhost}:3000` : 'https://your-production-url.com';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    CREATE_USER_FIREBASE: `${API_BASE_URL}/api/v1/auth/create_user_firebase`,
    EMAIL_LOGIN: `${API_BASE_URL}/api/v1/auth/login/email`,
    VALIDATE_EMAIL_OTP: `${API_BASE_URL}/api/v1/auth/validate_email_otp`,
  },
};

export default API_CONFIG;