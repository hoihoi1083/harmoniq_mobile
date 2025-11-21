# Mobile App Development Guide

## 🚀 How to Develop and Run Your Mobile App

This guide shows you how to develop your HarmoniqFengShui app as a mobile application using Capacitor and Xcode.

---

## 📋 Prerequisites

### Required Software:

#### For iOS Development:

- ✅ **macOS** (required for iOS development)
- ✅ **Xcode** (latest version from App Store)
- ✅ **Xcode Command Line Tools**
- ✅ **CocoaPods** (for iOS dependencies)
- ✅ **Node.js** 18+ and npm/pnpm

#### For Android Development:

- ✅ **Android Studio** (any OS)
- ✅ **Java Development Kit (JDK)** 17+
- ✅ **Android SDK** (comes with Android Studio)
- ✅ **Node.js** 18+ and npm/pnpm

### Installation Commands:

```bash
# Install CocoaPods (macOS, for iOS)
sudo gem install cocoapods

# Verify installations
node --version    # Should be 18+
xcode-select -p   # Should show Xcode path
pod --version     # Should show CocoaPods version
```

---

## 🎯 Quick Start Guide

### Step 1: Build Your Next.js App for Mobile

```bash
# Navigate to your project
cd /Users/michaelng/Desktop/HarmoniqFengShui/FengShuiLayout-mobileapp

# Build Next.js app as static export for Capacitor
CAPACITOR_BUILD=true npm run build
```

This creates an `out/` folder with your static site.

### Step 2: Add iOS and Android Platforms (First Time Only)

```bash
# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android
```

This creates `ios/` and `android/` folders with native projects.

### Step 3: Sync Your Web App to Native Projects

Every time you rebuild your Next.js app, sync it:

```bash
# Copy web assets to native projects
npx cap sync
```

This copies the `out/` folder to native projects and updates plugins.

---

## 📱 iOS Development with Xcode

### Open the iOS Project

```bash
npx cap open ios
```

This opens your app in Xcode.

### Configure Signing (First Time)

1. In Xcode, select your project in the navigator
2. Select the **App** target
3. Go to **Signing & Capabilities** tab
4. Check **Automatically manage signing**
5. Select your **Team** (your Apple Developer account)
6. Xcode will automatically generate a provisioning profile

### Run on iOS Simulator

1. In Xcode, select a simulator from the device menu (e.g., iPhone 15 Pro)
2. Click the **Play** button (▶️) or press `Cmd + R`
3. Wait for the app to build and launch

### Run on Real iOS Device

1. Connect your iPhone via USB
2. Unlock your iPhone
3. In Xcode, select your device from the device menu
4. Click the **Play** button (▶️)
5. On first run, you may need to:
    - Go to iPhone Settings > General > VPN & Device Management
    - Trust your developer certificate

### Debugging iOS

```bash
# View console logs
npx cap run ios --livereload --external

# Or use Safari Web Inspector:
# Safari > Develop > [Your iPhone] > [Your App]
```

---

## 🤖 Android Development with Android Studio

### Open the Android Project

```bash
npx cap open android
```

This opens your app in Android Studio.

### Run on Android Emulator

1. In Android Studio, click the **Device Manager** icon
2. Create a new virtual device (e.g., Pixel 5 with Android 13+)
3. Click the **Run** button (▶️) or press `Shift + F10`
4. Select your emulator
5. Wait for the app to build and launch

### Run on Real Android Device

1. Enable **Developer Options** on your Android phone:
    - Go to Settings > About Phone
    - Tap "Build Number" 7 times
2. Enable **USB Debugging**:
    - Go to Settings > Developer Options
    - Enable "USB Debugging"
3. Connect your phone via USB
4. In Android Studio, select your device and click **Run**

### Debugging Android

```bash
# View console logs
npx cap run android --livereload --external

# Or use Chrome DevTools:
# Chrome > chrome://inspect
```

---

## 🔄 Development Workflow

### Option 1: Full Rebuild (Slower)

```bash
# 1. Make changes to your code
# 2. Build Next.js
CAPACITOR_BUILD=true npm run build

# 3. Sync to native projects
npx cap sync

# 4. Run in Xcode/Android Studio
npx cap open ios
# or
npx cap open android
```

### Option 2: Live Reload (Faster) ⭐ **RECOMMENDED**

For faster development, run Next.js dev server and point Capacitor to it:

1. **Start Next.js dev server:**

```bash
npm run dev
# Server runs at http://localhost:3000
```

2. **Get your local IP address:**

```bash
# On macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows
ipconfig
```

Look for your local IP (e.g., `192.168.1.100`)

3. **Update capacitor.config.ts temporarily:**

```typescript
server: {
  url: 'http://192.168.1.100:3000', // Your local IP
  cleartext: true, // Allow HTTP (dev only)
},
```

4. **Sync and run:**

```bash
npx cap sync
npx cap open ios
# or
npx cap open android
```

Now changes to your code will update instantly without rebuilding!

**⚠️ Remember:** Remove the `server.url` before building for production.

---

## 🛠️ Common Development Tasks

### Update Native Dependencies

After installing new Capacitor plugins:

```bash
npx cap sync
```

### Clean Build (if things break)

```bash
# iOS
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Android
cd android
./gradlew clean
cd ..

# Then sync again
npx cap sync
```

### Update Capacitor

```bash
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/ios@latest @capacitor/android@latest
npx cap sync
```

---

## 🧪 Testing Authentication

### Test Google Sign In

1. Run the app on a real device (simulators have limitations)
2. Tap "Sign in with Google"
3. Complete authentication in Google's native dialog
4. Check console for success/error messages

**iOS Simulator Limitation:** Google Sign In may not work perfectly in simulator. Test on real device.

**Android Emulator:** Make sure Google Play Services is installed on emulator.

### Test Apple Sign In

1. **iOS only** - Run on real iPhone (iOS 13+)
2. Make sure you're signed into iCloud
3. Tap "Sign in with Apple"
4. Complete authentication in Apple's native dialog

**Note:** Apple Sign In **requires a real device**. It won't work in simulator.

---

## 📊 Debugging Tips

### View Network Requests

#### iOS (Safari):

1. Enable Web Inspector on iPhone: Settings > Safari > Advanced > Web Inspector
2. Connect iPhone to Mac
3. Open Safari > Develop > [Your iPhone] > [Your App]
4. Use Network tab to see API calls

#### Android (Chrome):

1. Open Chrome on your computer
2. Go to `chrome://inspect`
3. Find your device and app
4. Click "inspect"
5. Use Network tab

### View Console Logs

```bash
# iOS (native logs)
npx cap run ios --livereload

# Android (native logs)
npx cap run android --livereload

# Or use native tools:
# iOS: Xcode > Window > Devices and Simulators > Open Console
# Android: Android Studio > Logcat
```

### Check Capacitor Plugin Status

```bash
npx cap ls
```

Shows all installed plugins and their status.

---

## 📦 Building for Production

### iOS Production Build

1. In Xcode, select **Any iOS Device** as target
2. Product > Archive
3. Follow prompts to upload to App Store Connect

Or use command line:

```bash
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath ios/build/App.xcarchive \
  archive
```

### Android Production Build

```bash
cd android
./gradlew assembleRelease

# APK will be in:
# android/app/build/outputs/apk/release/app-release.apk
```

Or in Android Studio: Build > Generate Signed Bundle / APK

---

## 🎨 Customizing Native Apps

### App Icons

1. **iOS:** Replace icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. **Android:** Replace icons in `android/app/src/main/res/mipmap-*/`

Or use a tool like: https://appicon.co/

### Splash Screen

Update in `capacitor.config.ts`:

```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: "#086E56",
    showSpinner: false,
    androidSpinnerStyle: "small",
    iosSpinnerStyle: "small",
  },
}
```

### App Name

- **iOS:** Edit `ios/App/App/Info.plist` → `CFBundleDisplayName`
- **Android:** Edit `android/app/src/main/res/values/strings.xml` → `app_name`

---

## 🔐 Environment Variables for Mobile

Create `.env.local` in project root:

```bash
# API URL (important for mobile!)
NEXT_PUBLIC_API_URL=https://your-production-domain.com

# Google OAuth
NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-client-id.apps.googleusercontent.com

# These stay server-side
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
APPLE_ID=com.harmoniq.fengshui
APPLE_CLIENT_SECRET=your-jwt-token
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri
```

**Important:** Mobile apps will use `NEXT_PUBLIC_*` variables as they're bundled with the app.

---

## ✅ Pre-Launch Checklist

### Before Submitting to App Stores:

- [ ] Test on real devices (iOS and Android)
- [ ] Test Google Sign In
- [ ] Test Apple Sign In (iOS only)
- [ ] All features work offline (if applicable)
- [ ] No console errors
- [ ] App icons set
- [ ] Splash screen set
- [ ] App name set correctly
- [ ] Privacy policy URL added
- [ ] Terms of service URL added
- [ ] Correct bundle ID / package name
- [ ] Version number updated
- [ ] Production API URL configured
- [ ] Remove development server URLs from capacitor.config.ts
- [ ] Test with production backend

---

## 🚨 Troubleshooting

### "Module not found" errors

```bash
npm install
npx cap sync
```

### iOS build fails

```bash
cd ios
pod install
cd ..
npx cap sync
```

### Android build fails

```bash
cd android
./gradlew clean
cd ..
npx cap sync
```

### Changes not showing up

```bash
CAPACITOR_BUILD=true npm run build
npx cap sync
# Then rebuild in Xcode/Android Studio
```

### Google Auth not working

- Check `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set
- Verify OAuth credentials in Google Console
- Check SHA-1 fingerprint (Android)
- Check URL schemes (iOS)

### Apple Auth not working

- Must use real device (not simulator)
- Must be signed into iCloud on device
- Check Sign in with Apple capability in Xcode
- Verify Services ID in Apple Developer Console

---

## 📚 Useful Commands Reference

```bash
# Development
npm run dev                      # Start Next.js dev server
CAPACITOR_BUILD=true npm run build   # Build for Capacitor
npx cap sync                     # Sync web assets to native
npx cap open ios                 # Open in Xcode
npx cap open android             # Open in Android Studio

# Plugin Management
npx cap ls                       # List all plugins
npx cap sync                     # Install/update plugins

# Live Reload
npx cap run ios --livereload    # iOS with live reload
npx cap run android --livereload # Android with live reload

# Debugging
npx cap doctor                   # Check Capacitor setup
npx cap copy                     # Copy web assets only
npx cap update                   # Update all platforms

# Clean
rm -rf ios android node_modules  # Nuclear option
npm install                      # Reinstall
npx cap add ios                  # Re-add iOS
npx cap add android              # Re-add Android
```

---

## 🎓 Learning Resources

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Next.js + Capacitor:** https://nextjs.org/docs/advanced-features/static-html-export
- **Xcode Guide:** https://developer.apple.com/xcode/
- **Android Studio Guide:** https://developer.android.com/studio

---

## 🎉 You're Ready!

Your development environment is set up. Here's your typical workflow:

1. **Code** in VS Code
2. **Test** with `npm run dev` in browser
3. **Build** with `CAPACITOR_BUILD=true npm run build`
4. **Sync** with `npx cap sync`
5. **Run** with Xcode/Android Studio
6. **Repeat!**

Good luck with your mobile app! 🚀📱
