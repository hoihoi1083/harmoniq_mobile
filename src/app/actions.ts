"use server";
/**
 * Server-side sign out helper — perform a POST to NextAuth signout endpoint.
 * This avoids importing client-only helpers in a server module.
 */
export const handleSignOut = async () => {
	const API_BASE =
		process.env.NEXT_PUBLIC_API_BASE_URL ||
		"https://www.harmoniqfengshui.com";
	await fetch(`${API_BASE}/api/auth/signout`, {
		method: "POST",
		// include credentials so cookies/session can be cleared
		credentials: "include",
	});
};
