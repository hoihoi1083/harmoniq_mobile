# 🍎 Xcode Testing Guide - Login & Payment Flow

**Updated:** 2025-01-19  
**Purpose:** Test mobile Google login → Payment button flow

---

## 📋 Prerequisites Checklist

Before opening Xcode, ensure you have:

- [ ] **Node.js server running** on `localhost:3000`
- [ ] **MongoDB connected** (check `.env` file)
- [ ] **Environment variables** set (`.env` file with all keys)
- [ ] **Latest mobile build** synced to iOS folder
- [ ] **Xcode installed** (version 14.0+)
- [ ] **iOS Simulator** or **Physical iPhone** available

---

## 🚀 Step-by-Step Testing Instructions

### **STEP 1: Start Development Server**

Open Terminal in your project folder:

```bash
# Navigate to project
cd /Users/michaelng/Desktop/HarmoniqFengShui/FengShuiLayout-mobileapp

# Start Next.js dev server
pnpm dev
# or
npm run dev

# Wait for: "Ready on http://localhost:3000"
```

**✅ Verify:** Open http://localhost:3000 in browser - should see your app

---

### **STEP 2: Build & Sync Mobile App**

In the same Terminal (or new tab):

```bash
# Build static export for Capacitor
pnpm run build:mobile
# This runs: next build && next export to /out folder

# Sync to iOS (copies /out to ios/App/App/public)
npx cap sync ios

# Expected output:
# ✔ Copying web assets from out to ios/App/App/public
# ✔ Copying native bridge
# ✔ Copying Capacitor config
# ✔ Updating iOS plugins
```

**⚠️ Important:** Every time you change code, run `pnpm run build:mobile && npx cap sync ios`

---

### **STEP 3: Open Xcode**

```bash
# Open Xcode project
npx cap open ios

# Or manually:
# open ios/App/App.xcworkspace
```

**⚠️ CRITICAL:** Always open `App.xcworkspace`, NOT `App.xcodeproj`!

---

### **STEP 4: Configure Xcode for Testing**

#### **4.1 Select Target Device**

At the top of Xcode window, click the device selector (next to "Run" button):

```
┌─────────────────────────────┐
│ HarmoniqFengShui (Dev) ▼   │  ← Click here
└─────────────────────────────┘
```

Choose:

- **iPhone 15 Pro** (Simulator) - for initial testing
- **Your Physical iPhone** (if connected) - for real Google Sign-In

**Simulator Limitations:**

- ⚠️ Google Sign-In may not work properly in simulator
- ✅ UI flow works
- ✅ Session storage (Preferences) works
- ❌ Native OAuth dialogs may fail

**Physical Device Recommended for Full Test!**

---

#### **4.2 Check Signing & Capabilities**

1. Click on **"App"** in left sidebar (blue icon)
2. Select **"Signing & Capabilities"** tab
3. Verify:
    - ✅ **Team:** Your Apple Developer account
    - ✅ **Bundle Identifier:** `com.chunhoi.fengshui`
    - ✅ **Signing Certificate:** Valid

**Required Capabilities:**

- ✅ **Sign in with Apple** (already added)
- ✅ **Associated Domains** (for OAuth callbacks)

---

#### **4.3 Verify Info.plist Settings**

Click on **App/Info.plist** in left sidebar, check:

```xml
<!-- Google Sign-In URL Schemes -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.697339458259-k3i95igrjhnitcr8d14sl6pcgdt7s5cd</string>
        </array>
    </dict>
</array>

<!-- Allow HTTP for localhost in development -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

---

### **STEP 5: Run the App** 🎯

Press **▶️ Play button** (or `Cmd + R`)

**Expected:**

1. Xcode builds app (1-2 minutes first time)
2. Simulator/Device launches
3. App opens with splash screen
4. Loads `http://localhost:3000`
5. Shows chat page

**⚠️ Troubleshooting Build Errors:**

```bash
# If pods error:
cd ios/App
pod install
cd ../..

# If build fails:
# 1. Clean build folder: Cmd + Shift + K
# 2. Clean derived data: Cmd + Shift + Option + K
# 3. Rebuild: Cmd + R
```

---

### **STEP 6: Test Login Flow** 🔐

#### **6.1 Navigate to Login Page**

In the running app:

1. If logged out: Navbar shows "登入" button
2. Tap "登入" → Goes to `/auth/login`

**OR** directly open login:

- Tap bottom nav "我的" (profile icon)
- Should redirect to login if not authenticated

---

#### **6.2 Test Google Login**

1. **On Login Page:** Tap "Google" button

2. **Expected Behavior:**

    - **Simulator:** May show error "User cancelled" (normal limitation)
    - **Physical Device:** Opens native Google Sign-In sheet ✅

3. **Sign In with Google:**

    - Choose your Google account
    - Tap "Continue"
    - Grants permissions

4. **After Success:**
    - App redirects to homepage (`/`)
    - Navbar shows your avatar (top right)
    - Bottom nav is visible

---

#### **6.3 Monitor Console Logs**

**In Xcode Console** (bottom panel), watch for:

```
🔍 DEBUG - Provider: google
🔍 DEBUG - isNativePlatform: true
🔍 DEBUG - getPlatform: ios
🔵 Using native Google Sign-In
📱 Calling GoogleAuth.signIn()...
✅ Google Sign-In result: {email: "...", name: "..."}
✅ User created/updated: {...}
✅ Session stored in Capacitor Preferences
```

**If you see errors:**

```
❌ Native Google Sign-In error: [Error details]
```

→ Check that Google OAuth client ID is correct in `.env`

---

### **STEP 7: Test Payment Flow** 💳 **[CRITICAL TEST]**

This is the main fix we applied!

#### **7.1 Navigate to Pricing Page**

After successful login:

1. Tap bottom nav **"服務定價"** (3rd icon from left)
2. Should go to `/price` page
3. **Should NOT redirect back to login** ✅

**Previous Bug:** This step would redirect to login
**Now Fixed:** Session is detected from Preferences

---

#### **7.2 Check Session Detection**

**In Xcode Console**, look for:

```
📱 Mobile session found: {user: {...}, provider: "google"}
effectiveSession: {user: {...}}
```

**If you see:**

```
📱 No mobile session found
effectiveSession: null
```

→ Session storage failed - check Preferences

---

#### **7.3 Click Payment Button**

On pricing page, tap ANY payment button:

**Option A: Life Analysis (命運計算)**

- Tap "立即付款 HK$88" button

**Option B: Fortune Cards (個人運程分析)**

- Tap any fortune card (財運, 感情, 健康, 事業)

**Option C: Couple Analysis**

- Scroll to couple section
- Tap "立即付款 HK$88"

---

#### **7.4 Expected Results** ✅

**Success Flow:**

```
1. Tap payment button
2. Console shows: "💰 Price page life payment - Using fresh locale: zh-TW"
3. Console shows: "✅ Payment session check passed"
4. Redirects to Stripe Checkout URL
5. Opens Safari/Browser with Stripe payment page
```

**If Bug Still Exists (Old Behavior):**

```
1. Tap payment button
2. Console shows: "❌ User not logged in, redirecting to login page"
3. Redirects back to /auth/login
4. Login loop continues ❌
```

---

### **STEP 8: Verify Stripe Redirect** 💳

If session check passed:

1. App opens Safari/Browser
2. Shows Stripe Checkout page
3. Payment form with card input
4. "Pay HK$88" button visible

**Test Card for Stripe:**

```
Card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**⚠️ Don't complete payment in testing** - just verify it reaches Stripe

---

## 🐛 Debugging Tips

### **View Console Logs**

**In Xcode:**

1. Bottom panel → Show/Hide Debug Area (Cmd + Shift + Y)
2. Right side shows console output
3. Filter by typing keywords: "effectiveSession", "payment", "login"

**In Safari (for web debugging):**

1. On Mac: Safari → Develop → [Your iPhone] → localhost
2. Opens Web Inspector
3. Console tab shows JavaScript logs

---

### **Check Capacitor Preferences**

Add this to pricing page temporarily to debug:

```jsx
// In src/app/[locale]/price/page.jsx
useEffect(() => {
	async function debugSession() {
		if (Capacitor.isNativePlatform()) {
			const { value } = await Preferences.get({ key: "userSession" });
			console.log("🔍 Stored session:", value);
		}
	}
	debugSession();
}, []);
```

---

### **Common Issues & Fixes**

#### **Issue 1: "No mobile session found"**

**Symptom:** Login succeeds but payment still redirects to login

**Fix:**

```bash
# Check login API response
# In Xcode console, verify:
✅ Session stored in Capacitor Preferences

# If not shown, check:
# - src/app/[locale]/auth/login/page.jsx (line ~150)
# - Ensure Preferences.set() is called after Google sign-in
```

---

#### **Issue 2: "Cannot connect to localhost:3000"**

**Symptom:** App shows blank screen or connection error

**Fix:**

```bash
# Ensure dev server is running:
pnpm dev

# Check capacitor.config.ts:
server: {
    url: "http://localhost:3000",
    cleartext: true,
}

# On physical device, use Mac's IP:
server: {
    url: "http://192.168.1.X:3000",  # Replace X with your Mac's IP
    cleartext: true,
}

# Find your Mac's IP:
ifconfig | grep "inet " | grep -v 127.0.0.1
```

---

#### **Issue 3: Google Sign-In Fails**

**Symptom:** "User cancelled" error immediately

**Possible Causes:**

1. **Wrong Client ID:** Check `.env` and `capacitor.config.ts`

    ```bash
    # Verify iOS Client ID matches:
    NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID=697339458259-k3i95igrjhnitcr8d14sl6pcgdt7s5cd.apps.googleusercontent.com
    ```

2. **Missing URL Scheme:** Check `Info.plist` has correct Google URL scheme

3. **Simulator Limitation:** Test on real device instead

4. **OAuth Consent Screen:** Check Google Cloud Console:
    - Go to: https://console.cloud.google.com
    - APIs & Services → Credentials
    - Verify iOS client ID exists
    - Add test users if in testing mode

---

#### **Issue 4: Payment Button Does Nothing**

**Symptom:** Tap payment button, no response

**Debug:**

```jsx
// Check console for:
console.log("Button clicked"); // Should appear
console.log("effectiveSession:", effectiveSession); // Should be object, not null

// If null, session detection failed
// If object, check network tab for API call
```

---

## 📊 Complete Test Checklist

Use this checklist for thorough testing:

### **Pre-Test Setup:**

- [ ] Dev server running on localhost:3000
- [ ] MongoDB connected
- [ ] Latest code synced: `pnpm run build:mobile && npx cap sync ios`
- [ ] Xcode opened: `npx cap open ios`
- [ ] Device selected (Simulator or Physical)

### **Login Flow:**

- [ ] App launches successfully
- [ ] Navigate to login page
- [ ] Tap Google button
- [ ] Native Google dialog appears (on device)
- [ ] Sign in with Google account
- [ ] Redirects to homepage
- [ ] Navbar shows user avatar
- [ ] Console shows: "✅ Session stored in Capacitor Preferences"

### **Session Persistence:**

- [ ] Tap "服務定價" (pricing page)
- [ ] Page loads WITHOUT redirecting to login ✅
- [ ] Console shows: "📱 Mobile session found"
- [ ] Console shows: "effectiveSession: {user: {...}}"

### **Payment Flow:**

- [ ] On pricing page, all payment buttons visible
- [ ] Tap "Life Analysis HK$88" button
- [ ] Console shows: "💰 Price page life payment"
- [ ] Console does NOT show: "❌ User not logged in"
- [ ] Redirects to Stripe Checkout
- [ ] Stripe page opens in Safari/Browser
- [ ] Payment form displays correctly

### **Alternative Payments:**

- [ ] Test Fortune Card payment (HK$38)
- [ ] Test Couple Analysis (HK$88)
- [ ] All redirect to Stripe (not login)

### **Edge Cases:**

- [ ] Restart app → Session persists
- [ ] Close and reopen app → Still logged in
- [ ] Tap logout → Session clears
- [ ] Login again → Payment works

---

## 🎥 Screen Recording for Bug Reports

If issues persist, record your screen:

**On Mac:**

- Cmd + Shift + 5 → Record Xcode window

**On iPhone:**

- Settings → Control Center → Add Screen Recording
- Swipe down → Tap record button

**Include in recording:**

1. Login button tap
2. Google Sign-In flow
3. Homepage with avatar
4. Navigate to pricing
5. Tap payment button
6. Result (success or error)

---

## 🚀 Quick Commands Reference

```bash
# Start dev server
pnpm dev

# Build and sync mobile
pnpm run build:mobile && npx cap sync ios

# Open Xcode
npx cap open ios

# Clean iOS build (if needed)
cd ios/App
rm -rf build
pod install
cd ../..

# View live logs (alternative to Xcode)
npx cap run ios --livereload

# Check Capacitor version
npx cap --version
```

---

## 📱 Testing on Physical Device

### **Connect iPhone:**

1. Plug iPhone into Mac with USB cable
2. On iPhone: Trust this computer
3. In Xcode: Select your iPhone from device list
4. Run app (▶️ button)

**First Time Setup:**

1. Xcode may ask to enable "Developer Mode"
2. On iPhone: Settings → Privacy & Security → Developer Mode → On
3. Restart iPhone
4. Try again

### **Network Configuration:**

Since device can't access `localhost:3000`, update config:

```bash
# Find your Mac's IP address
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100

# Edit capacitor.config.ts
server: {
    url: "http://192.168.1.100:3000",  # Replace with your IP
    cleartext: true,
}

# Sync again
npx cap sync ios
```

**Ensure both devices on same WiFi!**

---

## ✅ Success Criteria

Your test is successful when:

1. ✅ Google login works on device
2. ✅ Avatar appears in navbar after login
3. ✅ Pricing page loads without redirect
4. ✅ Console shows: "📱 Mobile session found"
5. ✅ Payment button redirects to Stripe (not login)
6. ✅ Stripe checkout page opens
7. ✅ No "❌ User not logged in" errors

---

## 📞 If You Need Help

**Check Logs First:**

1. Xcode console output
2. Safari Web Inspector (for React errors)
3. Network tab (for API failures)

**Common Log Locations:**

- `console.log()` → Xcode debug area
- React errors → Safari Web Inspector
- API errors → Both consoles

**Share for Help:**

- Screenshot of error
- Console logs (copy/paste)
- Screen recording of flow
- Which device (Simulator vs iPhone)

---

## 🎓 Pro Tips

1. **Keep Dev Server Running:** Don't restart unless needed
2. **Use Physical Device:** For real OAuth testing
3. **Check Console First:** Most issues show clear logs
4. **Clean Build Often:** Xcode caches can cause weird issues
5. **Test Both Flows:** Web (browser) and Mobile (Xcode) should both work

---

**Happy Testing! 🚀**

If the payment button still redirects to login after this fix, share your console logs and I'll help debug further.
