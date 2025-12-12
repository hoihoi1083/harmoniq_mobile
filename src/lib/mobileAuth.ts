/**
 * Mobile Authentication Service
 * Handles Google and Apple Sign In for Capacitor mobile apps
 */

import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { SignInWithApple } from "@capacitor-community/apple-sign-in";
import { Preferences } from "@capacitor/preferences";

// Check if running on native platform
export const isNativePlatform = () => {
	return Capacitor.isNativePlatform();
};

// Initialize Google Auth (call this on app startup)
export const initializeAuth = () => {
	if (isNativePlatform()) {
		GoogleAuth.initialize({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
			scopes: ["profile", "email"],
			grantOfflineAccess: true,
		});
		console.log("📱 Mobile Auth initialized");
	}
};

/**
 * Securely store authentication token
 */
export const storeAuthToken = async (token: string, userId: string) => {
	try {
		await Preferences.set({
			key: "auth_token",
			value: token,
		});
		await Preferences.set({
			key: "user_id",
			value: userId,
		});
		console.log("✅ Auth token stored securely");
	} catch (error) {
		console.error("❌ Failed to store auth token:", error);
	}
};

/**
 * Retrieve stored authentication token
 */
export const getAuthToken = async (): Promise<string | null> => {
	try {
		const { value } = await Preferences.get({ key: "auth_token" });
		return value;
	} catch (error) {
		console.error("❌ Failed to get auth token:", error);
		return null;
	}
};

/**
 * Clear authentication data
 */
export const clearAuthData = async () => {
	try {
		await Preferences.remove({ key: "auth_token" });
		await Preferences.remove({ key: "user_id" });
		await Preferences.remove({ key: "user_data" });
		console.log("✅ Auth data cleared");
	} catch (error) {
		console.error("❌ Failed to clear auth data:", error);
	}
};

/**
 * Google Sign In for Mobile
 */
export const signInWithGoogle = async () => {
	try {
		if (!isNativePlatform()) {
			throw new Error("This method is only available on mobile devices");
		}

		console.log("📱 Starting Google Sign In...");

		// Sign in with Google
		const user = await GoogleAuth.signIn();

		console.log("✅ Google Sign In successful:", user.email);

		// Get the backend API URL (use environment variable or default)
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

		// Send token to backend for verification
		const response = await fetch(`${apiUrl}/api/auth/google/mobile`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				idToken: user.authentication.idToken,
				user: {
					email: user.email,
					name: user.name,
					photo: user.imageUrl,
				},
			}),
		});

		const data = await response.json();

		if (!data.success) {
			throw new Error(data.error || "Authentication failed");
		}

		// Store authentication token
		await storeAuthToken(data.accessToken, data.user.id);

		// Store user data
		await Preferences.set({
			key: "user_data",
			value: JSON.stringify(data.user),
		});

		console.log("🎉 Google authentication completed!");

		return {
			success: true,
			user: data.user,
			token: data.accessToken,
		};
	} catch (error: any) {
		console.error("❌ Google Sign In Error:", error);
		return {
			success: false,
			error: error.message || "Failed to sign in with Google",
		};
	}
};

/**
 * Apple Sign In for Mobile (iOS only)
 */
export const signInWithApple = async () => {
	try {
		if (!isNativePlatform()) {
			throw new Error("This method is only available on mobile devices");
		}

		// Check if device supports Apple Sign In (iOS 13+)
		if (Capacitor.getPlatform() !== "ios") {
			throw new Error("Apple Sign In is only available on iOS");
		}

		console.log("🍎 Starting Apple Sign In...");

		// Sign in with Apple
		const result = await SignInWithApple.authorize({
			clientId: "com.harmoniq.fengshui",
			redirectURI: "https://harmoniq.com/auth/callback",
			scopes: "email name",
			state: "12345",
			nonce: "nonce",
		});

		console.log("✅ Apple Sign In successful");

		// Get the backend API URL
		const apiUrl =
			process.env.NEXT_PUBLIC_API_BASE_URL ||
			"https://www.harmoniqfengshui.com";

		// Send to backend for verification
		const response = await fetch(`${apiUrl}/api/auth/apple/mobile`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				identityToken: result.response.identityToken,
				authorizationCode: result.response.authorizationCode,
				user: result.response.user,
				email: result.response.email,
				fullName: result.response.givenName
					? {
							givenName: result.response.givenName,
							familyName: result.response.familyName,
						}
					: null,
			}),
		});

		const data = await response.json();

		if (!data.success) {
			throw new Error(data.error || "Authentication failed");
		}

		// Store authentication token
		await storeAuthToken(data.accessToken, data.user.id);

		// Store user data
		await Preferences.set({
			key: "user_data",
			value: JSON.stringify(data.user),
		});

		console.log("🎉 Apple authentication completed!");

		return {
			success: true,
			user: data.user,
			token: data.accessToken,
		};
	} catch (error: any) {
		console.error("❌ Apple Sign In Error:", error);
		return {
			success: false,
			error: error.message || "Failed to sign in with Apple",
		};
	}
};

/**
 * Sign Out
 */
export const signOut = async () => {
	try {
		if (isNativePlatform()) {
			// Sign out from Google if signed in
			try {
				await GoogleAuth.signOut();
			} catch (e) {
				// Ignore if not signed in with Google
			}
		}

		// Clear all auth data
		await clearAuthData();

		console.log("✅ Signed out successfully");

		return { success: true };
	} catch (error: any) {
		console.error("❌ Sign out error:", error);
		return {
			success: false,
			error: error.message || "Failed to sign out",
		};
	}
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
	const token = await getAuthToken();
	return !!token;
};

/**
 * Get current user data
 */
export const getCurrentUser = async () => {
	try {
		const { value } = await Preferences.get({ key: "user_data" });
		if (value) {
			return JSON.parse(value);
		}
		return null;
	} catch (error) {
		console.error("❌ Failed to get current user:", error);
		return null;
	}
};
