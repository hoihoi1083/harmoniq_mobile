import type { CapacitorConfig } from "@capacitor/cli";

// 🔥 DEVELOPMENT CONFIG - Points to localhost for live reload
const config: CapacitorConfig = {
	appId: "com.chunhoi.fengshui", // 🔥 UPDATED: Changed from com.harmoniq.fengshui
	appName: "HarmoniqFengShui (Dev)",
	webDir: "out",
	server: {
		// Point to your local development server
		url: "http://localhost:3000",
		cleartext: true, // Allow http in development
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
