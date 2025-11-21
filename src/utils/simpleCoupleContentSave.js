/**
 * SIMPLE COUPLE REPORT SAVING UTILITY
 * Direct save function that components call immediately after content generation
 */

/**
 * Save component content immediately after generation
 * @param {string} sessionId - Session ID
 * @param {string} componentName - Component name (e.g., 'coupleAnnualAnalysis')
 * @param {object} content - Generated content
 * @param {object} metadata - Optional metadata (birthday, gender, userId, userEmail, etc.)
 */
export const saveComponentContent = async (
	sessionId,
	componentName,
	content,
	metadata = {}
) => {
	try {
		if (!sessionId || !componentName || !content) {
			console.error("❌ Missing required parameters for saving");
			return { success: false, error: "Missing required parameters" };
		}

		console.log(
			`💾 Saving ${componentName} content for session ${sessionId}${metadata.userId ? ` (user: ${metadata.userId})` : ""}`
		);

		const response = await fetch("/api/couple-content", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sessionId,
				componentName,
				content,
				...metadata,
			}),
		});

		const result = await response.json();

		if (result.success) {
			console.log(`✅ ${componentName} content saved successfully`);
		} else {
			console.error(`❌ Failed to save ${componentName}:`, result.error);
		}

		return result;
	} catch (error) {
		console.error(`❌ Error saving ${componentName}:`, error);
		return { success: false, error: error.message };
	}
};

/**
 * Get all saved content for a session
 * @param {string} sessionId - Session ID
 */
export const getSavedContent = async (sessionId) => {
	try {
		const response = await fetch(
			`/api/couple-content?sessionId=${sessionId}`
		);
		const result = await response.json();

		if (result.success) {
			console.log(
				`📖 Retrieved ${result.componentCount} saved components for session ${sessionId}`
			);
			return result;
		} else {
			console.error("❌ Failed to retrieve saved content:", result.error);
			return { success: false, savedContent: {}, metadata: {} };
		}
	} catch (error) {
		console.error("❌ Error retrieving saved content:", error);
		return { success: false, savedContent: {}, metadata: {} };
	}
};

/**
 * Enhanced save function that automatically includes user information from session
 * @param {object} session - Next-auth session object from useSession()
 * @param {string} sessionId - Session ID
 * @param {string} componentName - Component name
 * @param {object} content - Generated content
 * @param {object} metadata - Additional metadata
 */
export const saveComponentContentWithUser = async (
	session,
	sessionId,
	componentName,
	content,
	metadata = {}
) => {
	// Include user information if session is available
	const enhancedMetadata = {
		...metadata,
		...(session?.user?.userId && { userId: session.user.userId }),
		...(session?.user?.email && { userEmail: session.user.email }),
	};

	return saveComponentContent(
		sessionId,
		componentName,
		content,
		enhancedMetadata
	);
};

/**
 * Get complete couple report with all 6 components combined
 * @param {string} sessionId - Session ID
 */
export const getCompleteReport = async (sessionId) => {
	try {
		const response = await fetch(
			`/api/couple-complete-report?sessionId=${sessionId}`
		);
		const result = await response.json();

		if (result.success) {
			console.log(
				`📋 Retrieved complete couple report for session ${sessionId}`
			);
			console.log(
				`✅ Components present: ${result.summary.componentsPresent.length}/6`
			);
			console.log(
				`📊 Compatibility score: ${result.summary.compatibilityScore}`
			);
			return result;
		} else {
			console.error(
				"❌ Failed to retrieve complete report:",
				result.error
			);
			return { success: false, report: null, summary: null };
		}
	} catch (error) {
		console.error("❌ Error retrieving complete report:", error);
		return { success: false, report: null, summary: null };
	}
};
