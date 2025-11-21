"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, MessageSquare, CreditCard, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BottomNav() {
	const pathname = usePathname();
	const router = useRouter();
	const t = useTranslations("navigation");

	// Extract locale from pathname
	const locale = pathname?.split("/")[1] || "zh-TW";

	const navItems = [
		{
			name: t("home"),
			icon: Home,
			path: `/${locale}`,
			active: pathname === `/${locale}` || pathname === `/${locale}/`,
		},
		{
			name: t("chat"),
			icon: MessageSquare,
			path: `/${locale}/chat`,
			active: pathname?.includes("/chat") || false,
		},
		{
			name: t("pricing"),
			icon: CreditCard,
			path: `/${locale}/price`,
			active: pathname?.includes("/price") || false,
		},
		{
			name: t("settings"),
			icon: Settings,
			path: `/${locale}/settings`,
			active: pathname?.includes("/settings") || false,
		},
	];

	const handleNavigation = (path: string) => {
		router.push(path);
	};

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-bottom">
			<div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-4">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<button
							key={item.name}
							onClick={() => handleNavigation(item.path)}
							className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
								item.active
									? "text-purple-600 dark:text-purple-400"
									: "text-gray-600 dark:text-gray-400"
							}`}
						>
							<Icon
								className={`w-6 h-6 mb-1 ${
									item.active ? "stroke-[2.5]" : "stroke-[2]"
								}`}
							/>
							<span className="text-xs font-medium">
								{item.name}
							</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
