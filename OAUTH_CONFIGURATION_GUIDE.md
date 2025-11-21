# OAuth Configuration Guide for Mobile Apps

## 🔐 Complete Setup for Google & Apple Authentication

This guide walks you through all the steps needed to configure Google and Apple OAuth for your mobile apps.

---

## 📱 Part 1: Google Cloud Console Setup

### Step 1: Access Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Select your project or create a new one

### Step 2: Enable Google Sign-In API

1. In the left sidebar, go to **APIs & Services** > **Enabled APIs & services**
2. Click **+ ENABLE APIS AND SERVICES**
3. Search for "Google Sign-In API" or "Google+ API"
4. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (or Internal if you have Google Workspace)
3. Fill in the required fields:
    - **App name:** HarmoniqFengShui
    - **User support email:** Your email
    - **Developer contact:** Your email
4. Click **Save and Continue**
5. Add scopes (optional for now):
    - `userinfo.email`
    - `userinfo.profile`
6. Click **Save and Continue**
7. Add test users (optional during development)
8. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Credentials

You need **THREE** different client IDs:

#### 4.1 Web Client ID (Already exists, for backend)

1. Go to **APIs & Services** > **Credentials**
2. You should already have a Web Client ID
3. Note down the **Client ID** (ends with `.apps.googleusercontent.com`)
4. This is used in your `.env` as `GOOGLE_CLIENT_ID`

#### 4.2 iOS Client ID (New)

1. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
2. Application type: **iOS**
3. Fill in:
    - **Name:** HarmoniqFengShui iOS
    - **Bundle ID:** `com.harmoniq.fengshui`
4. Click **Create**
5. Copy the **Client ID** → Add to `.env` as `GOOGLE_IOS_CLIENT_ID`

#### 4.3 Android Client ID (New)

1. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
2. Application type: **Android**
3. Fill in:
    - **Name:** HarmoniqFengShui Android
    - **Package name:** `com.harmoniq.fengshui`
    - **SHA-1 certificate fingerprint:** See instructions below

##### Getting SHA-1 Fingerprint:

**For Debug (Development):**

```bash
# On macOS/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# On Windows
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

Copy the **SHA-1** value (looks like `A1:B2:C3:...`) and paste it into Google Console.

**For Release (Production):**
You'll need to generate a release keystore and get its SHA-1. Do this before publishing to Play Store.

4. Click **Create**
5. Copy the **Client ID** → Add to `.env` as `GOOGLE_ANDROID_CLIENT_ID`

### Step 5: Update Environment Variables

Add to your `.env.local`:

```bash
# Google OAuth (Web - existing)
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-web-client-secret

# Google OAuth (Mobile - new)
GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com

# For mobile app client-side (public)
NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

**Important:** Use the **Web Client ID** in `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` for the mobile auth plugin.

---

## 🍎 Part 2: Apple Developer Console Setup

### Step 1: Create App ID

1. Go to: https://developer.apple.com/account/
2. Sign in with your Apple Developer account
3. Go to **Certificates, Identifiers & Profiles**
4. Click **Identifiers** in the sidebar
5. Click the **+** button
6. Select **App IDs** and click **Continue**
7. Select **App** and click **Continue**
8. Fill in:
    - **Description:** HarmoniqFengShui
    - **Bundle ID:** `com.harmoniq.fengshui` (Explicit)
9. Under **Capabilities**, enable:
    - ✅ **Sign in with Apple**
10. Click **Continue** then **Register**

### Step 2: Create Services ID (for backend)

1. Click **Identifiers** > **+** button
2. Select **Services IDs** and click **Continue**
3. Fill in:
    - **Description:** HarmoniqFengShui Web Service
    - **Identifier:** `com.harmoniq.fengshui.service`
4. Check **Sign in with Apple**
5. Click **Configure** next to Sign in with Apple
6. Fill in:
    - **Primary App ID:** Select `com.harmoniq.fengshui`
    - **Domains and Subdomains:** Your domain (e.g., `harmoniq.com`)
    - **Return URLs:** `https://harmoniq.com/api/auth/callback/apple`
7. Click **Save** then **Continue** then **Register**

### Step 3: Create Key for Sign in with Apple

1. Go to **Keys** in the sidebar
2. Click **+** button
3. Fill in:
    - **Key Name:** HarmoniqFengShui Apple Sign In Key
4. Check **Sign in with Apple**
5. Click **Configure** next to Sign in with Apple
6. Select your Primary App ID: `com.harmoniq.fengshui`
7. Click **Save** then **Continue** then **Register**
8. **Download the key file** (`.p8` file) - You can only download it once!
9. Note down:
    - **Key ID** (10 characters, e.g., `ABC123XYZ9`)
    - **Team ID** (in top right corner, 10 characters)

### Step 4: Generate Apple Client Secret

Apple requires a JWT token as the client secret. You need to generate this programmatically.

Create a script `generate-apple-secret.js`:

```javascript
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Configuration
const teamId = "YOUR_TEAM_ID"; // From Apple Developer Console
const clientId = "com.harmoniq.fengshui.service"; // Your Services ID
const keyId = "YOUR_KEY_ID"; // From the key you created
const privateKeyPath = "./AuthKey_YOUR_KEY_ID.p8"; // Downloaded .p8 file

// Read private key
const privateKey = fs.readFileSync(privateKeyPath);

// Generate JWT (valid for 6 months)
const token = jwt.sign({}, privateKey, {
	algorithm: "ES256",
	expiresIn: "180d", // 6 months
	audience: "https://appleid.apple.com",
	issuer: teamId,
	subject: clientId,
	keyid: keyId,
});

console.log("Apple Client Secret (valid for 6 months):");
console.log(token);
```

Run it:

```bash
npm install jsonwebtoken
node generate-apple-secret.js
```

Copy the generated token - this is your `APPLE_CLIENT_SECRET`.

### Step 5: Update Environment Variables

Add to your `.env.local`:

```bash
# Apple OAuth
APPLE_ID=com.harmoniq.fengshui.service
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1Ni... (the generated JWT)
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIGTAg... (content of .p8 file)\n-----END PRIVATE KEY-----"
```

**Note:** The client secret expires after 6 months. You'll need to regenerate it.

---

## 🔧 Part 3: Capacitor Configuration

### Update capacitor.config.ts

Already done! Your config should have:

```typescript
plugins: {
  GoogleAuth: {
    scopes: ['profile', 'email'],
    serverClientId: process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    forceCodeForRefreshToken: true,
  },
}
```

### iOS Specific Configuration

When you run `npx cap add ios`, you'll need to:

1. Open the iOS project in Xcode:

    ```bash
    npx cap open ios
    ```

2. In Xcode:

    - Select your project in the navigator
    - Go to **Signing & Capabilities** tab
    - Click **+ Capability**
    - Add **Sign in with Apple**

3. Update Info.plist (ios/App/App/Info.plist):

    ```xml
    <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>com.harmoniq.fengshui</string>
        </array>
      </dict>
      <dict>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>com.googleusercontent.apps.YOUR_IOS_CLIENT_ID_REVERSED</string>
        </array>
      </dict>
    </array>
    ```

    Replace `YOUR_IOS_CLIENT_ID_REVERSED` with your iOS Client ID reversed.
    Example: If your ID is `123456-abc.apps.googleusercontent.com`, use `com.googleusercontent.apps.123456-abc`

### Android Specific Configuration

When you run `npx cap add android`, you'll need to:

1. Open android/app/src/main/AndroidManifest.xml
2. Add inside `<application>` tag:
    ```xml
    <meta-data
        android:name="com.google.android.gms.version"
        android:value="@integer/google_play_services_version" />
    ```

---

## ✅ Testing Checklist

### Google Authentication:

- [ ] Web Client ID created
- [ ] iOS Client ID created
- [ ] Android Client ID created
- [ ] SHA-1 fingerprint added for Android
- [ ] Environment variables updated
- [ ] OAuth consent screen configured

### Apple Authentication:

- [ ] App ID created with Sign in with Apple
- [ ] Services ID created
- [ ] Key created and downloaded (.p8 file)
- [ ] Client secret generated (JWT token)
- [ ] Return URLs configured
- [ ] Environment variables updated
- [ ] Sign in with Apple capability added in Xcode

### Mobile App:

- [ ] Capacitor installed and configured
- [ ] Auth plugins installed
- [ ] capacitor.config.ts updated with Google client ID
- [ ] iOS URL schemes configured
- [ ] Android manifest updated

---

## 🚨 Common Issues & Solutions

### Issue 1: "OAuth2 client not found" (Google)

**Solution:** Make sure you're using the correct client ID for each platform. Use Web Client ID in the Capacitor plugin config.

### Issue 2: "Invalid client" (Apple)

**Solution:** Regenerate the client secret JWT. It expires after 6 months.

### Issue 3: "APP_NOT_AUTHORIZED" (Google on Android)

**Solution:** Double-check the SHA-1 fingerprint and package name in Google Console match exactly.

### Issue 4: "Redirect URI mismatch" (Apple)

**Solution:** Ensure the return URL in Apple Console exactly matches your backend callback URL.

### Issue 5: Google Sign In fails on iOS

**Solution:** Make sure the reversed client ID is correctly added to Info.plist URL schemes.

---

## 📝 Summary

After completing these steps, you'll have:

✅ Google OAuth configured for web, iOS, and Android  
✅ Apple Sign In configured for iOS  
✅ All credentials stored in environment variables  
✅ Mobile app ready to authenticate users

Next step: Build and test your app on actual devices!

---

## 🔗 Useful Links

- Google Cloud Console: https://console.cloud.google.com/
- Apple Developer Portal: https://developer.apple.com/account/
- Google OAuth Documentation: https://developers.google.com/identity/sign-in/ios
- Apple Sign In Documentation: https://developer.apple.com/sign-in-with-apple/
- Capacitor Google Auth Plugin: https://github.com/CodetrixStudio/CapacitorGoogleAuth
- Capacitor Apple Sign In Plugin: https://github.com/capacitor-community/apple-sign-in
