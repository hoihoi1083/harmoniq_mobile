# 🍎 Apple Sign-In Setup Status

## ✅ What's Been Completed:

### 1. Native iOS Apple Sign-In Code

- ✅ Login page updated with native Apple Sign-In flow
- ✅ Custom API endpoint created: `/api/auth/apple/ios`
- ✅ Mobile session management using Capacitor Preferences
- ✅ Timeout handling for simulator issues
- ✅ Debug logging added

### 2. Configuration Files

- ✅ Updated bundle ID: `com.harmoniq.fengshui` → `com.chunhoi.fengshui`
- ✅ Updated `capacitor.config.dev.ts` with new bundle ID
- ✅ Updated `capacitor.config.ts` with new bundle ID
- ✅ Synced changes to iOS project

### 3. Google Sign-In Setup

- ✅ iOS OAuth Client created in Google Cloud Console
- ✅ Client ID: `697339458259-k3i95igrjhnitcr8d14sl6pcgdt7s5cd.apps.googleusercontent.com`
- ✅ Added to `.env` file as `NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- ✅ Updated Capacitor configs with `iosClientId`
- ✅ Synced to iOS project

### 4. Xcode Configuration

- ✅ iPhone connected: "CHUN HOI的iPhone (2)"
- ✅ Apple Sign-In entitlements file exists
- ✅ Bundle ID changed in Xcode project
- ✅ Code signing configured (Personal Team selected)

---

## ⚠️ Blocking Issue: Paid Developer Account Required

### The Problem:

**"Sign In with Apple" capability requires a paid Apple Developer Program membership ($99/year).**

Personal Team (Free Account) limitations:

- ❌ Cannot use "Sign in with Apple" capability
- ✅ Can install apps on own devices
- ✅ Can test Google Sign-In
- ✅ Can test all other features

### Current Error:

```
Cannot create a iOS App Development provisioning profile for "com.chunhoi.fengshui".
Personal development teams, including "CHUN HOI NG", do not support the Sign in with Apple capability.
```

---

## 🎯 Solutions:

### Option 1: Get Added to Boss's Developer Team (RECOMMENDED)

Your boss has a paid Apple Developer account. They need to add you:

**Steps for Boss:**

1. Go to https://appstoreconnect.apple.com/access/users
2. Click "+" to add person
3. Enter your Apple ID: `hoihoi_michael@hotmail.com`
4. Role: **Developer** or **App Manager**
5. Send invite

**After You're Added:**

1. Accept email invitation
2. In Xcode: Settings → Accounts → Sign out and back in
3. Project → Signing & Capabilities → Select boss's team
4. Build works! ✅
5. Can test Apple Sign-In with Face ID

**Timeline:** 5-10 minutes total

---

### Option 2: Remove Apple Sign-In Capability (Test Other Features)

Remove the capability temporarily to test the app:

**Steps:**

1. In Xcode: Click "App" → "App" target → "Signing & Capabilities"
2. Find "Sign In with Apple" section
3. Click the "-" (minus) button to remove it
4. Build (Cmd+R) - will succeed!

**What You Can Test:**

- ✅ App installs and runs on iPhone
- ✅ All UI and navigation
- ✅ Google Sign-In (works with free account)
- ✅ Email/password login
- ✅ All other features
- ❌ Apple Sign-In button (won't work, but won't crash)

---

### Option 3: Join Apple Developer Program ($99/year)

**URL:** https://developer.apple.com/programs/enroll/

**Timeline:**

- Enrollment: 5 minutes
- Approval: 24-48 hours
- After approved: Full access to Apple Sign-In

---

## 📱 Testing on Real iPhone:

### Current Status:

- ✅ iPhone connected: "CHUN HOI的iPhone (2)" (iOS 26.1)
- ✅ USB connection working
- ✅ Trust established
- ⚠️ Build fails due to Sign In with Apple capability

### To Build Successfully:

Choose one of the 3 options above, then:

1. Press **Cmd+R** in Xcode
2. Wait 30-60 seconds for build
3. App installs on iPhone automatically
4. Test!

---

## 🔍 Known Issues (Non-Critical):

### NextAuth Errors:

```
TypeError: Cannot read private member #state from an object whose class did not declare it
GET /api/auth/session/ 500
```

**What this means:**

- NextAuth doesn't work with Next.js static export
- These errors are **normal** and **expected**
- They don't break the app
- Mobile auth uses Capacitor Preferences instead

**No action needed** - this is by design.

---

## 📋 File Changes Made:

### Code Files:

1. `src/app/[locale]/auth/login/page.jsx`

    - Added native iOS Apple Sign-In flow
    - Added Capacitor imports
    - Added timeout handling
    - Added debug logging

2. `src/app/api/auth/apple/ios/route.ts` (NEW)

    - Custom endpoint for iOS Apple Sign-In
    - Decodes identity token
    - Creates/updates user in MongoDB
    - Returns user data

3. `src/hooks/useMobileAuth.ts` (NEW)
    - Custom hook for mobile session management
    - Uses Capacitor Preferences
    - Provides logout functionality

### Config Files:

4. `capacitor.config.dev.ts`

    - Changed `appId` to `com.chunhoi.fengshui`
    - Added Google `iosClientId`

5. `capacitor.config.ts`

    - Changed `appId` to `com.chunhoi.fengshui`
    - Added Google `iosClientId`

6. `.env`
    - Added `NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID`
    - Added `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID`

### iOS Project:

7. `ios/App/App/App.entitlements`

    - Has "Sign In with Apple" capability configured
    - Will work once added to paid team

8. Xcode Project
    - Bundle ID changed to `com.chunhoi.fengshui`
    - Personal Team selected (blocking issue)

---

## 🚀 Next Steps:

### Immediate (Choose One):

**A. Wait for boss to add you to paid team (Best)**

- Can test Apple Sign-In with Face ID
- Can test Google Sign-In
- Full production-ready setup
- Recommended for production app

**B. Remove Apple Sign-In capability (Quick test)**

- Can test app immediately
- Can test Google Sign-In
- Can verify all other functionality
- Good for development/testing

### After Building Successfully:

1. **First-time setup on iPhone:**

    - Settings → General → VPN & Device Management
    - Trust your developer certificate
    - Relaunch app

2. **Test Features:**

    - UI and navigation
    - Chat functionality
    - Google Sign-In (if kept capability)
    - Profile and settings
    - Bottom tab navigation

3. **Google Sign-In Testing:**
    - Tap "使用Google賬號登錄"
    - Native Google account picker appears
    - Select account
    - Authenticate
    - Should redirect and log in

---

## 💡 Tips:

### Development Workflow After Initial Setup:

```bash
# 1. Make code changes
# 2. Save (app auto-reloads via live reload)
# 3. For native plugin changes: Press Cmd+R in Xcode
```

### Wireless Debugging (After first USB deploy):

1. Xcode → Window → Devices and Simulators
2. Select your iPhone
3. Check "Connect via network"
4. Disconnect USB cable
5. Deploy wirelessly!

---

## 📞 Support:

If you encounter other issues:

1. Check Xcode console for specific errors
2. Check terminal running `npm run dev` for server errors
3. On iPhone: Shake device to see debug menu (in dev mode)

---

**Status:** Ready to build once Apple Sign-In capability issue is resolved (via Option 1, 2, or 3 above).
