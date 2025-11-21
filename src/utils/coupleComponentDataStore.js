// Utility functions for storing couple component data globally
// This ensures the database saves the exact same data that users see for couple reports

export const storeCoupleComponentData = (componentName, data) => {
	if (typeof window !== "undefined") {
		window.coupleComponentDataStore = window.coupleComponentDataStore || {};
		window.coupleComponentDataStore[componentName] = data;
		console.log(
			`💕 Stored couple ${componentName} data:`,
			data ? "SUCCESS" : "NULL"
		);
	}
};

export const getCoupleComponentData = (componentName) => {
	if (typeof window !== "undefined" && window.coupleComponentDataStore) {
		const data = window.coupleComponentDataStore[componentName];
		if (data) {
			console.log(
				`💕 Retrieved couple ${componentName} data from store:`,
				data
			);
			return data;
		} else {
			console.log(
				`💕 No couple ${componentName} data found in store. Available components:`,
				Object.keys(window.coupleComponentDataStore)
			);
		}
	} else {
		console.log(
			`💕 No couple component data store available (window check failed)`
		);
	}
	return null;
};

export const getAllCoupleComponentData = () => {
	if (typeof window !== "undefined" && window.coupleComponentDataStore) {
		return window.coupleComponentDataStore;
	}
	return {};
};

export const clearCoupleComponentData = () => {
	if (typeof window !== "undefined") {
		window.coupleComponentDataStore = {};
		console.log("🗑️ Cleared couple component data store");
	}
};
