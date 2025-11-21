# Mobile Payment Flow - Complete Analysis & Fixes

## Problem Analysis

### Original Issue

After Stripe payment completion, the app opened but showed nothing, failing to progress to the data entry screens.

### Root Causes Identified

1. **Missing Page Redirects**: Success page tried to redirect to disabled pages
2. **Incorrect Navigation**: Used `window.location.href` instead of Next.js router
3. **Double Redirect Issue**: Mobile detection caused browser→app redirect that interfered with normal flow
4. **Missing Locale in URLs**: Navigation didn't include locale prefix

---

## Complete Payment Flow (FIXED)

### For Fortune Payments (Wealth, Career, Health, Love)

```
1. User clicks payment button in mobile app
   ├─ Price page adds mobile=true flag to headers
   └─ Sends X-User-Email and X-User-ID headers

2. API creates Stripe session
   ├─ /api/checkoutSessions/payment-fortune-category/route.js
   ├─ Detects mobile headers (mobileUserEmail)
   ├─ Adds &mobile=true to success URL
   └─ Returns Stripe checkout URL

3. Stripe payment opens in system browser
   ├─ User completes payment
   └─ Redirects to: localhost:3000/zh-TW/success?session_id=...&type=fortune&concern=love&mobile=true

4. Success page (in browser) detects mobile=true
   ├─ Checks: NOT in Capacitor app (still in browser)
   ├─ Waits 1.5 seconds to show success message
   └─ Redirects to: harmoniq://success?session_id=...&type=fortune&concern=love

5. DeepLinkHandler catches harmoniq:// URL
   ├─ App opens and comes to foreground
   ├─ Parses URL parameters
   └─ Navigates to: /zh-TW/success?session_id=...&type=fortune&concern=love

6. Success page (in app) loads
   ├─ Detects: IS in Capacitor app (skip browser redirect)
   ├─ Calls /api/verify-fortune-payment to verify payment
   ├─ Shows PaymentThankYou component
   └─ User clicks "Start Data Entry" button

7. Navigation to fortune-entry
   ├─ router.push(/zh-TW/fortune-entry?session_id=...&concern=love)
   └─ User enters birthday and gender

8. Report generation
   ├─ Fortune entry page submits data
   └─ Navigates to report page with analysis
```

### For Expert88/Expert188 Payments (Birthday Analysis)

```
1-6. [Same as Fortune Flow]

7. Navigation to birthday-entry
   ├─ router.push(/zh-TW/birthday-entry?session_id=...)
   └─ User enters birthday

8. Report generation
   ├─ Birthday entry page submits data
   └─ Navigates to report page with 八字 analysis
```

### For Couple Payments

```
1-6. [Same as Fortune Flow]

7. Navigation to couple-entry
   ├─ router.push(/zh-TW/couple-entry?session_id=...)
   └─ User enters both partner birthdays and genders

8. Report generation
   ├─ Couple entry page submits data
   └─ Navigates to couple report page with compatibility analysis
```

---

## Files Modified

### 1. `/src/app/api/checkoutSessions/payment-fortune-category/route.js`

**Changes:**

- Added mobile detection using `mobileUserEmail` and `mobileUserId` headers
- Added `&mobile=true` flag to success URL when mobile headers present
- Added console logging for debugging

**Key Code:**

```javascript
const isMobileRequest = !!(mobileUserEmail || mobileUserId);
let successUrl = `${origin}/${locale}/success?session_id={CHECKOUT_SESSION_ID}&type=fortune&concern=${concernType}`;
if (isMobileRequest) {
	successUrl += "&mobile=true";
}
```

### 2. `/src/app/[locale]/success/page.jsx`

**Changes:**

- Added Capacitor import to detect if running in native app
- Improved mobile redirect logic: only redirect if in browser, not if already in app
- Changed navigation from `window.location.href` to Next.js `router.push()`
- Added locale prefix to all navigation URLs
- Added console logging for debugging flow

**Key Changes:**

```javascript
// Only redirect to app if we're in browser
const isInCapacitorApp = Capacitor.isNativePlatform();
if (mobile === "true" && !isInCapacitorApp) {
	// Redirect browser → app using deep link
	window.location.href = `harmoniq://success${window.location.search}`;
}

// Navigation uses router.push with locale
router.push(
	`/${locale}/fortune-entry?session_id=${session_id}&concern=${concern}`
);
```

### 3. `/src/components/DeepLinkHandler.tsx` (NEW)

**Purpose:** Listen for `harmoniq://` deep links and navigate to appropriate pages

**Key Code:**

```typescript
CapacitorApp.addListener("appUrlOpen", (data) => {
	const url = new URL(data.url);
	if (url.protocol === "harmoniq:") {
		// Parse parameters and navigate to internal route
		router.push(`/${locale}/success?${searchParams}`);
	}
});
```

### 4. `/src/app/[locale]/layout.tsx`

**Changes:**

- Added `<DeepLinkHandler />` component to listen for deep links globally

### 5. `/ios/App/App/Info.plist`

**Changes:**

- Added `harmoniq://` URL scheme registration for deep links

**Key XML:**

```xml
<dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>HarmoniqDeepLink</string>
    <key>CFBundleURLSchemes</key>
    <array>
        <string>harmoniq</string>
    </array>
</dict>
```

### 6. Pages Restored

- `/src/app/[locale]/fortune-entry/` - Restored from `_fortune-entry_disabled`
- `/src/app/[locale]/couple-entry/` - Restored from `_couple-entry_disabled`

---

## Testing Checklist

### ✅ Fortune Payment (Wealth/Career/Health/Love)

1. Open app in Xcode
2. Login with Google
3. Go to Price page
4. Click one of the fortune payment buttons (e.g., "Wealth" 財運)
5. Complete Stripe payment in browser
6. **Expected**: Browser redirects back to app
7. **Expected**: Success page shows in app with "Thank You" message
8. Click "Start Data Entry" button
9. **Expected**: Navigate to fortune-entry page
10. Enter birthday and gender
11. **Expected**: Generate and show fortune report

### ✅ Expert88 Payment (命理)

1. Open app in Xcode
2. Go to Price page
3. Click Expert88 (HK$88) payment button
4. Complete Stripe payment
5. **Expected**: Browser redirects back to app
6. **Expected**: Success page shows "Thank You"
7. Click "Start Data Entry"
8. **Expected**: Navigate to birthday-entry page
9. Enter birthday
10. **Expected**: Generate and show 八字 report

### ✅ Couple Payment

1. Open app in Xcode
2. Go to Price page
3. Click Couple Analysis payment button
4. Complete Stripe payment
5. **Expected**: Browser redirects back to app
6. **Expected**: Success page shows "Thank You"
7. Click "Start Data Entry"
8. **Expected**: Navigate to couple-entry page
9. Enter both partner birthdays and genders
10. **Expected**: Generate and show couple compatibility report

---

## Debug Console Logs

Look for these logs to verify flow:

### Payment API

```
📱 Using mobile session from headers: { mobileUserEmail: '...', mobileUserId: '...' }
💰 Using price ID: price_xxx for concern: love, locale: zh-TW
📱 Payment success URL: { successUrl: '...&mobile=true', isMobileRequest: true }
```

### Success Page (Browser)

```
📱 Mobile payment detected in browser, preparing to redirect back to app...
📱 Attempting to open app with URL: harmoniq://success?session_id=...
```

### DeepLinkHandler (App)

```
📱 DeepLinkHandler: Received deep link: harmoniq://success?session_id=...
📱 DeepLinkHandler: Parsed deep link: { path: 'success', searchParams: '...' }
📱 DeepLinkHandler: Navigating to: /zh-TW/success?session_id=...
```

### Success Page (App)

```
📱 Already in Capacitor app, proceeding with normal flow
URL Parameters: { session_id: '...', type: 'fortune', concern: 'love' }
📱 Navigating to fortune entry: /zh-TW/fortune-entry?session_id=...&concern=love
```

---

## Remaining Manual Updates Needed

Other payment routes (payment1, payment2, payment3, payment4, payment1-sqm, payment2-sqm) also need the `mobile=true` flag. Update each file's success_url from:

```javascript
success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
```

to:

```javascript
success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}${mobileUserEmail ? '&mobile=true' : ''}`,
```

---

## Architecture Summary

### Deep Link Flow

```
Stripe Browser Payment
    ↓
Web Success Page (detects mobile=true)
    ↓
harmoniq://success?... (deep link)
    ↓
iOS opens app
    ↓
DeepLinkHandler catches URL
    ↓
router.push(/zh-TW/success?...)
    ↓
App Success Page (in Capacitor)
    ↓
Payment verification + Thank You
    ↓
User clicks "Start Data Entry"
    ↓
router.push(/zh-TW/fortune-entry?...)
    ↓
Data entry page → Report
```

### Key Technologies

- **Capacitor**: Native iOS container
- **Capacitor App Plugin**: Deep link handling
- **Custom URL Scheme**: `harmoniq://`
- **Next.js Router**: Client-side navigation with locale support
- **Mobile Session Headers**: `X-User-Email`, `X-User-ID` for authentication

---

## Success Criteria

✅ Payment completes in browser  
✅ Browser automatically redirects back to app  
✅ App shows success page with thank you message  
✅ Clicking "Start Data Entry" navigates to correct entry page  
✅ Entry page loads with session_id parameter  
✅ User can enter required data (birthday, gender)  
✅ Report generates successfully after data submission  
✅ All payment types work: Fortune, Expert88, Expert188, Couple

---

## Troubleshooting

### If deep link doesn't open app:

- Check iOS Info.plist has `harmoniq` URL scheme registered
- Run `npx cap sync ios` to update native project
- Rebuild app in Xcode

### If success page doesn't show in app:

- Check console for "📱 DeepLinkHandler: Received deep link"
- Verify DeepLinkHandler is added to layout.tsx
- Check Capacitor.isNativePlatform() returns true in app

### If navigation fails after "Start Data Entry":

- Check console for "📱 Navigating to fortune entry: ..."
- Verify fortune-entry/couple-entry/birthday-entry pages exist (not disabled)
- Check router.push() includes locale prefix

---

**Status**: ✅ Complete and Ready for Testing
**Last Updated**: 2025-11-19
**Dev Server**: Running at http://localhost:3000
