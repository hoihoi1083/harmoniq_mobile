"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const UserProfile = () => {
	const { user, isLoggedIn, logout, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center p-4">
				<div className="w-8 h-8 border-b-2 border-pink-500 rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!isLoggedIn) {
		return (
			<div className="p-4">
				<a
					href="/login"
					className="inline-flex items-center px-4 py-2 text-white transition-colors bg-pink-500 rounded-lg hover:bg-pink-600"
				>
					<User className="w-4 h-4 mr-2" />
					登入
				</a>
			</div>
		);
	}

	return (
		<div className="p-4">
			<div className="flex items-center space-x-3">
				{/* User Avatar */}
				<div className="relative">
					{user.avatar ? (
						<img
							src={user.avatar}
							alt={user.name}
							className="w-10 h-10 border-2 border-pink-200 rounded-full"
						/>
					) : (
						<div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
							<User className="w-6 h-6 text-pink-500" />
						</div>
					)}
				</div>

				{/* User Info */}
				<div className="flex-1">
					<p className="font-medium text-gray-800">{user.name}</p>
					<p className="text-sm text-gray-500">微信用戶</p>
				</div>

				{/* Logout Button */}
				<button
					onClick={logout}
					className="p-2 text-gray-500 transition-colors hover:text-red-500"
					title="登出"
				>
					<LogOut className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export default UserProfile;
