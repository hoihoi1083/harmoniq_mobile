"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import {
	signInWithGoogle,
	signInWithApple,
	initializeAuth,
	isAuthenticated,
} from "@/lib/mobileAuth";

/**
 * Mobile-specific login page
 * Uses native Google and Apple authentication SDKs
 * Falls back to web authentication if not on mobile
 */
export default function MobileLoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Check if running on native platform
		const isNative = Capacitor.isNativePlatform();
		setIsMobile(isNative);

		if (isNative) {
			// Initialize mobile authentication
			initializeAuth();
		}

		// Check if already authenticated
		checkAuth();
	}, []);

	const checkAuth = async () => {
		if (await isAuthenticated()) {
			router.push("/");
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		setError("");

		try {
			if (isMobile) {
				// Use native Google Sign In
				const result = await signInWithGoogle();

				if (result.success) {
					console.log("✅ Signed in successfully:", result.user);
					router.push("/");
				} else {
					setError(result.error || "Failed to sign in");
				}
			} else {
				// Fall back to web auth (NextAuth)
				const { signIn } = await import("next-auth/react");
				await signIn("google", { callbackUrl: "/" });
			}
		} catch (err: any) {
			console.error("Google Sign In Error:", err);
			setError(err.message || "Failed to sign in with Google");
		} finally {
			setLoading(false);
		}
	};

	const handleAppleSignIn = async () => {
		setLoading(true);
		setError("");

		try {
			if (isMobile) {
				// Check platform
				if (Capacitor.getPlatform() !== "ios") {
					setError("Apple Sign In is only available on iOS");
					setLoading(false);
					return;
				}

				// Use native Apple Sign In
				const result = await signInWithApple();

				if (result.success) {
					console.log("✅ Signed in successfully:", result.user);
					router.push("/");
				} else {
					setError(result.error || "Failed to sign in");
				}
			} else {
				// Fall back to web auth
				const { signIn } = await import("next-auth/react");
				await signIn("apple", { callbackUrl: "/" });
			}
		} catch (err: any) {
			console.error("Apple Sign In Error:", err);
			setError(err.message || "Failed to sign in with Apple");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-[#086E56] to-[#25826D]">
			<div className="w-full max-w-md p-8 space-y-8 bg-white shadow-2xl rounded-3xl">
				{/* Logo */}
				<div className="flex flex-col items-center">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-12 h-12 rounded-full bg-[#086E56] flex items-center justify-center">
							<span className="text-2xl text-white">風</span>
						</div>
						<span className="text-3xl font-bold text-[#086E56]">
							HarmoniQ
						</span>
					</div>
					<p className="text-sm text-center text-gray-600">
						{isMobile ? "手機版" : "網頁版"}登入
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className="p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
						{error}
					</div>
				)}

				{/* Platform Info */}
				{isMobile && (
					<div className="p-3 text-xs text-center bg-green-100 border border-green-200 rounded-lg text-green-700">
						✨ 使用原生應用認證
						<br />
						平台: {Capacitor.getPlatform()}
					</div>
				)}

				{/* Sign In Buttons */}
				<div className="space-y-4">
					{/* Google Sign In */}
					<button
						onClick={handleGoogleSignIn}
						disabled={loading}
						className={`w-full flex items-center justify-center gap-3 px-6 py-4 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm ${
							loading ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						<svg className="w-6 h-6" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<span className="text-base font-semibold">
							{loading ? "登入中..." : "使用 Google 登入"}
						</span>
					</button>

					{/* Apple Sign In - iOS only */}
					{(!isMobile || Capacitor.getPlatform() === "ios") && (
						<button
							onClick={handleAppleSignIn}
							disabled={loading}
							className={`w-full flex items-center justify-center gap-3 px-6 py-4 text-white bg-black rounded-xl hover:bg-gray-900 transition-all shadow-sm ${
								loading ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							<svg className="w-6 h-6" viewBox="0 0 24 24">
								<path
									fill="white"
									d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
								/>
							</svg>
							<span className="text-base font-semibold">
								{loading ? "登入中..." : "使用 Apple 登入"}
							</span>
						</button>
					)}
				</div>

				{/* Divider */}
				<div className="flex items-center my-6">
					<div className="flex-1 border-t border-gray-300"></div>
					<span className="px-4 text-sm text-gray-500">或</span>
					<div className="flex-1 border-t border-gray-300"></div>
				</div>

				{/* Email Login Link */}
				<button
					onClick={() => router.push("/auth/login")}
					className="w-full px-6 py-4 text-[#086E56] bg-white border-2 border-[#086E56] rounded-xl hover:bg-[#086E56] hover:text-white transition-all font-semibold"
				>
					使用電子郵件登入
				</button>

				{/* Terms */}
				<p className="text-xs text-center text-gray-500">
					繼續即表示您同意我們的
					<a href="/terms" className="text-[#086E56] underline ml-1">
						服務條款
					</a>
					和
					<a
						href="/privacy"
						className="text-[#086E56] underline ml-1"
					>
						隱私政策
					</a>
				</p>

				{/* Debug Info (dev only) */}
				{process.env.NODE_ENV === "development" && (
					<div className="p-3 mt-4 text-xs bg-gray-100 border border-gray-200 rounded-lg">
						<strong>Debug Info:</strong>
						<br />
						Platform: {Capacitor.getPlatform()}
						<br />
						Native: {isMobile ? "Yes" : "No"}
						<br />
						iOS: {Capacitor.getPlatform() === "ios" ? "Yes" : "No"}
					</div>
				)}
			</div>
		</div>
	);
}
