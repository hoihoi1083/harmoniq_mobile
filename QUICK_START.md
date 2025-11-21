# 🚀 Quick Start: Your First Mobile Build

## ⏱️ Get Your App Running in 15 Minutes!

Follow these steps to see your app running on an iPhone simulator right now.

---

## Step 1: Build Your App for Mobile (2 minutes)

```bash
cd /Users/michaelng/Desktop/HarmoniqFengShui/FengShuiLayout-mobileapp

# Build Next.js as static site for mobile
npm run build:mobile
```

This will:

- Build your Next.js app as static HTML
- Create an `out/` folder
- Sync the files to native iOS/Android projects

**Expected output:**

```
✓ Compiled successfully
✓ Generating static pages
✓ Finalizing page optimization
✓ Copying files to Capacitor
✓ Syncing native projects
```

---

## Step 2: Open in Xcode (1 minute)

```bash
npm run cap:open:ios
```

Or manually:

```bash
npx cap open ios
```

Xcode will open with your project.

---

## Step 3: Configure Signing (First Time Only - 2 minutes)

1. In Xcode, click on **App** in the left navigator (blue icon)
2. Select the **App** target in the main panel
3. Click the **Signing & Capabilities** tab
4. Check ✅ **Automatically manage signing**
5. Choose your **Team** from dropdown:
    - If you don't have a team, click "Add Account" and sign in with your Apple ID
    - Free accounts work for testing on simulator and your own devices!

**That's it!** Xcode will handle the rest.

---

## Step 4: Run on Simulator (2 minutes)

1. At the top of Xcode, click the device selector (next to the Play button)
2. Choose any iPhone simulator (e.g., **iPhone 15 Pro**)
3. Click the **Play button** ▶️ (or press `Cmd + R`)

**Wait for the app to build and launch** (first build takes ~1-2 minutes)

---

## 🎉 Success!

Your app should now be running on the iOS simulator!

You'll see:

- ✅ Your HarmoniqFengShui app interface
- ✅ All your existing features
- ✅ Bottom tab navigation (if you've integrated it)

---

## Next: Run on Your Real iPhone (Optional - 5 minutes)

### Prerequisites:

- iPhone with iOS 13 or later
- USB cable
- Same Apple ID on iPhone and Xcode

### Steps:

1. **Connect your iPhone** via USB
2. **Unlock your iPhone**
3. **Trust your computer** (iPhone will prompt you)
4. In Xcode, **select your iPhone** from the device menu
5. Click **Play** ▶️

**First time only:** You'll need to trust the developer certificate:

- Go to iPhone: **Settings** > **General** > **VPN & Device Management**
- Find your Apple ID certificate
- Tap **Trust**

Now run again from Xcode!

---

## 🐛 If Something Goes Wrong

### Error: "No such file or directory - ios/"

The iOS project hasn't been created yet. Run:

```bash
npx cap add ios
npx cap sync
```

### Error: "Module not found"

Missing dependencies. Run:

```bash
npm install
npx cap sync
```

### Error: "Signing certificate issue"

1. Make sure you're signed into Xcode with your Apple ID
2. In Xcode > Preferences > Accounts, add your Apple ID
3. Try again

### App shows white screen

The build might be outdated. Rebuild:

```bash
npm run build:mobile
```

Then run again in Xcode.

---

## 🎯 Development Workflow

### When You Make Code Changes:

#### Option A: Full Rebuild (Slower but Reliable)

```bash
npm run build:mobile
# Then press Play in Xcode again
```

#### Option B: Live Reload (Faster) ⭐

1. **Start dev server:**

```bash
npm run dev
```

2. **Get your local IP:**

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100
```

3. **Edit `capacitor.config.ts`:**

```typescript
server: {
  url: 'http://192.168.1.100:3000', // Your IP here
  cleartext: true,
},
```

4. **Sync and run:**

```bash
npx cap sync
# Then run in Xcode
```

Now changes update instantly without rebuilding! 🚀

**⚠️ Remember:** Remove `server.url` before production builds.

---

## 📱 Testing on Android (Bonus)

### Prerequisites:

- Android Studio installed
- Android emulator or physical device

### Quick Steps:

```bash
# Open Android project
npm run cap:open:android

# Or manually:
npx cap open android
```

In Android Studio:

1. Click **Run** button (▶️)
2. Select emulator or connected device
3. Wait for build

Done! 🎉

---

## 🧪 Testing Authentication

### Important Notes:

1. **Google Sign In:**

    - ⚠️ May not work fully in simulator
    - ✅ Test on **real device** for best results
    - Need to configure OAuth credentials first (see OAUTH_CONFIGURATION_GUIDE.md)

2. **Apple Sign In:**
    - ❌ Does NOT work in simulator
    - ✅ Requires **real device** with iOS 13+
    - Must be signed into iCloud on device

### Before Testing Auth:

1. Complete OAuth setup (OAUTH_CONFIGURATION_GUIDE.md)
2. Add your credentials to `.env.local`
3. Rebuild: `npm run build:mobile`
4. Test on real device, not simulator

---

## 🎨 Customizing Your App

### Change App Name:

Edit `ios/App/App/Info.plist`:

```xml
<key>CFBundleDisplayName</key>
<string>HarmoniQ風水</string>
```

### Change App Icon:

Replace icons in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

Use a tool like [appicon.co](https://appicon.co) to generate all sizes.

### Change Splash Color:

Edit `capacitor.config.ts`:

```typescript
plugins: {
  SplashScreen: {
    backgroundColor: "#086E56", // Your color
  },
}
```

---

## 📚 Learn More

- **Full Development Guide:** `MOBILE_DEVELOPMENT_GUIDE.md`
- **OAuth Setup:** `OAUTH_CONFIGURATION_GUIDE.md`
- **Complete Analysis:** `MOBILE_APP_CONVERSION_ANALYSIS.md`

---

## ✅ What You've Accomplished

You now have:

- ✅ A working iOS app running in simulator
- ✅ Capacitor set up correctly
- ✅ Development workflow established
- ✅ Foundation for authentication

**Next Steps:**

1. Set up OAuth credentials (OAUTH_CONFIGURATION_GUIDE.md)
2. Test authentication on real device
3. Customize app appearance
4. Add Android support
5. Prepare for App Store submission

---

## 🆘 Need Help?

### Check These First:

1. Run `npx cap doctor` to check setup
2. Look at console logs in Xcode
3. Make sure `out/` folder exists after build

### Common Solutions:

```bash
# Reset everything
rm -rf ios android out
npm run build:mobile
npx cap add ios
npx cap sync
```

### Still Stuck?

- Check the detailed guides in this folder
- Review Capacitor docs: https://capacitorjs.com/docs
- Check for errors in Xcode console

---

## 🎉 Congratulations!

You're now a mobile app developer! Your web app is running natively on iOS.

The journey from web to mobile is complete. Now go build something amazing! 📱✨
