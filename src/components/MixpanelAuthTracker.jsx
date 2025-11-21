"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import FengShuiMixpanel from "@/lib/mixpanel";

export default function MixpanelAuthTracker() {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "loading") return; // 還在載入中

		if (status === "authenticated" && session?.user) {
			// 用戶已登入 - 識別用戶
			const user = session.user;
			const userId = user.email || user.id || "unknown";

			// 識別用戶並設置屬性
			FengShuiMixpanel.identify(userId, {
				name: user.name || "未知用戶",
				email: user.email || "",
				avatar: user.image || "",
				provider: session.provider || "unknown",
				loginTime: new Date().toISOString(),
				userType: "authenticated",
				// 您可以添加更多用戶屬性
				language: "zh-TW",
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			});

			// 追蹤登入事件
			FengShuiMixpanel.track("用戶登入", {
				登入方式: session.provider || "unknown",
				用戶名稱: user.name || "未知",
				登入時間: new Date().toISOString(),
				是否首次登入: determineIfFirstLogin(user),
				登入頁面: window.location.pathname,
			});

			console.log("🔐 Mixpanel 用戶已識別:", userId);
		} else if (status === "unauthenticated") {
			// 用戶未登入 - 追蹤匿名用戶
			FengShuiMixpanel.track("匿名用戶訪問", {
				訪問時間: new Date().toISOString(),
				訪問頁面: window.location.pathname,
				用戶狀態: "未登入",
			});

			console.log("👤 Mixpanel 追蹤匿名用戶");
		}
	}, [session, status]);

	// 判斷是否為首次登入（簡單實現）
	const determineIfFirstLogin = (user) => {
		// 可以根據您的業務邏輯調整
		// 例如檢查用戶創建時間、登入次數等
		return !localStorage.getItem(`user_seen_${user.email}`);
	};

	return null; // 這個組件不渲染任何內容
}

// 用戶登出追蹤Hook
export function useMixpanelSignOut() {
	const handleSignOut = () => {
		// 在登出前追蹤事件
		FengShuiMixpanel.track("用戶登出", {
			登出時間: new Date().toISOString(),
			登出頁面: window.location.pathname,
			會話時長: calculateSessionDuration(),
		});

		// 重置 Mixpanel 用戶識別
		FengShuiMixpanel.reset();

		console.log("🚪 用戶已登出，Mixpanel 已重置");
	};

	return handleSignOut;
}

// 計算會話時長
function calculateSessionDuration() {
	const sessionStart = sessionStorage.getItem("session_start_time");
	if (!sessionStart) return "未知";

	const duration = Date.now() - parseInt(sessionStart);
	const minutes = Math.floor(duration / 60000);
	const seconds = Math.floor((duration % 60000) / 1000);

	return `${minutes}分${seconds}秒`;
}
