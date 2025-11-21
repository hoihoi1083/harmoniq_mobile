import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

export interface MobileSession {
	user: {
		id: string;
		email: string;
		name: string;
		userId: string;
	};
	provider: string;
	timestamp: number;
}

/**
 * 🔥 MOBILE FIX: Custom hook for mobile authentication
 * This handles native iOS/Android authentication using Capacitor Preferences
 * when NextAuth session is not available (static export mode).
 */
export function useMobileAuth() {
	const [mobileSession, setMobileSession] = useState<MobileSession | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Safety check for server-side rendering
		if (typeof window === "undefined") {
			setIsLoading(false);
			return;
		}

		// Only check for mobile session on native platforms
		if (!Capacitor.isNativePlatform()) {
			setIsLoading(false);
			return;
		}

		async function checkMobileSession() {
			try {
				const { value } = await Preferences.get({ key: "userSession" });

				if (value) {
					const session: MobileSession = JSON.parse(value);
					console.log("📱 Mobile session found:", session);
					setMobileSession(session);
				} else {
					console.log("📱 No mobile session found");
				}
			} catch (error) {
				console.error("❌ Error checking mobile session:", error);
			} finally {
				setIsLoading(false);
			}
		}

		checkMobileSession();
	}, []);

	const clearMobileSession = async () => {
		try {
			await Preferences.remove({ key: "userSession" });
			setMobileSession(null);
			console.log("✅ Mobile session cleared");
		} catch (error) {
			console.error("❌ Error clearing mobile session:", error);
		}
	};

	return {
		mobileSession,
		isLoading,
		clearMobileSession,
		isMobile:
			typeof window !== "undefined"
				? Capacitor.isNativePlatform()
				: false,
	};
}
