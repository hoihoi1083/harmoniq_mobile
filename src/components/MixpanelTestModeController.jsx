"use client";
import { useState, useEffect } from "react";

export default function MixpanelTestModeController() {
	const [testMode, setTestMode] = useState(false);
	const [realDataProtection, setRealDataProtection] = useState(true);

	useEffect(() => {
		// 檢查當前測試模式狀態
		const currentTestMode =
			localStorage.getItem("mixpanel_test_mode") === "true";
		const currentProtection =
			localStorage.getItem("mixpanel_protect_real_data") !== "false";

		setTestMode(currentTestMode);
		setRealDataProtection(currentProtection);
	}, []);

	const toggleTestMode = () => {
		const newTestMode = !testMode;
		setTestMode(newTestMode);

		if (newTestMode) {
			localStorage.setItem("mixpanel_test_mode", "true");
			sessionStorage.setItem("testing_mode", "true");
			console.log("🧪 已啟用測試模式 - 所有事件將被標記為測試數據");
		} else {
			localStorage.removeItem("mixpanel_test_mode");
			sessionStorage.removeItem("testing_mode");
			console.log("📊 已關閉測試模式 - 回到正式數據追蹤");
		}

		// 重新載入頁面以應用新設置
		window.location.reload();
	};

	const toggleDataProtection = () => {
		const newProtection = !realDataProtection;
		setRealDataProtection(newProtection);

		if (newProtection) {
			localStorage.setItem("mixpanel_protect_real_data", "true");
			console.log("🛡️ 已啟用真實數據保護");
		} else {
			localStorage.removeItem("mixpanel_protect_real_data");
			console.log("⚠️ 已關閉真實數據保護 - 請謹慎使用");
		}
	};

	const clearTestData = () => {
		if (
			confirm(
				"確定要清除所有測試相關的本地數據嗎？這不會影響 Mixpanel 服務器上的數據。"
			)
		) {
			// 清除測試相關的 localStorage 數據
			const keysToRemove = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && (key.includes("test") || key.includes("mixpanel"))) {
					keysToRemove.push(key);
				}
			}

			keysToRemove.forEach((key) => localStorage.removeItem(key));
			sessionStorage.clear();

			console.log("🧹 已清除測試數據:", keysToRemove);
			alert(`已清除 ${keysToRemove.length} 個測試相關的本地數據項目`);
		}
	};

	return (
		<div className="fixed z-50 max-w-sm p-4 bg-white border rounded-lg shadow-lg bottom-4 right-4">
			<h3 className="mb-3 text-lg font-bold text-gray-900">
				🎯 Mixpanel 測試控制
			</h3>

			{/* 測試模式開關 */}
			<div className="flex items-center justify-between mb-3">
				<span className="text-sm text-gray-700">測試模式</span>
				<button
					onClick={toggleTestMode}
					className={`px-3 py-1 rounded text-sm font-medium ${
						testMode
							? "bg-orange-100 text-orange-800"
							: "bg-green-100 text-green-800"
					}`}
				>
					{testMode ? "🧪 測試中" : "📊 正式"}
				</button>
			</div>

			{/* 數據保護開關 */}
			<div className="flex items-center justify-between mb-3">
				<span className="text-sm text-gray-700">數據保護</span>
				<button
					onClick={toggleDataProtection}
					className={`px-3 py-1 rounded text-sm font-medium ${
						realDataProtection
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{realDataProtection ? "🛡️ 已保護" : "⚠️ 未保護"}
				</button>
			</div>

			{/* 當前狀態提示 */}
			<div
				className="p-2 mb-3 text-xs rounded"
				style={{ backgroundColor: testMode ? "#fef3cd" : "#d1f2eb" }}
			>
				{testMode ? (
					<span className="text-amber-800">
						🧪 測試模式：所有追蹤事件都會被標記為測試數據
					</span>
				) : (
					<span className="text-green-800">
						📊 正式模式：追蹤真實用戶數據
					</span>
				)}
			</div>

			{/* 操作按鈕 */}
			<div className="space-y-2">
				<button
					onClick={clearTestData}
					className="w-full px-3 py-2 text-sm text-red-700 rounded bg-red-50 hover:bg-red-100"
				>
					🧹 清除測試數據
				</button>

				<a
					href="/zh-TW/mixpanel-test"
					target="_blank"
					className="block w-full px-3 py-2 text-sm text-center text-blue-700 rounded bg-blue-50 hover:bg-blue-100"
				>
					🔗 打開測試頁面
				</a>
			</div>

			{/* 使用提示 */}
			<div className="mt-3 text-xs text-gray-500">
				<p>💡 提示：</p>
				<ul className="space-y-1 list-disc list-inside">
					<li>測試模式會自動標記所有事件</li>
					<li>在 localhost 會自動啟用測試標記</li>
					<li>使用測試頁面進行功能測試</li>
				</ul>
			</div>
		</div>
	);
}
