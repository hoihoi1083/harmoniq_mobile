import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	// Exclude api.backup from builds
	webpack: (config) => {
		config.module.rules.push({
			test: /\.jsx?$/,
			exclude: /api\.backup/,
		});
		return config;
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "d3cbeloe0vn1bb.cloudfront.net",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "www.harmoniqfengshui.com",
				pathname: "/**",
			},
		],
	},
	reactStrictMode: false,
	// ✅ MOBILE: Static export for bundled app
	output: "export",
	trailingSlash: true,
	// Disable server features
	experimental: {
		// Optimize for client-side
		optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
	},
	async rewrites() {
		return [];
	},
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
