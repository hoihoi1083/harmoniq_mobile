import type { CapacitorConfig } from "@capacitor/cli";

// 🚀 PRODUCTION CONFIG - App Store Build
// Points to deployed mobile app server (app.harmoniqfengshui.com)
const config: CapacitorConfig = {
	appId: "com.harmoniq.windbell",
	appName: "風鈴聊天室",
	webDir: "out",
	server: {
		// 🚀 Production - Points to mobile app deployment
		url: "https://app.harmoniqfengshui.com",
		cleartext: false, // Force HTTPS in production
		androidScheme: "https",
	},
	plugins: {
		GoogleAuth: {
			scopes: ["profile", "email"],
			serverClientId: process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
			iosClientId:
				"697339458259-k3i95igrjhnitcr8d14sl6pcgdt7s5cd.apps.googleusercontent.com",
			forceCodeForRefreshToken: true,
		},
		SplashScreen: {
			launchShowDuration: 2000,
			backgroundColor: "#086E56",
			showSpinner: false,
		},
	},
};

export default config;
