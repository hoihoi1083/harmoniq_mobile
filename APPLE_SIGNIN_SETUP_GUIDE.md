# 🍎 Apple Sign-In Setup Guide for iOS

## Current Status

✅ NextAuth routes enabled  
✅ Apple credentials configured in .env  
✅ Native iOS Apple Sign-In code implemented  
✅ Custom API endpoint created (`/api/auth/apple/ios`)  
✅ Mobile session management using Capacitor Preferences  
⚠️ **PENDING: Add "Sign In with Apple" capability in Xcode**

---

## Step 1: Add Apple Sign-In Capability in Xcode

### Instructions:

1. **Open Xcode project:**

    ```bash
    open ios/App/App.xcworkspace
    ```

2. **In Xcode:**

    - Click on "App" project in the left sidebar (blue icon at the top)
    - Select the "App" target in the main panel
    - Click on the "Signing & Capabilities" tab at the top
    - Click the "+ Capability" button
    - Search for "Sign In with Apple"
    - Double-click to add it

3. **Verify:**
    - You should see "Sign In with Apple" listed in the capabilities
    - An `App.entitlements` file will be automatically created

---

## Step 2: Build and Run on iOS Simulator

### Development Mode (with Live Reload):

```bash
# Make sure dev server is running (if not already)
npm run dev

# Build and sync iOS app
npm run cap:dev

# Open in Xcode and run
npx cap open ios
```

### In Xcode:

1. Select a simulator device (iPhone 15 Pro or similar)
2. Click the "Run" button (▶️) or press Cmd+R
3. Wait for the app to build and launch

---

## Step 3: Test Apple Sign-In Flow

### Testing Steps:

1. **Navigate to Login:**

    - In the app, tap the "我的" (Profile) tab at the bottom
    - You should be redirected to the login page

2. **Click "Apple" Button:**

    - Tap the "Apple" sign-in button (black button with Apple logo)
    - You should see a loading toast: "Loading..."

3. **Apple Sign-In Dialog:**

    - Native iOS Apple Sign-In dialog should appear
    - In simulator, you'll see test user options
    - Select "Continue" or use a test Apple ID

4. **Verify Success:**
    - Toast should show: "Login successful!" (or localized version)
    - App should redirect to chat page (`/`)
    - Your profile tab should now show logged-in state

### Expected Console Logs:

```
🍎 Using native Apple Sign-In on iOS
✅ Apple Sign-In result: { response: { identityToken: "...", ... } }
🍎 Received iOS Apple Sign-In request: { hasIdentityToken: true, ... }
🔓 Decoded identity token: { sub: "...", email: "..." }
👤 User info: { appleUserId: "...", userEmail: "...", userName: "..." }
✅ User created/updated: { id: "...", email: "...", ... }
✅ Session stored in Capacitor Preferences
```

---

## Step 4: Verify Session Persistence

### Test App Restart:

1. **Close the app** (swipe up from bottom on iPhone)
2. **Reopen the app** from home screen
3. **Check if still logged in:**
    - App should remember your login
    - Profile tab should still show logged-in state
    - You shouldn't need to login again

### Check Console for:

```
📱 Mobile session found: { user: { email: "...", ... }, provider: "apple" }
```

---

## Step 5: Test Conversation History (Logged In Feature)

### Now that you're logged in:

1. Go to chat page (風鈴聊天室 tab)
2. Click the menu icon (☰) in the top-left corner
3. Conversation history sidebar should open
4. You should see your saved conversations (if any)

### Previously:

- ❌ Without login: Sidebar would prompt you to login
- ✅ With Apple Sign-In: Sidebar loads your conversations

---

## Troubleshooting

### Issue: "Sign In with Apple capability not found"

**Solution:**

- Make sure you added the capability in Xcode (Step 1)
- Check that `App.entitlements` file exists in `ios/App/App/`
- Run: `grep -r "Sign.*Apple" ios/App/App/*.entitlements`
- Should output: `<key>com.apple.developer.applesignin</key>`

### Issue: "Apple Sign-In dialog doesn't appear"

**Solution:**

- Check console for errors
- Verify Apple ID credentials in `.env`:
    ```bash
    cat .env | grep APPLE
    ```
- Make sure you're running on iOS (not web browser)

### Issue: "Login failed" toast after Apple Sign-In

**Solution:**

- Check terminal/Xcode console for error logs
- Look for server errors from `/api/auth/apple/ios`
- Verify MongoDB connection is working
- Check that `createUserIfNotExists` function is working

### Issue: Session not persisting after restart

**Solution:**

- Check if Capacitor Preferences is working:

    ```javascript
    import { Preferences } from "@capacitor/preferences";

    // In browser console or app
    const { value } = await Preferences.get({ key: "userSession" });
    console.log("Stored session:", value);
    ```

---

## How It Works

### Architecture Overview:

```
┌─────────────────────────────────────────────────────────────┐
│  1. User taps "Sign in with Apple" button                   │
│     (src/app/[locale]/auth/login/page.jsx)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Native iOS Apple Sign-In dialog appears                 │
│     (@capacitor-community/apple-sign-in)                    │
│     - User authenticates with Face ID / Touch ID / Password │
│     - Apple returns: identityToken, email, name             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Send identityToken to custom API endpoint               │
│     POST /api/auth/apple/ios                                │
│     (src/app/api/auth/apple/ios/route.ts)                   │
│     - Decode identity token (JWT)                           │
│     - Extract user info (email, Apple user ID)              │
│     - Connect to MongoDB                                    │
│     - Create or update user in database                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Store session in Capacitor Preferences                  │
│     (@capacitor/preferences)                                │
│     - Key: "userSession"                                    │
│     - Value: { user: {...}, provider: "apple", timestamp }  │
│     - Persists across app restarts                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Redirect to chat page                                   │
│     - User is now logged in                                 │
│     - Conversation history loads                            │
│     - Profile shows logged-in state                         │
└─────────────────────────────────────────────────────────────┘
```

### Session Management:

**Mobile (iOS/Android):**

- Uses Capacitor Preferences (local storage)
- Session stored as JSON in device storage
- Survives app restarts
- Hook: `useMobileAuth()` (src/hooks/useMobileAuth.ts)

**Web:**

- Uses NextAuth session (cookies)
- Standard OAuth flow with Apple
- Server-side session management

---

## Files Modified

### 1. Login Page

**File:** `src/app/[locale]/auth/login/page.jsx`

- Added imports: `SignInWithApple`, `Capacitor`, `Preferences`
- Updated `handleSignIn()` function:
    - Detects if running on iOS native platform
    - Calls native Apple Sign-In dialog
    - Sends result to custom API endpoint
    - Stores session in Capacitor Preferences

### 2. Custom API Endpoint

**File:** `src/app/api/auth/apple/ios/route.ts` (NEW)

- Receives identity token from iOS app
- Decodes JWT token
- Extracts user info
- Creates/updates user in MongoDB
- Returns user data for session storage

### 3. Mobile Auth Hook

**File:** `src/hooks/useMobileAuth.ts` (NEW)

- Custom React hook for mobile authentication
- Checks Capacitor Preferences for stored session
- Provides: `mobileSession`, `isLoading`, `clearMobileSession`
- Only runs on native platforms (iOS/Android)

---

## Next Steps

After Apple Sign-In works:

### 1. Google Sign-In Setup

- Create iOS OAuth Client ID in Google Cloud Console
- Add `NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID` to `.env`
- Update `capacitor.config.dev.ts` with `iosClientId`
- Test Google Sign-In flow

### 2. Update Chat Page to Use Mobile Session

- Import `useMobileAuth` hook
- Check `mobileSession` in addition to NextAuth `session`
- Update conversation history to load for mobile users

### 3. Test All Features with Authentication

- ✅ Send messages (already works without login)
- ✅ Conversation history sidebar
- ✅ Profile page
- ✅ Report history
- ✅ Settings

---

## Testing Checklist

- [ ] Xcode capability added
- [ ] App builds and runs in simulator
- [ ] Apple Sign-In button appears on login page
- [ ] Tapping button shows native Apple dialog
- [ ] Authentication succeeds
- [ ] Success toast appears
- [ ] Redirects to chat page
- [ ] Session persists after app restart
- [ ] Conversation history loads when logged in
- [ ] Profile shows logged-in state
- [ ] Can log out and log back in

---

## Important Notes

### Why We're Not Using NextAuth on Mobile:

- NextAuth requires server-side sessions (cookies)
- Capacitor static export doesn't support server-side features
- Solution: Use native OAuth + Capacitor Preferences for mobile
- Web version still uses NextAuth normally

### Security Considerations:

- Identity token validation is simplified (decode only)
- **Production:** Should verify token with Apple's public key
- Session stored in device secure storage (Capacitor Preferences)
- Token should have expiration and refresh mechanism

### Apple Sign-In Requirements:

- Must have Apple Developer account
- App ID must be registered with Sign In with Apple capability
- Bundle ID: `com.harmoniqfengshui` (already in .env)
- Service ID matches client ID in code

---

## Need Help?

If you encounter issues:

1. Check Xcode console for native errors
2. Check terminal for server-side errors
3. Verify all credentials in `.env` file
4. Make sure MongoDB connection is working
5. Test on real device if simulator has issues

**Current Configuration:**

- Apple ID: `com.harmoniqfengshui`
- Apple Team ID: `H2L5855PA7`
- Apple Key ID: `9ARBN3G5L4`
- ✅ All credentials present in `.env`
