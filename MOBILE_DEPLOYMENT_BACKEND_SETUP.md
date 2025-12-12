# 📱 Mobile App Backend Deployment Guide

## Current Architecture

```
┌─────────────────────────────────────┐
│  Mobile App (iOS/Android)           │
│  - Static HTML/CSS/JS                │
│  - Points to: www.harmoniqfengshui.com │
└─────────────┬───────────────────────┘
              │ All API calls via HTTPS
              ↓
┌─────────────────────────────────────┐
│  Production Server                   │
│  www.harmoniqfengshui.com           │
│  - Next.js Server                    │
│  - API Routes (/api/*)               │
│  - Mobile Auth Detection             │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│  External Services                   │
│  - MongoDB Atlas                     │
│  - Stripe API                        │
│  - OpenAI API                        │
└─────────────────────────────────────┘
```

---

## ✅ Current Setup (What You Have)

### Capacitor Config

```typescript
// capacitor.config.prod.ts
server: {
  url: "https://www.harmoniqfengshui.com",
  cleartext: false, // HTTPS only
  androidScheme: "https",
}
```

**This means:**

- Mobile app loads from `https://www.harmoniqfengshui.com`
- All API calls automatically go to same server
- No CORS issues (same origin)

---

## 🚀 DEPLOYMENT OPTIONS

### Option 1: Single Server (Current - Recommended)

**Pros:**

- ✅ Simple architecture
- ✅ No CORS issues
- ✅ Single deployment
- ✅ Shared database and logic
- ✅ Lower cost

**Cons:**

- ⚠️ Server must always be running
- ⚠️ Mobile and web share resources

**When to use:**

- Your current setup is perfect for this
- Most apps use this approach

---

### Option 2: Separate Mobile Backend (If Needed Later)

**Architecture:**

```
Mobile App → api.harmoniqfengshui.com (Mobile-specific backend)
Web App   → www.harmoniqfengshui.com (Web backend)
Both      → Shared MongoDB Atlas
```

**When you might need this:**

- Different scaling requirements
- Mobile needs special endpoints
- Want to version mobile API separately

**Setup steps if needed:**

1. Create new EC2 instance or Amplify app
2. Deploy only API routes (no frontend)
3. Update Capacitor config to point to new URL
4. Configure CORS to allow mobile app

---

## 🔧 REQUIRED SERVER CONFIGURATION

### 1. Ensure Server is Always Running

**Check current setup:**

```bash
# SSH into your server
ssh your-server

# Check if Next.js is running
ps aux | grep next
pm2 list  # If using PM2

# If not running, start it
npm run start
# OR
pm2 start ecosystem.config.json
```

### 2. Verify Environment Variables

**On your production server, ensure these are set:**

```bash
# Required for mobile app
NEXTAUTH_URL=https://www.harmoniqfengshui.com
NEXTAUTH_SECRET=your-secret-key

# Database
MONGODB_URI=mongodb+srv://...

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI
OPENAI_API_KEY=sk-...

# Google OAuth
NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Optional: Separate mobile API URL (leave empty to use same server)
NEXT_PUBLIC_API_URL=
```

### 3. Test Backend Accessibility

**From your mobile device browser, test these URLs:**

```
✅ https://www.harmoniqfengshui.com
   Should load homepage

✅ https://www.harmoniqfengshui.com/api/auth/session
   Should return JSON (even if null session)

✅ https://www.harmoniqfengshui.com/zh-TW/price
   Should load pricing page

❌ Should NOT have certificate errors
❌ Should NOT have CORS errors
```

---

## 📱 MOBILE-SPECIFIC API REQUIREMENTS

### APIs That Must Work for Mobile

1. **Authentication:**

    - `/api/auth/google/mobile` ✅ Already implemented
    - `/api/auth/apple/mobile` ✅ Already implemented
    - `/api/auth/session` ✅ Works

2. **Payments:**

    - `/api/payment-couple` ✅ Mobile flag support added
    - `/api/checkoutSessions/payment4` ✅ Mobile flag support added
    - `/api/verify-payment` ✅ No auth required (fixed)

3. **Data Entry:**

    - `/api/get-user-birthday` ✅ Returns empty if no auth (fixed)
    - No other special requirements

4. **Reports:**
    - Uses same APIs as web
    - Should work automatically

---

## 🔄 IF YOU NEED SEPARATE MOBILE BACKEND

### Setup Steps

1. **Create new Next.js API-only project:**

```bash
# New project folder
mkdir harmoniq-mobile-backend
cd harmoniq-mobile-backend

# Initialize
npm init -y
npm install next react react-dom

# Create minimal setup
mkdir -p src/app/api
# Copy only your API routes from main project
```

2. **Update Capacitor config:**

```typescript
// capacitor.config.prod.ts
server: {
  url: "https://api.harmoniqfengshui.com",  // New mobile backend
  cleartext: false,
}
```

3. **Configure CORS on new backend:**

```javascript
// src/middleware.js
export function middleware(request) {
	const response = NextResponse.next();

	// Allow mobile app
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE"
	);
	response.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);

	return response;
}
```

4. **Deploy new backend:**

```bash
# Deploy to separate EC2 or Amplify
npm run build
npm run start
```

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### Before submitting to stores:

- [ ] **Backend server is running 24/7**

    ```bash
    # Use PM2 or similar for auto-restart
    pm2 start npm --name "harmoniq-backend" -- start
    pm2 save
    pm2 startup
    ```

- [ ] **Test from actual device:**

    - [ ] Open Xcode → Run on real iPhone
    - [ ] Test Google login
    - [ ] Test Apple login
    - [ ] Complete a payment flow
    - [ ] Generate a report

- [ ] **SSL certificate is valid:**

    ```bash
    # Check certificate
    curl -v https://www.harmoniqfengshui.com 2>&1 | grep -i "certificate"

    # Should NOT show expired or invalid
    ```

- [ ] **All environment variables set:**

    ```bash
    # On server
    env | grep -E "NEXTAUTH|MONGODB|STRIPE|OPENAI"
    ```

- [ ] **Database is accessible:**

    ```bash
    # Test MongoDB connection
    node -e "require('mongodb').MongoClient.connect(process.env.MONGODB_URI).then(() => console.log('✅ DB Connected')).catch(e => console.log('❌ DB Error:', e.message))"
    ```

- [ ] **Stripe webhooks configured:**
    - Go to Stripe Dashboard
    - Add webhook: `https://www.harmoniqfengshui.com/api/webhooks/stripe`
    - Events: `checkout.session.completed`

---

## 🐛 TROUBLESHOOTING

### Issue: Mobile app shows blank screen

**Cause:** Server not running or SSL error

**Fix:**

```bash
# Check if server is accessible
curl https://www.harmoniqfengshui.com

# Check server logs
pm2 logs harmoniq-backend

# Restart server
pm2 restart harmoniq-backend
```

### Issue: "Unable to connect to server"

**Cause:** Capacitor config pointing to wrong URL

**Fix:**

```bash
# Verify capacitor.config.ts
cat capacitor.config.ts | grep "url:"

# Should show production URL, not localhost
# If wrong, update and rebuild:
cp capacitor.config.prod.ts capacitor.config.ts
npm run build:mobile
npx cap sync ios
```

### Issue: Login works in browser but not in app

**Cause:** OAuth credentials not configured for mobile

**Fix:**

- Check Google OAuth: Add iOS bundle ID
- Check Apple Sign In: Configure in Apple Developer

### Issue: Payments fail on mobile

**Cause:** Mobile flag not being sent

**Fix:**

- Already fixed in previous updates
- Verify by checking server logs during payment

---

## 📊 MONITORING SETUP

### Add Backend Monitoring

```javascript
// Add to your API routes
console.log("📱 Mobile Request:", {
	path: request.url,
	userAgent: request.headers.get("user-agent"),
	isMobile: request.headers.get("user-agent")?.includes("Capacitor"),
});
```

### PM2 Monitoring

```bash
# View logs
pm2 logs harmoniq-backend

# View metrics
pm2 monit

# View status
pm2 status
```

### Uptime Monitoring (Recommended)

Use services like:

- **UptimeRobot** (free): Check if server is up
- **Sentry**: Track errors
- **LogRocket**: Record mobile sessions

---

## 🎯 RECOMMENDED ARCHITECTURE (Your Current Setup)

```
┌──────────────────────────────────────────────────┐
│  iOS App Store + Google Play Store               │
│                                                   │
│  Users download: HarmoniqFengShui                │
└─────────────────┬────────────────────────────────┘
                  │
                  │ App points to:
                  │ https://www.harmoniqfengshui.com
                  │
                  ↓
┌──────────────────────────────────────────────────┐
│  Single Production Server                        │
│  www.harmoniqfengshui.com                       │
│                                                   │
│  ┌────────────────────────────────────────────┐ │
│  │  Next.js Application                       │ │
│  │  - Serves web version                      │ │
│  │  - Serves mobile static files              │ │
│  │  - API routes handle both web & mobile    │ │
│  │  - Mobile auth detection built-in         │ │
│  └────────────────────────────────────────────┘ │
│                                                   │
│  Environment Variables:                          │
│  - NEXTAUTH_URL                                  │
│  - MONGODB_URI                                   │
│  - STRIPE_SECRET_KEY                             │
│  - OPENAI_API_KEY                                │
│  - etc.                                          │
└─────────────────┬────────────────────────────────┘
                  │
                  ↓
┌──────────────────────────────────────────────────┐
│  External Services                               │
│  - MongoDB Atlas (Database)                      │
│  - Stripe (Payments)                             │
│  - OpenAI (AI Analysis)                          │
└──────────────────────────────────────────────────┘
```

**Why this works:**
✅ Mobile app loads static files from server
✅ API calls automatically go to same server (no CORS)
✅ Same database for web and mobile users
✅ Single codebase to maintain
✅ Lower hosting costs

**Your server must:**

- Run 24/7 (use PM2 or similar)
- Have valid SSL certificate
- Have all environment variables configured
- Be accessible from mobile networks

---

## 🚀 DEPLOYMENT COMMANDS

```bash
# 1. Ensure production config is active
cp capacitor.config.prod.ts capacitor.config.ts

# 2. Build mobile app
npm run build:mobile

# 3. Open and test
npx cap open ios

# 4. Before submitting to stores, verify server:
curl -I https://www.harmoniqfengshui.com
# Should return: HTTP/2 200

# 5. Test API endpoints:
curl https://www.harmoniqfengshui.com/api/auth/session
# Should return: {"user":null} or user data

# 6. If server is down, SSH and start:
ssh your-server
pm2 start ecosystem.config.json
pm2 save
```

---

## ✅ FINAL VERIFICATION

Before submitting to app stores:

1. **Build production mobile app:**

    ```bash
    cp capacitor.config.prod.ts capacitor.config.ts
    npm run build:mobile
    ```

2. **Test on real device (not simulator):**

    - Open Xcode
    - Connect iPhone
    - Run on device
    - Test all flows

3. **Verify server logs show mobile requests:**

    ```bash
    pm2 logs harmoniq-backend --lines 50
    ```

4. **Confirm no errors in mobile app:**

    - Check Xcode console for errors
    - Check Network tab in Safari Web Inspector

5. **Test offline behavior:**
    - Turn off wifi
    - App should show appropriate error messages

---

**Your current setup is already correct! Just ensure your production server is always running before deploying to stores.** 🚀
