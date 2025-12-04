"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreditCard, Shield, Star, Clock } from "lucide-react";

export default function PaymentPage({ params }) {
	const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';
	const { data: session } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [userIntent, setUserIntent] = useState(null);

	const serviceId = params.serviceId;
	const userId = searchParams.get("userId");
	const concern = searchParams.get("concern");

	// 服務信息配置
	const serviceInfo = {
		"career-fengshui": {
			name: "事業風水專業分析",
			price: "HK$299",
			description: "深度分析你嘅事業運勢",
			features: [
				"基於八字五行嘅事業運勢分析",
				"職場發展前景預測",
				"升職轉工最佳時機",
				"辦公室風水佈局建議",
				"個人能力提升方向",
				"貴人運和機會把握",
			],
		},
		"relationship-fengshui": {
			name: "感情風水專業分析",
			price: "HK$299",
			description: "全面分析你嘅感情運勢",
			features: [
				"基於八字嘅感情運勢分析",
				"戀愛結婚時機預測",
				"感情困擾解決方案",
				"桃花位風水佈置",
				"感情運勢提升建議",
				"理想伴侶特質分析",
			],
		},
		"wealth-fengshui": {
			name: "財運風水專業分析",
			price: "HK$299",
			description: "詳細分析你嘅財富運勢",
			features: [
				"基於八字嘅財運分析",
				"正財偏財運勢預測",
				"投資理財最佳時機",
				"財位風水佈局指導",
				"破財化解和招財方法",
				"財富累積策略建議",
			],
		},
		"children-fengshui": {
			name: "子女運風水分析",
			price: "HK$299",
			description: "分析子女運勢和親子關係",
			features: [
				"生育時機和子女運分析",
				"子女學業運勢預測",
				"親子關係改善建議",
				"兒童房風水佈置",
				"子女教育方向指導",
				"家庭和諧風水調理",
			],
		},
		"love-luck-fengshui": {
			name: "桃花運風水分析",
			price: "HK$299",
			description: "提升桃花運和脫單機會",
			features: [
				"桃花運時機和強度分析",
				"理想對象出現預測",
				"桃花位精確定位",
				"脫單風水佈置方法",
				"爛桃花化解技巧",
				"姻緣提升全攻略",
			],
		},
		"destiny-fengshui": {
			name: "命運因緣分析",
			price: "HK$399",
			description: "深度分析人生運勢軌跡",
			features: [
				"人生重大轉折點預測",
				"機會把握和選擇建議",
				"運勢週期和起伏分析",
				"因緣際遇深度解讀",
				"人生方向指導建議",
				"命運改善具體方法",
			],
		},
	};

	const currentService = serviceInfo[serviceId];

	useEffect(() => {
		if (session?.user && concern) {
			fetchUserIntent();
		}
	}, [session, concern]);

	const fetchUserIntent = async () => {
		try {
			const response = await fetch(
				`/api/intent?concern=${encodeURIComponent(concern)}`
			);
			const data = await response.json();
			if (data.userIntent) {
				setUserIntent(data.userIntent);
			}
		} catch (error) {
			console.error("獲取用戶意圖失敗:", error);
		}
	};

	const handlePayment = async () => {
		setLoading(true);
		try {
			// 這裡整合你的付款處理邏輯
			// 可以是Stripe、PayPal或其他付款系統

			const response = await fetch(`${API_BASE}/api/payment/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					serviceId,
					concern,
					amount: currentService.price.replace("HK$", ""),
					userIntentId: userIntent?._id,
				}),
			});

			const data = await response.json();

			if (data.paymentUrl) {
				// 重定向到付款頁面
				window.location.href = data.paymentUrl;
			}
		} catch (error) {
			console.error("付款失敗:", error);
			alert("付款失敗，請稍後再試");
		} finally {
			setLoading(false);
		}
	};

	if (!currentService) {
		return <div className="py-20 text-center">服務不存在</div>;
	}

	return (
		<div className="min-h-screen py-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
			<div className="container max-w-4xl px-4 mx-auto">
				{/* 頭部 */}
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-3xl font-bold text-gray-800">
						{currentService.name}
					</h1>
					<p className="text-gray-600">
						{currentService.description}
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					{/* 左側：服務詳情 */}
					<div className="p-6 bg-white shadow-lg rounded-2xl">
						<div className="mb-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-bold text-gray-800">
									服務包含
								</h2>
								<div className="text-3xl font-bold text-purple-600">
									{currentService.price}
								</div>
							</div>

							<ul className="space-y-3">
								{currentService.features.map(
									(feature, index) => (
										<li
											key={index}
											className="flex items-start space-x-3"
										>
											<Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
											<span className="text-gray-700">
												{feature}
											</span>
										</li>
									)
								)}
							</ul>
						</div>

						{/* 用戶問題摘要 */}
						{userIntent && (
							<div className="p-4 mb-6 rounded-lg bg-purple-50">
								<h3 className="mb-2 font-semibold text-purple-800">
									你嘅具體問題：
								</h3>
								<p className="text-purple-700">
									{userIntent.specificQuestion}
								</p>
								{userIntent.birthday && (
									<p className="mt-2 text-sm text-purple-600">
										生日：
										{new Date(
											userIntent.birthday
										).toLocaleDateString()}
										{userIntent.birthTime &&
											` • 時辰：${userIntent.birthTime}`}
									</p>
								)}
							</div>
						)}

						{/* 保證 */}
						<div className="pt-4 border-t">
							<div className="flex items-center mb-2 space-x-3">
								<Shield className="w-5 h-5 text-green-500" />
								<span className="font-semibold text-gray-800">
									專業保證
								</span>
							</div>
							<ul className="ml-8 space-y-1 text-sm text-gray-600">
								<li>• 由資深風水師親自分析</li>
								<li>• 基於傳統八字學理論</li>
								<li>• 100%個人化定制報告</li>
								<li>• 7天內完成分析</li>
							</ul>
						</div>
					</div>

					{/* 右側：付款 */}
					<div className="p-6 bg-white shadow-lg rounded-2xl">
						<h2 className="mb-6 text-xl font-bold text-gray-800">
							付款資訊
						</h2>

						{/* 價格摘要 */}
						<div className="p-4 mb-6 rounded-lg bg-gray-50">
							<div className="flex items-center justify-between mb-2">
								<span className="text-gray-700">
									{currentService.name}
								</span>
								<span className="font-semibold">
									{currentService.price}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm text-gray-600">
								<span>預計完成時間</span>
								<span className="flex items-center">
									<Clock className="w-4 h-4 mr-1" />
									3-7個工作天
								</span>
							</div>
						</div>

						{/* 付款按鈕 */}
						<button
							onClick={handlePayment}
							disabled={loading}
							className="flex items-center justify-center w-full px-6 py-4 space-x-2 font-bold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
						>
							<CreditCard className="w-5 h-5" />
							<span>
								{loading
									? "處理中..."
									: `立即付款 ${currentService.price}`}
							</span>
						</button>

						<p className="mt-4 text-xs text-center text-gray-500">
							付款安全由SSL加密保護 • 支持信用卡和電子錢包
						</p>

						{/* 退款政策 */}
						<div className="pt-4 mt-6 text-sm text-gray-600 border-t">
							<h4 className="mb-2 font-semibold">退款政策</h4>
							<p>
								如果對分析結果不滿意，我們提供7天無條件退款保證。
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
