# 📱 Mobile App Store Deployment Guide

## Overview

This guide explains how to deploy your mobile app to the iOS App Store and Android Play Store, and verify it's working correctly.

---

## 🔧 Prerequisites

1. **Web Backend Deployed**: Ensure `FengShuiLayout` backend is deployed to production at `https://www.harmoniqfengshui.com`
2. **Apple Developer Account**: Active membership ($99/year)
3. **Google Play Console Account**: One-time $25 registration
4. **Xcode** (for iOS) and **Android Studio** (for Android) installed

---

## 📋 Step-by-Step Deployment Process

### **Phase 1: Prepare Production Build**

#### 1.1 Verify Backend APIs are Live

Test that your 7 migrated endpoints work in production:

```bash
# Test Google Mobile Auth endpoint
curl https://www.harmoniqfengshui.com/api/auth/google/mobile

# Test Apple iOS Auth endpoint
curl https://www.harmoniqfengshui.com/api/auth/apple/ios

# Test Verify Payment endpoint
curl https://www.harmoniqfengshui.com/api/verify-payment

# Test Get User Birthday endpoint
curl https://www.harmoniqfengshui.com/api/get-user-birthday

# Test Payment Couple endpoint
curl https://www.harmoniqfengshui.com/api/payment-couple

# Test Checkout Sessions endpoint
curl https://www.harmoniqfengshui.com/api/checkoutSessions/payment4
```

All should return JSON responses (not 404).

#### 1.2 Switch to Production Config

```bash
# Copy production Capacitor config
cp capacitor.config.prod.ts capacitor.config.ts

# Verify it's using production URL
cat capacitor.config.ts | grep "url:"
# Should show: url: "https://www.harmoniqfengshui.com"
```

#### 1.3 Build Production Mobile App

```bash
# Build static export with production environment
npm run build:mobile
```

**What this does:**

- Builds Next.js app with `CAPACITOR_BUILD=true`
- Disables API routes (app will call production backend instead)
- Creates static HTML/JS/CSS in `out/` folder
- Syncs with Capacitor iOS/Android projects

---

### **Phase 2: iOS App Store Deployment**

#### 2.1 Open Xcode Project

```bash
npm run cap:open:ios
```

#### 2.2 Configure App Settings in Xcode

1. **Select Target**: Click "App" in the left panel
2. **General Tab**:

    - **Bundle Identifier**: `com.harmoniqfengshui` (must match Apple Developer portal)
    - **Version**: `1.0.0` (your app version)
    - **Build**: `1` (increment for each submission)
    - **Team**: Select your Apple Developer Team

3. **Signing & Capabilities Tab**:
    - ✅ **Automatically manage signing**
    - Select your **Team**
    - Ensure **Provisioning Profile** is valid

#### 2.3 Archive and Upload to App Store Connect

1. **Select Target Device**: Choose "Any iOS Device (arm64)" from the device dropdown
2. **Archive**:
    - Menu: `Product` → `Archive`
    - Wait for build to complete (~5-10 minutes)
3. **Organizer Window Opens**:
    - Click **"Distribute App"**
    - Select **"App Store Connect"**
    - Click **"Upload"**
    - Follow prompts to upload

#### 2.4 Configure App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. **My Apps** → Select your app → **App Store** tab
3. Fill in:

    - **App Name**: HarmoniqFengShui
    - **Subtitle**: Your feng shui subtitle
    - **Description**: Full app description
    - **Keywords**: feng shui, astrology, bazi, etc.
    - **Screenshots**: iPhone and iPad screenshots (required)
    - **App Preview** (optional): Video demo

4. **Pricing and Availability**:

    - Select countries/regions
    - Set price tier (or free)

5. **App Privacy**:

    - Fill out privacy questionnaire
    - Add privacy policy URL

6. **Build**:

    - Select the uploaded build
    - Save

7. **Submit for Review**:
    - Click **"Submit for Review"**
    - Review typically takes 1-3 days

---

### **Phase 3: Android Play Store Deployment**

#### 3.1 Open Android Studio Project

```bash
npm run cap:open:android
```

#### 3.2 Configure App Settings

1. **Update `build.gradle` (app level)**:
    ```gradle
    android {
        defaultConfig {
            applicationId "com.harmoniqfengshui"
            versionCode 1  // Increment for each release
            versionName "1.0.0"
        }
    }
    ```

#### 3.3 Generate Signed APK/Bundle

1. **Build** → **Generate Signed Bundle / APK**
2. Select **"Android App Bundle"** (recommended)
3. **Create New Keystore**:

    - Save location: `android/release.keystore`
    - Password: [create secure password]
    - Alias: `harmoniq-release`
    - Validity: 25 years
    - **Save keystore info** - you'll need it for future updates!

4. Select **"release"** build variant
5. Click **"Finish"** - bundle will be created at `android/app/release/app-release.aab`

#### 3.4 Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. **Create App** (if first time):

    - App name: HarmoniqFengShui
    - Default language: Chinese (Traditional)
    - App or Game: App
    - Free or Paid: Free

3. **Dashboard** → **Production** → **Create new release**
4. **Upload** the `app-release.aab` file
5. Fill in:
    - **Release name**: `1.0.0`
    - **Release notes**: Describe features
6. **Save** and **Review release**

#### 3.5 Complete Store Listing

1. **Store Listing**:

    - App name, description, icon
    - Screenshots (min 2 per device type)
    - Feature graphic (1024x500px)

2. **Content Rating**:

    - Complete questionnaire
    - Get rating

3. **Target Audience**:

    - Select age groups

4. **Privacy Policy**:

    - Add privacy policy URL

5. **Submit for Review**:
    - Can take 3-7 days for first review

---

### **Phase 4: Verify App is Working**

#### 4.1 TestFlight (iOS) Testing

Before public release, test via TestFlight:

1. **App Store Connect** → **TestFlight** tab
2. Add internal testers (your email)
3. Install TestFlight app on iPhone
4. Open test app and verify:
    - ✅ Bottom navigation appears
    - ✅ Google Sign-In works
    - ✅ Apple Sign-In works
    - ✅ Payment flow completes
    - ✅ Reports generate correctly
    - ✅ No crashes or errors

#### 4.2 Internal Testing (Android)

1. **Play Console** → **Testing** → **Internal testing**
2. Create internal testing track
3. Add testers (your email)
4. Download from Play Store and verify:
    - ✅ Same checklist as iOS above

#### 4.3 Monitor Production Logs

After public release:

1. **iOS**:

    - **Xcode** → **Window** → **Organizer** → **Crashes**
    - Check crash reports daily

2. **Android**:
    - **Play Console** → **Quality** → **Android vitals**
    - Monitor crash rate, ANR rate

---

## 🔄 Update Workflow (Future Updates)

When you make changes to the mobile app:

1. **Increment version numbers**:

    - iOS: Xcode → General → Build number
    - Android: `android/app/build.gradle` → versionCode

2. **Build production app**:

    ```bash
    npm run build:mobile
    ```

3. **Upload new builds**:

    - iOS: Archive → Upload to App Store Connect
    - Android: Generate signed bundle → Upload to Play Console

4. **Submit for review** in both stores

---

## 🐛 Common Issues & Solutions

### Issue: "API calls return 404"

**Solution**: Verify backend is deployed and endpoints exist:

```bash
curl https://www.harmoniqfengshui.com/api/auth/google/mobile
```

### Issue: "Google Sign-In doesn't work"

**Solution**:

1. Verify `NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID` in `.env.production`
2. Check Google OAuth consent screen is published
3. Verify bundle ID matches in Google Console

### Issue: "Apple Sign-In fails"

**Solution**:

1. Verify Apple capabilities enabled in Xcode
2. Check APPLE_ID matches bundle identifier
3. Verify private key in backend `.env`

### Issue: "Payment doesn't complete"

**Solution**:

1. Check Stripe publishable key is correct
2. Verify webhook endpoint configured in Stripe dashboard
3. Test with Stripe test cards first

### Issue: "App rejected by Apple"

**Common reasons**:

- Missing privacy policy
- Incomplete metadata (screenshots, description)
- Crashes during review
- Guideline violations

**Fix**: Address rejection reasons, resubmit

---

## 📊 Post-Launch Monitoring

### Key Metrics to Track

1. **Crash Rate**: Should be <1%
2. **Daily Active Users (DAU)**
3. **Authentication Success Rate**
4. **Payment Conversion Rate**
5. **Average Session Duration**

### Tools

- **iOS**: App Store Connect Analytics
- **Android**: Play Console Statistics
- **Backend**: Your MongoDB analytics

---

## ✅ Launch Checklist

Before submitting to stores:

- [ ] Backend deployed and all 7 endpoints live
- [ ] `.env.production` has production API URL
- [ ] `capacitor.config.prod.ts` copied to `capacitor.config.ts`
- [ ] Production build completes without errors
- [ ] App tested in simulator/emulator
- [ ] Google/Apple sign-in tested
- [ ] Payment flow tested end-to-end
- [ ] App icon and splash screen configured
- [ ] Privacy policy published
- [ ] Store screenshots prepared (multiple sizes)
- [ ] App description written in all languages
- [ ] Bundle identifiers match (iOS: `com.harmoniqfengshui`, Android: `com.harmoniqfengshui`)
- [ ] Version numbers set correctly

---

## 🎉 Success!

Once approved:

- **iOS**: App appears in App Store within 24 hours
- **Android**: App appears in Play Store within 1-2 hours

Users can now download and use your app!

**Monitor closely for first 48 hours** to catch any production issues quickly.
