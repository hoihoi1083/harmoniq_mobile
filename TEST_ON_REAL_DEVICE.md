# 📱 Testing Apple Sign-In on Real iPhone

## Why Test on Real Device?

The iOS Simulator shows the password dialog, but on a **real iPhone**, Apple Sign-In will:

- ✅ Use Face ID / Touch ID (much smoother UX)
- ✅ Show the native Apple dialog instantly
- ✅ Won't ask for password every time
- ✅ Better performance

## Steps to Deploy to Your iPhone

### 1. Connect Your iPhone to Mac

- Plug in your iPhone 17 Pro with USB cable
- Unlock your iPhone
- If prompted, tap "Trust This Computer"

### 2. Open Xcode

```bash
npx cap open ios
```

### 3. Select Your iPhone in Xcode

- At the top of Xcode window, click the device selector (next to "App")
- Select your "iPhone 17 Pro" from the list (not "Any iOS Device")
- If your device doesn't appear, make sure it's unlocked and trusted

### 4. Configure Signing (if not already)

- Click on "App" project in left sidebar
- Select "App" target
- Go to "Signing & Capabilities" tab
- If you see a signing error:
    - Click "Enable Automatic Signing"
    - Select your Apple Developer Team
    - Or choose "Personal Team" if you don't have paid developer account

### 5. Build and Run

- Click the ▶️ Run button in Xcode (or press Cmd+R)
- First time: Xcode will install the app on your iPhone
- Wait for build to complete (about 30 seconds)

### 6. Trust Developer Certificate (First Time Only)

On your iPhone:

1. Go to **Settings → General → VPN & Device Management**
2. Find your Apple ID under "Developer App"
3. Tap it and tap "Trust"
4. Confirm "Trust"

### 7. Test Apple Sign-In

1. Open the HarmoniqFengShui app on your iPhone
2. Tap "我的" tab → Login page
3. Tap "使用Apple賬號登錄"
4. **Native Apple dialog appears instantly**
5. Use Face ID / Touch ID to authenticate
6. Done! ✅

## What You'll See on Real Device

```
User taps Apple button
    ↓
Native dialog appears (no loading)
    ↓
"Sign in with Apple" dialog
"Do you want to use 'hoihoi_michael@hotmail.com'?"
[Continue with Password] [Use Different Apple ID]
    ↓
Tap "Continue with Password"
    ↓
Face ID / Touch ID prompt
    ↓
Authentication complete!
    ↓
Redirects to chat page (logged in)
```

## Troubleshooting

### "Unable to Verify App"

- Make sure you trusted the developer certificate in Settings
- Settings → General → VPN & Device Management → Trust

### "App Not Installed"

- Delete the app from iPhone if it exists
- Clean build in Xcode: Product → Clean Build Folder (Cmd+Shift+K)
- Try building again

### Device Not Showing in Xcode

- Unplug and replug the USB cable
- Unlock your iPhone
- Trust the computer again
- Restart Xcode if needed

---

## Alternative: Continue Testing in Simulator

If you want to continue testing in the simulator for now:

1. **Enter your Apple ID password** in the dialog
2. Tap "登入" button
3. Watch the console logs for:
    ```
    ✅ Apple Sign-In result: {...}
    ✅ User created/updated: {...}
    ✅ Session stored in Capacitor Preferences
    ```

**Note:** Simulator will ask for password every time. Real device with Face ID is much better!
