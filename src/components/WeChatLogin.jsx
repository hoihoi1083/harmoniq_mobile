"use client";

import React, { useState } from "react";
import { MessageCircle, User } from "lucide-react";

const WeChatLogin = ({ onSuccess, onError, className = "" }) => {
	const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';
	const [isLoading, setIsLoading] = useState(false);

	const handleWeChatLogin = async () => {
		try {
			setIsLoading(true);

			// Check if we're in WeChat browser
			const isInWeChat = /MicroMessenger/i.test(navigator.userAgent);

			if (isInWeChat) {
				// Direct WeChat OAuth in WeChat browser
				window.location.href = "/api/auth/wechat";
			} else {
				// Show QR code for desktop or other browsers
				showWeChatQRCode();
			}
		} catch (error) {
			console.error("WeChat login error:", error);
			setIsLoading(false);
			if (onError) onError(error);
		}
	};

	const showWeChatQRCode = () => {
		// Create popup window for WeChat QR code
		const width = 400;
		const height = 500;
		const left = (screen.width - width) / 2;
		const top = (screen.height - height) / 2;

		const popup = window.open(
			"/api/auth/wechat",
			"wechat_login",
			`width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
		);

		// Poll for popup closure (user completed login)
		const checkClosed = setInterval(() => {
			if (popup.closed) {
				clearInterval(checkClosed);
				setIsLoading(false);
				// Check for login success (you can implement this based on your needs)
				checkLoginStatus();
			}
		}, 1000);
	};

	const checkLoginStatus = async () => {
		try {
			// Check if user is now logged in
			const response = await fetch(`${API_BASE}/api/auth/status");
			const data = await response.json();

			if (data.loggedIn && onSuccess) {
				onSuccess(data.user);
			}
		} catch (error) {
			console.error("Login status check error:", error);
		}
	};

	return (
		<div className={`wechat-login ${className}`}>
			<button
				onClick={handleWeChatLogin}
				disabled={isLoading}
				className="flex items-center justify-center w-full px-6 py-3 text-white transition-all duration-200 bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? (
					<div className="flex items-center">
						<div className="w-5 h-5 mr-2 border-2 border-white border-solid rounded-full animate-spin border-t-transparent"></div>
						<span>連接中...</span>
					</div>
				) : (
					<div className="flex items-center">
						<MessageCircle className="w-5 h-5 mr-2" />
						<span>微信登入</span>
					</div>
				)}
			</button>

			{/* WeChat Login Tips */}
			<div className="mt-3 text-sm text-gray-600">
				<div className="flex items-start space-x-2">
					<div className="flex-shrink-0 w-4 h-4 mt-0.5">
						<User className="w-4 h-4" />
					</div>
					<div>
						<p className="font-medium">微信登入說明：</p>
						<ul className="mt-1 space-y-1 text-xs">
							<li>• 在微信內：直接跳轉授權</li>
							<li>• 在電腦端：掃描二維碼登入</li>
							<li>• 首次登入將自動建立帳戶</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WeChatLogin;
