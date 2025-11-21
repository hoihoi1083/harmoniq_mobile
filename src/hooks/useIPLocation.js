import { useState, useEffect } from "react";
import {
	getLocationFromIP,
	isFromChinaOrHK,
	getChineseRegionInfo,
} from "../utils/ipGeolocation";

// Custom hook for IP-based location detection
export const useIPLocation = () => {
	const [location, setLocation] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchLocation = async () => {
			try {
				setIsLoading(true);
				const locationData = await getLocationFromIP();
				setLocation(locationData);
				setError(null);
			} catch (err) {
				setError(err.message);
				setLocation(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLocation();
	}, []);

	return { location, isLoading, error };
};

// Custom hook specifically for China/HK detection
export const useChineseRegionDetection = () => {
	const [regionInfo, setRegionInfo] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const detectRegion = async () => {
			try {
				setIsLoading(true);
				const info = await getChineseRegionInfo();
				setRegionInfo(info);
				setError(null);
			} catch (err) {
				setError(err.message);
				setRegionInfo(null);
			} finally {
				setIsLoading(false);
			}
		};

		detectRegion();
	}, []);

	return { regionInfo, isLoading, error };
};
