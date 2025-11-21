// Quick test page for report history
"use client";

import Link from "next/link";

export const dynamic = "force-static";

export default function TestHistoryPage() {
	// Simulate adding a test user email to localStorage for testing
	const handleSetTestUser = () => {
		localStorage.setItem("userEmail", "test.user@example.com");
		localStorage.setItem("userId", "test-user-id-123");
		alert("已設置測試用戶信息");
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
				<h1 className="mb-4 text-2xl font-bold text-center text-gray-900">
					測試報告歷史頁面
				</h1>

				<div className="space-y-4">
					<button
						onClick={handleSetTestUser}
						className="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
					>
						設置測試用戶信息
					</button>

					<Link
						href="/zh-TW/report-history"
						className="block w-full px-4 py-2 text-center text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
					>
						查看報告歷史
					</Link>

					<Link
						href="/zh-TW/fortune-entry"
						className="block w-full px-4 py-2 text-center text-white transition-colors rounded-md bg-amber-600 hover:bg-amber-700"
					>
						生成新報告
					</Link>
				</div>

				<div className="mt-6 text-sm text-gray-600">
					<p className="mb-2 font-semibold">測試步驟：</p>
					<ol className="space-y-1 list-decimal list-inside">
						<li>點擊"設置測試用戶信息"</li>
						<li>點擊"查看報告歷史"</li>
						<li>如果沒有報告，先生成一個新報告</li>
						<li>返回查看歷史記錄</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
