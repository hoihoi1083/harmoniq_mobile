"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { get } from "@/lib/ajax";

const UserContext = createContext();

export function UserProvider({ children }) {
	const { data: session, status: sessionStatus } = useSession();
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

	// Function to fetch user data
	const fetchUserData = async () => {
		if (sessionStatus === "loading") {
			return;
		}

		if (!session?.user?.userId) {
			setLoading(false);
			setUserInfo(null);
			return;
		}

		try {
			setLoading(true);
			const response = await get(`/api/users/${session.user.userId}`);

			if (response.status === 0 && response.data) {
				setUserInfo(response.data);
				setLastUpdateTime(Date.now());
			} else {
				setUserInfo(null);
			}
		} catch (error) {setUserInfo(null);
		} finally {
			setLoading(false);
		}
	};

	// Fetch user data when session changes
	useEffect(() => {
		fetchUserData();
	}, [session?.user?.userId, sessionStatus]);

	// Function to update user info and force refresh
	const updateUserInfo = (newUserInfo) => {
		setUserInfo(newUserInfo);
		setLastUpdateTime(Date.now());
	};

	// Function to force refresh from API
	const refreshUserInfo = async () => {
		await fetchUserData();
	};

	const contextValue = {
		userInfo,
		setUserInfo: updateUserInfo,
		refreshUserInfo,
		loading: loading || sessionStatus === "loading",
		lastUpdateTime,
	};

	return (
		<UserContext.Provider value={contextValue}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
