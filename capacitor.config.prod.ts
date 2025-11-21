import type { CapacitorConfig } from "@capacitor/cli";

// 🚀 PRODUCTION CONFIG - Points to AWS Amplify deployment
const config: CapacitorConfig = {
	appId: "com.chunhoi.fengshui",
	appName: "HarmoniqFengShui",
	webDir: "out",
	server: {
		// 🚀 Production - Points to your EC2 server
		url: "https://www.harmoniqfengshui.com",
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
