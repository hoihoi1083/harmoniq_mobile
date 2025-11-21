# Integrating Bottom Tab Navigation

## 📱 Replace Navbar with Mobile-Friendly Bottom Tabs

This guide shows you how to add the bottom tab navigation to your app and remove the top navbar for mobile.

---

## Step 1: Update Your Root Layout

Edit your root layout to conditionally show bottom navigation:

**File: `src/app/[locale]/layout.tsx`**

```tsx
import { Capacitor } from "@capacitor/core";
import Navbar from "@/components/Navbar";
import BottomTabNavigation from "@/components/BottomTabNavigation";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Check if running on mobile
	const isMobile =
		typeof window !== "undefined" && Capacitor.isNativePlatform();

	return (
		<html>
			<body>
				{/* Show Navbar only on web */}
				{!isMobile && <Navbar />}

				{/* Main content with padding for bottom nav on mobile */}
				<main className={isMobile ? "pb-20" : ""}>{children}</main>

				{/* Show Bottom Tab Navigation only on mobile */}
				{isMobile && <BottomTabNavigation />}
			</body>
		</html>
	);
}
```

---

## Step 2: Create a Mobile Check Hook (Optional but Recommended)

**File: `src/hooks/useMobilePlatform.ts`**

```typescript
"use client";

import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

export function useMobilePlatform() {
	const [isMobile, setIsMobile] = useState(false);
	const [platform, setPlatform] = useState<"ios" | "android" | "web">("web");

	useEffect(() => {
		const isNative = Capacitor.isNativePlatform();
		setIsMobile(isNative);
		setPlatform(Capacitor.getPlatform() as "ios" | "android" | "web");
	}, []);

	return {
		isMobile,
		platform,
		isIOS: platform === "ios",
		isAndroid: platform === "android",
	};
}
```

**Usage:**

```tsx
"use client";

import { useMobilePlatform } from "@/hooks/useMobilePlatform";

export default function MyComponent() {
	const { isMobile, isIOS } = useMobilePlatform();

	return (
		<div>
			{isMobile ? "Mobile View" : "Web View"}
			{isIOS && <AppleSpecificFeature />}
		</div>
	);
}
```

---

## Step 3: Update Individual Page Layouts

For pages that have their own navigation, conditionally hide it on mobile:

**Example: Chat page**

```tsx
"use client";

import { useMobilePlatform } from "@/hooks/useMobilePlatform";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
	const { isMobile } = useMobilePlatform();

	return (
		<>
			{!isMobile && <Navbar from="chat" />}

			<div
				className={`chat-container ${isMobile ? "mobile-layout" : "web-layout"}`}
			>
				{/* Your chat content */}
			</div>
		</>
	);
}
```

---

## Step 4: Add Mobile-Specific Styles

**File: `src/app/globals.css`**

```css
/* Mobile-specific styles */
@media (max-width: 768px) {
	/* Add padding at bottom for tab navigation */
	.main-content {
		padding-bottom: 5rem; /* 80px for bottom nav */
	}
}

/* Safe area support for iPhone notch */
.safe-area-bottom {
	padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
	padding-top: env(safe-area-inset-top);
}

/* Mobile navigation transitions */
.mobile-nav-transition {
	transition: transform 0.3s ease-in-out;
}

/* Hide scrollbar on mobile for cleaner look */
@supports (-webkit-overflow-scrolling: touch) {
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
}
```

---

## Step 5: Customize Bottom Tab Items

Edit `src/components/BottomTabNavigation.tsx` to match your app structure:

```tsx
const tabs: TabItem[] = [
	{
		name: "home",
		path: `/${locale}`,
		icon: <Home className="w-6 h-6" />,
		label: "首頁",
	},
	{
		name: "chat",
		path: `/${locale}/chat`,
		icon: <MessageSquare className="w-6 h-6" />,
		label: "聊天",
	},
	{
		name: "reports",
		path: `/${locale}/report-history`,
		icon: <FileText className="w-6 h-6" />,
		label: "報告",
	},
	{
		name: "profile",
		path: `/${locale}/profile`,
		icon: <User className="w-6 h-6" />,
		label: "我的",
	},
];
```

**Add more tabs as needed:**

```tsx
{
  name: "analysis",
  path: `/${locale}/couple-analysis`,
  icon: <Heart className="w-6 h-6" />,
  label: "分析",
}
```

---

## Step 6: Handle Deep Links to Specific Tabs

When a user taps a notification or deep link, ensure the correct tab is highlighted:

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TabHighlighter() {
	const pathname = usePathname();

	useEffect(() => {
		// Scroll to top when changing tabs
		window.scrollTo(0, 0);

		// Optional: Track tab changes with analytics
		console.log("Tab changed to:", pathname);
	}, [pathname]);

	return null;
}
```

Add to your layout:

```tsx
<BottomTabNavigation />
<TabHighlighter />
```

---

## Step 7: Test Your Navigation

### In Browser (Testing):

1. Open dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Choose mobile device
4. Resize to see responsive behavior

### In Simulator/Device:

1. Build: `npm run build:mobile`
2. Open: `npm run cap:open:ios`
3. Run in Xcode
4. Tap different tabs and verify navigation

---

## 🎨 Styling Variations

### Material Design Style (Android-like):

```tsx
// In BottomTabNavigation.tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg">
	<div className="flex justify-around items-center h-16 px-2">
		{tabs.map((tab) => {
			const active = isActive(tab.path);
			return (
				<button
					key={tab.name}
					onClick={() => handleTabClick(tab.path)}
					className={`flex flex-col items-center justify-center p-2 flex-1 ${
						active ? "text-[#086E56]" : "text-gray-600"
					}`}
				>
					{tab.icon}
					<span className="text-xs mt-1">{tab.label}</span>
				</button>
			);
		})}
	</div>
</nav>
```

### iOS Style with Blur:

```tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-t border-gray-200">
	{/* ... tab content ... */}
</nav>
```

---

## 🔧 Advanced: Badge Notifications

Add notification badges to tabs:

```tsx
interface TabItem {
	name: string;
	path: string;
	icon: React.ReactNode;
	label: string;
	badge?: number; // Add badge count
}

// In render:
<button className="relative">
	{tab.icon}
	{tab.badge && tab.badge > 0 && (
		<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
			{tab.badge > 99 ? "99+" : tab.badge}
		</span>
	)}
	<span>{tab.label}</span>
</button>;
```

---

## 🚀 Next Steps

1. ✅ Bottom navigation is now working
2. Test on both iOS and Android
3. Customize colors and styles
4. Add haptic feedback on tab press (iOS)
5. Implement badge notifications

---

## 📱 Pro Tips

### Smooth Scrolling Between Tabs:

```tsx
const handleTabClick = (path: string) => {
	window.scrollTo({ top: 0, behavior: "smooth" });
	router.push(path);
};
```

### Haptic Feedback (iOS):

```bash
npm install @capacitor/haptics
```

```tsx
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const handleTabClick = async (path: string) => {
	await Haptics.impact({ style: ImpactStyle.Light });
	router.push(path);
};
```

### Remember Last Active Tab:

```tsx
import { Preferences } from "@capacitor/preferences";

const saveActiveTab = async (tab: string) => {
	await Preferences.set({ key: "activeTab", value: tab });
};

const getActiveTab = async () => {
	const { value } = await Preferences.get({ key: "activeTab" });
	return value;
};
```

---

## ✅ Checklist

- [ ] Bottom navigation component created
- [ ] Root layout updated
- [ ] Navbar hidden on mobile
- [ ] Proper spacing for bottom nav
- [ ] Tab items customized for your app
- [ ] Active state styling works
- [ ] Tested on iOS simulator
- [ ] Tested on Android emulator
- [ ] Safe area insets handled (iPhone notch)
- [ ] Navigation smooth and responsive

---

Your app now has professional mobile navigation! 🎉
