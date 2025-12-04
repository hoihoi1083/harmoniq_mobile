"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, FileText, User, Home } from "lucide-react";

interface TabItem {
	name: string;
	path: string;
	icon: React.ReactNode;
	label: string;
	iconChar?: string; // For Chinese character icons
}

/**
 * Mobile Bottom Tab Navigation
 * 4 tabs: 首頁 | 風鈴聊天室 | 服務定價 | 我的
 */
export default function BottomTabNavigation() {
	const pathname = usePathname();
	const router = useRouter();

	// Extract locale from pathname (e.g., /zh-CN/chat -> zh-CN)
	const locale = pathname?.split("/")[1] || "zh-TW";

	const tabs: TabItem[] = [
		{
			name: "home",
			path: `/${locale}/home`,
			icon: <Home className="w-6 h-6" />,
			label: "首頁",
		},
		{
			name: "chat",
			path: `/${locale}`,
			icon: <MessageSquare className="w-6 h-6" />,
			label: "風鈴聊天室",
		},
		{
			name: "pricing",
			path: `/${locale}/price`,
			icon: <FileText className="w-6 h-6" />,
			label: "服務定價",
		},
		{
			name: "profile",
			path: `/${locale}/my-profile`,
			icon: <User className="w-6 h-6" />,
			label: "我的",
		},
	];

	const isActive = (path: string) => {
		// Exact match for chat (root path)
		if (path === `/${locale}`) {
			return pathname === `/${locale}` || pathname === `/${locale}/`;
		}
		// Starts with for other paths
		return pathname?.startsWith(path);
	};

	const handleTabClick = (path: string) => {
		router.push(path);
	};

	return (
		<nav
			className="fixed bottom-0 left-0 right-0 z-50 bg-[#EFEFEF] border-t border-gray-200 rounded-t-[40px]"
			style={{
				paddingBottom: "env(safe-area-inset-bottom)",
				boxShadow: "0 -1px 4.9px rgba(0, 0, 0, 0.25)",
			}}
		>
			<div className="grid h-16 grid-cols-4 mx-auto">
				{tabs.map((tab) => {
					const active = isActive(tab.path);
					return (
						<button
							key={tab.name}
							onClick={() => handleTabClick(tab.path)}
							className={`inline-flex flex-col items-center justify-center px-2 group transition-colors ${
								active
									? "text-[#A3B116]"
									: "text-gray-500 hover:text-[#A3B116]"
							}`}
							aria-label={tab.label}
						>
							<div
								className={`transition-transform ${active ? "scale-110" : ""}`}
							>
								{tab.icon}
							</div>
							<span
								className={`text-xs mt-1 transition-all ${
									active ? "font-semibold" : "font-normal"
								}`}
							>
								{tab.label}
							</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
