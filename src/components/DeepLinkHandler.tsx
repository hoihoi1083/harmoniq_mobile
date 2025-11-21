"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

/**
 * DeepLinkHandler Component
 * Listens for deep link events from external sources (e.g., Stripe payment redirects)
 * and navigates to the appropriate page within the app
 */
export default function DeepLinkHandler() {
	const router = useRouter();

	useEffect(() => {
		// Only run on mobile platforms
		if (!Capacitor.isNativePlatform()) {
			return;
		}

		console.log("📱 DeepLinkHandler: Setting up deep link listener");

		// Listen for app URL open events
		let listenerHandle: any;

		CapacitorApp.addListener("appUrlOpen", (data) => {
			console.log("📱 DeepLinkHandler: Received deep link:", data.url);

			try {
				const urlString = data.url;

				// Check if this is a harmoniq:// scheme
				if (urlString.startsWith("harmoniq://")) {
					// Parse the URL manually since custom schemes don't parse well with URL()
					// Format: harmoniq://success?session_id=...&type=fortune&concern=love
					const urlWithoutScheme = urlString.replace(
						"harmoniq://",
						""
					);
					const [path, queryString] = urlWithoutScheme.split("?");

					console.log("📱 DeepLinkHandler: Parsed deep link:", {
						path,
						queryString,
					});

					// Handle success path
					if (path === "success" || path === "") {
						// Extract parameters
						const params = new URLSearchParams(queryString || "");
						const sessionId = params.get("session_id");
						const type = params.get("type");
						const concern = params.get("concern");
						const locale = params.get("locale") || "zh-TW";

						if (!sessionId) {
							console.error(
								"📱 DeepLinkHandler: No session_id found in deep link"
							);
							return;
						}

						// 🔥 Build route to success page for ALL payment types
						// The success page will show thank you message and then redirect to data entry
						let appRoute = `/${locale}/success?session_id=${sessionId}`;
						if (type) appRoute += `&type=${type}`;
						if (concern) appRoute += `&concern=${concern}`;

						// Add all other params except mobile (but keep mobile flag for success page logic)
						params.forEach((value, key) => {
							if (
								![
									"session_id",
									"type",
									"concern",
									"locale",
								].includes(key)
							) {
								appRoute += `&${key}=${encodeURIComponent(value)}`;
							}
						});

						console.log(
							"📱 DeepLinkHandler: Navigating to:",
							appRoute
						);

						// Use setTimeout to ensure router is ready
						setTimeout(() => {
							router.push(appRoute);
						}, 100);
					}
				}
			} catch (error) {
				console.error(
					"📱 DeepLinkHandler: Error parsing deep link:",
					error
				);
			}
		}).then((handle) => {
			listenerHandle = handle;
		});

		// Cleanup listener on unmount
		return () => {
			if (listenerHandle) {
				listenerHandle.remove();
				console.log("📱 DeepLinkHandler: Removed deep link listener");
			}
		};
	}, [router]);

	// This component doesn't render anything
	return null;
}
