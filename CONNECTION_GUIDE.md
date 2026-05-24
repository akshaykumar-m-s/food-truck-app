# React Native App - Local Development Connection Guide

## Current Status
✅ **Node Server is running** on `http://localhost:3000`
✅ **MongoDB is connected** and running
✅ **API Configuration updated** in the React Native app

## How to Connect Your React Native App to the Local Node Server

### 1. **For Expo Go (Fastest for Testing)**
If you're using Expo Go on your phone, you need to use your **machine's IP address** instead of `localhost`:

```bash
# Find your machine's IP address
ifconfig | grep "inet " | grep -v "127.0.0.1"
# Look for something like: inet 192.168.x.x
```

Then update `src/config/api.ts`:
```typescript
const API_BASE_URL = __DEV__ ? 'http://192.168.x.x:3000' : 'https://your-production-url.com';
```

### 2. **For Development Build (Recommended)**
Create a development build for more control:

```bash
cd /Users/akkumar/Documents/Food\ Truck/food-truck-app
npx eas build:dev --platform ios
# or for Android
npx eas build:dev --platform android
```

Then start the Expo dev server:
```bash
npx expo start --dev-client
```

### 3. **For iOS Simulator**
If using iOS Simulator, `localhost:3000` will work directly.

### 4. **For Android Emulator**
If using Android Emulator, replace `localhost` with `10.0.2.2`:
```typescript
const API_BASE_URL = __DEV__ ? 'http://10.0.2.2:3000' : 'https://your-production-url.com';
```

## Testing the Login Flow

### Step 1: Start the Node Server (Already Running ✅)
```bash
cd "/Users/akkumar/Documents/Food Truck/Native App/food_truck_nodejs_server"
npm run dev
# Server will be at http://localhost:3000
```

### Step 2: Start the React Native App
```bash
cd /Users/akkumar/Documents/Food\ Truck/food-truck-app
npx expo start
# Then press 'i' for iOS or 'a' for Android
```

### Step 3: Try Email OTP Login
1. Enter your email address
2. Click "Send Code"
3. The OTP will be sent via the Node server
4. Enter the OTP and verify

### Step 4: Monitor Server Logs
Keep the server terminal open to see API calls and debug any issues:
```
{"timestamp":"2026-05-24T16:59:11.637Z","service":"food-truck-node-server","level":"info","message":"Node server started","address":":3000","port":3000}
```

## API Endpoints Available

- **POST** `/v1/auth/create_user_firebase` - Create user after Firebase auth
- **POST** `/v1/auth/send_otp` - Send OTP for email/phone verification
- **POST** `/v1/auth/verify_otp` - Verify OTP
- **GET** `/health` - Health check

## Troubleshooting

### Connection Refused Error
- Make sure MongoDB is running: `brew services list | grep mongodb`
- Make sure Node server is running: Check terminal for "Node server started"

### API Timeout
- Check your machine's IP and firewall settings
- Make sure both your device and machine are on the same network
- Try using the correct endpoint (localhost vs IP vs 10.0.2.2)

### CORS Issues
- The server should have CORS enabled for development
- Check the Node server's middleware configuration

## Environment Variables
You can also set environment variables in `.env` file or `app.json` if needed:
```json
{
  "extra": {
    "apiUrl": "http://192.168.x.x:3000"
  }
}
```

Then access it in your app:
```typescript
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';
```
