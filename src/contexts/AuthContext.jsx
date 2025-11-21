"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Check authentication status on mount
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const response = await fetch("/api/auth/status");
			const data = await response.json();

			if (data.loggedIn) {
				setUser(data.user);
				setIsLoggedIn(true);
			} else {
				setUser(null);
				setIsLoggedIn(false);
			}
		} catch (error) {
			console.error("Auth status check failed:", error);
			setUser(null);
			setIsLoggedIn(false);
		} finally {
			setLoading(false);
		}
	};

	const login = (userData) => {
		setUser(userData);
		setIsLoggedIn(true);
		// Store session token if provided
		if (userData.token) {
			document.cookie = `session_token=${userData.token}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
		}
	};

	const logout = async () => {
		try {
			// Call logout API to clear server session
			await fetch("/api/auth/logout", { method: "POST" });
		} catch (error) {
			console.error("Logout API call failed:", error);
		} finally {
			// Clear client state regardless of API call result
			setUser(null);
			setIsLoggedIn(false);
			// Clear session cookie
			document.cookie = "session_token=; path=/; max-age=0";
		}
	};

	const value = {
		user,
		loading,
		isLoggedIn,
		login,
		logout,
		checkAuthStatus,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
