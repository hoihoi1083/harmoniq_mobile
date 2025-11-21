"use server";
/**
 * Server-side sign out helper — perform a POST to NextAuth signout endpoint.
 * This avoids importing client-only helpers in a server module.
 */
export const handleSignOut = async () => {
	await fetch("/api/auth/signout", {
		method: "POST",
		// include credentials so cookies/session can be cleared
		credentials: "include",
	});
};
