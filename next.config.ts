import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true, // 忽略 eslint 检查
	},
	typescript: {
		ignoreBuildErrors: true, // 忽略 TypeScript 检查
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	images: {
		unoptimized: true, // Required for Capacitor static export
		remotePatterns: [
			{
				protocol: "https",
				hostname: "d3cbeloe0vn1bb.cloudfront.net",
				pathname: "/**",
			},
		],
	},
	reactStrictMode: false,
	// For mobile app: use 'export' for static pages
	// API routes will connect to your deployed backend
	output: process.env.CAPACITOR_BUILD === "true" ? "export" : "standalone",
	// Disable trailing slashes for Capacitor compatibility
	trailingSlash: true,
	// experimental: {
	//   turbo: {
	//     resolveAlias: {
	//       html2canvas: "html2canvas-pro",
	//     },
	//   },
	// },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
