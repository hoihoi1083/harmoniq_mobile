// Utility functions for storing component data globally
// This ensures the database saves the exact same data that users see

export const storeComponentData = (componentName, data) => {
	if (typeof window !== "undefined") {
		window.componentDataStore = window.componentDataStore || {};
		window.componentDataStore[componentName] = data;
		console.log(
			`📊 Stored ${componentName} data:`,
			data ? "SUCCESS" : "NULL"
		);
	}
};

export const getComponentData = (componentName) => {
	if (typeof window !== "undefined" && window.componentDataStore) {
		return window.componentDataStore[componentName];
	}
	return null;
};

export const getAllComponentData = () => {
	if (typeof window !== "undefined" && window.componentDataStore) {
		return window.componentDataStore;
	}
	return {};
};

export const clearComponentData = () => {
	if (typeof window !== "undefined") {
		window.componentDataStore = {};
		console.log("🗑️ Cleared component data store");
	}
};
