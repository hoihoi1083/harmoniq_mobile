# Adding Mobile Google Authentication

You already have Google OAuth set up for web! Now you just need to add iOS and Android client IDs for the mobile app.

## ⏱️ Time Required: 10 minutes

---

## Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/apis/credentials
2. Select your existing project (the one with your current credentials)

---

## Step 2: Create iOS OAuth Client ID

1. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**

2. **Application type**: Choose **"iOS"**

3. **Name**: `HarmoniqFengShui iOS`

4. **Bundle ID**: `com.harmoniq.fengshui`

    - This must match the `appId` in your `capacitor.config.ts`

5. Click **"CREATE"**

6. **Copy the iOS Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
    - You'll need this for your `.env` file

---

## Step 3: Create Android OAuth Client ID

1. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**

2. **Application type**: Choose **"Android"**

3. **Name**: `HarmoniqFengShui Android`

4. **Package name**: `com.harmoniq.fengshui`

    - This must match the `appId` in your `capacitor.config.ts`

5. **SHA-1 certificate fingerprint**:

    For **development/testing**, use the debug keystore:

    ```bash
    keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
    ```

    Copy the **SHA-1** value (looks like: `AA:BB:CC:...`)

6. Click **"CREATE"**

7. **Copy the Android Client ID**

---

## Step 4: Update Your .env File

Add these new values to your existing `.env` file:

```bash
# Your existing credentials (keep these)
GOOGLE_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# NEW: Add these mobile credentials
NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

**Note**: The `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` is your existing web client ID (reused).

---

## Step 5: Rebuild Mobile App

```bash
./build-mobile.sh
npx cap sync
```

---

## ✅ That's It!

Your Apple credentials already work for mobile! You only needed to add:

- Google iOS Client ID
- Google Android Client ID

Now your mobile app can use native Google Sign In on both platforms.

---

## 🧪 Testing

### On iOS Simulator:

- Google Sign In will show a web view (simulators don't have native Google Sign In)
- Test on a **real device** for the full native experience

### On Real iOS Device:

- Make sure the device has Google app installed
- The native Google Sign In sheet will appear
- Much smoother than web-based login!

---

## 🔧 Troubleshooting

### "Sign in failed" on iOS

- Verify the iOS Client ID is correct in `.env`
- Check that Bundle ID matches in Google Console and `capacitor.config.ts`
- Rebuild: `./build-mobile.sh && npx cap sync`

### "Sign in failed" on Android

- Verify SHA-1 fingerprint is correct in Google Console
- For production, you'll need to add the release keystore SHA-1
- Check that Package Name matches in Google Console and `capacitor.config.ts`

---

## 📱 What About Apple Sign In?

**Good news!** Your existing Apple credentials work for mobile without any changes:

```bash
# These work for both web AND mobile:
APPLE_ID=com.harmoniqfengshui
APPLE_TEAM_ID=H2L5855PA7
APPLE_KEY_ID=9ARBN3G5L4
APPLE_CLIENT_SECRET=eyJhbGci...
```

Apple Sign In will work natively on iOS automatically! 🎉
