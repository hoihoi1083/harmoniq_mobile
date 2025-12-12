# 📱 Mobile App Architecture - The CORRECT Way

## ❌ What DOESN'T Work

### Option 1: Static Export (Current Attempt)

```
Mobile App (capacitor://localhost)
└── Loads static HTML files
└── ❌ Navigation BREAKS (RSC errors)
└── ❌ Can't fetch RSC payloads
```

**Why it fails:** Next.js with RSC requires a server. Static export can't handle navigation.

---

## ✅ What ACTUALLY Works

You have **2 real solutions**:

### **Solution 1: Load Everything from Live Server**

_This is what you had working before!_

```
Mobile App
└── Loads from: https://www.harmoniqfengshui.com
└── ✅ All navigation works
└── ✅ All APIs work
└── ❌ Gets WEB UI (no mobile navbar/bottom tabs)
```

**Problem:** FengShuiLayout (deployed) doesn't have mobile UI components.

---

### **Solution 2: Deploy Mobile App Frontend to Same Domain** ⭐ **RECOMMENDED**

```
Architecture:
┌─────────────────────────────────────────┐
│  www.harmoniqfengshui.com               │
├─────────────────────────────────────────┤
│  Frontend: FengShuiLayout-mobileapp     │
│  - Mobile UI (navbar, bottom tabs)      │
│  - Next.js pages with RSC               │
│  - Client components                    │
├─────────────────────────────────────────┤
│  Backend: API Routes from FengShuiLayout│
│  - /api/smart-chat2                     │
│  - /api/payment-couple                  │
│  - /api/auth/*                          │
│  - Database connections                 │
└─────────────────────────────────────────┘
```

**How it works:**

1. Deploy `FengShuiLayout-mobileapp` to www.harmoniqfengshui.com
2. Keep all API routes from `FengShuiLayout` (merge them)
3. Mobile app loads from live server → gets mobile UI + working navigation
4. All APIs work because they're on same domain

---

## 🔧 Implementation Steps

### **Step 1: Merge API Routes**

Copy all `/api` folders from FengShuiLayout to FengShuiLayout-mobileapp:

```bash
# From FengShuiLayout backend
FengShuiLayout/src/app/api/
├── smart-chat2/
├── payment-couple/
├── auth/
├── verify-payment/
└── ... (all other APIs)

# Copy to mobile app
FengShuiLayout-mobileapp/src/app/api/
├── smart-chat2/        # ← Copy from FengShuiLayout
├── payment-couple/     # ← Copy from FengShuiLayout
├── auth/              # ← Copy from FengShuiLayout
└── ...
```

### **Step 2: Configure Mobile App**

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
	appId: "com.harmoniq.windbell",
	appName: "風鈴聊天室",
	webDir: "out",
	server: {
		url: "https://www.harmoniqfengshui.com", // Load from deployed mobile app
		cleartext: true,
		androidScheme: "https",
	},
};
```

### **Step 3: Deploy**

```bash
# Build mobile app
pnpm run build

# Deploy to www.harmoniqfengshui.com
# (Replace FengShuiLayout deployment with FengShuiLayout-mobileapp)
```

### **Step 4: Mobile App Build**

```bash
# Sync to iOS
npx cap sync ios

# Open Xcode
npx cap open ios

# Build → Should now load mobile UI from live server
```

---

## 🎯 Result

✅ Mobile UI (navbar, bottom tabs) from FengShuiLayout-mobileapp  
✅ All APIs work (merged from FengShuiLayout)  
✅ Navigation works (Next.js server handles RSC)  
✅ No RSC payload errors  
✅ Chatbot works  
✅ Payments work  
✅ Auth works

---

## 📋 Alternative: Keep Both Codebases Separate

If you want to keep FengShuiLayout as web backend:

1. Run FengShuiLayout on: `api.harmoniqfengshui.com`
2. Run FengShuiLayout-mobileapp on: `www.harmoniqfengshui.com`
3. Configure CORS to allow cross-origin API calls
4. Update all API calls to use `https://api.harmoniqfengshui.com/api/...`

**This is more complex but keeps codebases separate.**

---

## 🚨 Bottom Line

**You CANNOT use static export with RSC navigation.** You must either:

1. Deploy the mobile app as a Next.js server (Solution 2)
2. Convert all pages to client components (massive refactor)
3. Use the web version from live server (no mobile UI)

**I recommend Solution 2:** Deploy FengShuiLayout-mobileapp to www.harmoniqfengshui.com with merged API routes.
