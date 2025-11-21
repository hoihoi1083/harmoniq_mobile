// Self-hosted IP geolocation using MaxMind GeoLite2 database
// This eliminates external service calls but requires database management

import Reader from "@maxmind/geoip2-node";
import path from "path";

// Download GeoLite2 database from MaxMind (free with account)
// https://dev.maxmind.com/geoip/geolite2-free-geolocation-data

class SelfHostedGeoIP {
	constructor() {
		// Path to your downloaded .mmdb database file
		this.dbPath = path.join(process.cwd(), "data", "GeoLite2-Country.mmdb");
		this.cityDbPath = path.join(
			process.cwd(),
			"data",
			"GeoLite2-City.mmdb"
		);
		this.reader = null;
		this.cityReader = null;
		this.initialized = false;
	}

	async initialize() {
		try {
			// Initialize country database reader
			this.reader = await Reader.open(this.dbPath);

			// Initialize city database reader (optional, for more detailed info)
			try {
				this.cityReader = await Reader.open(this.cityDbPath);
			} catch (error) {
				console.warn("City database not available, using country only");
			}

			this.initialized = true;
			console.log("✅ Self-hosted GeoIP database initialized");
		} catch (error) {
			console.error("❌ Failed to initialize GeoIP database:", error);
			throw new Error("GeoIP database initialization failed");
		}
	}

	async getLocationFromIP(ip) {
		if (!this.initialized) {
			await this.initialize();
		}

		try {
			// Get country information
			const countryResponse = this.reader.country(ip);

			let result = {
				ip: ip,
				country: countryResponse.country.names.en,
				countryCode: countryResponse.country.isoCode,
				continent: countryResponse.continent.names.en,
				continentCode: countryResponse.continent.code,
				isChina: countryResponse.country.isoCode === "CN",
				isHongKong: countryResponse.country.isoCode === "HK",
				isMacau: countryResponse.country.isoCode === "MO",
				registeredCountry: countryResponse.registeredCountry.names.en,
				source: "self-hosted-maxmind",
			};

			// Add city information if available
			if (this.cityReader) {
				try {
					const cityResponse = this.cityReader.city(ip);
					result = {
						...result,
						city: cityResponse.city.names.en,
						region: cityResponse.subdivisions[0]?.names.en,
						regionCode: cityResponse.subdivisions[0]?.isoCode,
						postalCode: cityResponse.postal.code,
						latitude: cityResponse.location.latitude,
						longitude: cityResponse.location.longitude,
						timezone: cityResponse.location.timeZone,
						accuracyRadius: cityResponse.location.accuracyRadius,
					};
				} catch (cityError) {
					console.warn("City lookup failed, using country data only");
				}
			}

			return result;
		} catch (error) {
			console.error("IP lookup failed:", error);
			return {
				ip: ip,
				error: error.message,
				country: "Unknown",
				countryCode: "XX",
				isChina: false,
				isHongKong: false,
				isMacau: false,
				source: "self-hosted-maxmind-error",
			};
		}
	}

	// Specific method to check if IP is from China/HK region
	async isChinaHKRegion(ip) {
		const location = await this.getLocationFromIP(ip);
		return location.isChina || location.isHongKong || location.isMacau;
	}

	// Get client IP from Next.js request
	getClientIP(request) {
		const forwarded = request.headers.get("x-forwarded-for");
		const realIP = request.headers.get("x-real-ip");
		const cfConnectingIP = request.headers.get("cf-connecting-ip");

		if (forwarded) {
			return forwarded.split(",")[0].trim();
		}
		if (realIP) return realIP;
		if (cfConnectingIP) return cfConnectingIP;

		return request.ip || "127.0.0.1";
	}
}

// Singleton instance
const geoIP = new SelfHostedGeoIP();

export default geoIP;

// Usage example in API route:
/*
import geoIP from '../../../lib/selfHostedGeoIP';

export async function GET(request) {
    try {
        const clientIP = geoIP.getClientIP(request);
        const location = await geoIP.getLocationFromIP(clientIP);
        
        return Response.json({
            success: true,
            data: location,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
*/
