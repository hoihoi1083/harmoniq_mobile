import type { CapacitorConfig } from "@capacitor/cli";

// ✅ BUNDLED APP - Best Practice for App Store
// Frontend: Bundled in app (fast, offline)
// Backend: API calls to live server
const config: CapacitorConfig = {
	appId: "com.harmoniq.windbell",
	appName: "風鈴聊天室",
	webDir: "out",
	server: {
		androidScheme: "https",
		iosScheme: "capacitor"
	},
	// No server.url = loads from bundled files
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