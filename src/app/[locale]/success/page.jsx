"use client";
import CountdownTimer from "./CountdownTimer"; // 假设CountdownTimer在同一目录下
import FortuneDataModal from "@/components/FortuneDataModal";
import PaymentThankYou from "@/components/PaymentThankYou";
import { useState, useEffect, use, Suspense } from "react";
import { Capacitor } from "@capacitor/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

function SuccessContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const locale = useLocale();
	const [sessionData, setSessionData] = useState(null);
	const [showFortuneModal, setShowFortuneModal] = useState(false);
	const [showThankYou, setShowThankYou] = useState(false);
	const [concernType, setConcernType] = useState("");
	const [debugInfo, setDebugInfo] = useState("");
	const [chatContext, setChatContext] = useState({
		fromChat: false,
		specificProblem: "",
		concern: "",
	});

	// Unwrap searchParams using React.use() for Next.js 15 compatibility
	const params = use(searchParams);

	// 📱 MOBILE FIX: Detect if we're in browser (not in app) and need to redirect back
	useEffect(() => {
		const { mobile } = params;
		const isInCapacitorApp = Capacitor.isNativePlatform();

		console.log("🔍 Success page mobile check:", {
			mobile,
			isInCapacitorApp,
			userAgent:
				typeof window !== "undefined"
					? window.navigator.userAgent
					: "N/A",
		});

		// Only redirect if mobile=true AND we're NOT already in the Capacitor app
		if (mobile === "true" && !isInCapacitorApp) {
			console.log(
				"📱 Mobile payment detected in browser, preparing to redirect back to app..."
			);

			// Show immediate visual feedback
			const messageDiv = document.createElement("div");
			messageDiv.style.cssText = `
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: white;
				padding: 24px;
				border-radius: 16px;
				box-shadow: 0 4px 16px rgba(0,0,0,0.2);
				z-index: 10000;
				text-align: center;
				max-width: 80%;
			`;
			messageDiv.innerHTML = `
				<div style="font-size: 48px; margin-bottom: 16px;">✅</div>
				<div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">付款成功！</div>
				<div style="font-size: 14px; color: #666;">正在返回應用程式...</div>
			`;
			document.body.appendChild(messageDiv);

			// Try to redirect to app using custom URL scheme
			// Format: harmoniq://success?session_id=...&type=...&concern=...
			const appUrl = `harmoniq://success${window.location.search}`;
			console.log("📱 Attempting to open app with URL:", appUrl);

			// Try multiple redirect methods for better compatibility
			setTimeout(() => {
				// Method 1: Direct window.location
				window.location.href = appUrl;

				// Method 2: Create invisible iframe (sometimes more reliable)
				const iframe = document.createElement("iframe");
				iframe.style.display = "none";
				iframe.src = appUrl;
				document.body.appendChild(iframe);

				// Method 3: Create a link and click it
				const link = document.createElement("a");
				link.href = appUrl;
				link.click();

				console.log("📱 All redirect methods attempted");
			}, 500);

			// Fallback: if app doesn't open after 3 seconds, show instruction
			setTimeout(() => {
				const instructionDiv = document.createElement("div");
				instructionDiv.style.cssText = `
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					background: white;
					padding: 24px;
					border-radius: 16px;
					box-shadow: 0 4px 16px rgba(0,0,0,0.2);
					z-index: 10001;
					text-align: center;
					max-width: 80%;
				`;
				instructionDiv.innerHTML = `
					<div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
					<div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">無法自動返回應用程式</div>
					<div style="font-size: 14px; color: #666; margin-bottom: 16px;">請手動返回應用程式查看您的報告</div>
					<button onclick="window.location.href='${appUrl}'" style="background: #A3B116; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
						點擊返回應用程式
					</button>
				`;
				document.body.innerHTML = "";
				document.body.appendChild(instructionDiv);
			}, 3000);
		} else if (isInCapacitorApp) {
			console.log(
				"📱 Already in Capacitor app, proceeding with normal flow"
			);
		}
	}, [params]);

	useEffect(() => {
		const getSessionData = async () => {
			// Use unwrapped params
			const { session_id, type, concern, specificProblem, fromChat } =
				params;

			console.log("URL Parameters:", {
				session_id,
				type,
				concern,
				specificProblem,
				fromChat,
			}); // Debug log
			setDebugInfo(
				`URL params: session_id=${session_id}, type=${type}, concern=${concern}, specificProblem=${specificProblem}, fromChat=${fromChat}`
			);

			// Set chat context if coming from chat
			if (fromChat === "true") {
				setChatContext({
					fromChat: true,
					specificProblem: specificProblem || "",
					concern: concern || "",
				});
				console.log("💬 Chat context detected:", {
					specificProblem,
					concern,
				});
			}

			if (!session_id) {
				console.error("No session_id found in URL parameters");
				setSessionData({ error: "Please provide a valid session_id" });
				return;
			}

			try {
				console.log("Verifying payment for session:", session_id); // Debug log
				setDebugInfo((prev) => prev + `\nVerifying payment...`);

				// Use different API endpoint based on payment type
				const apiEndpoint =
					type === "fortune"
						? "/api/verify-fortune-payment"
						: type === "couple"
							? "/api/verify-couple-payment"
							: "/api/verify-payment";

				// Verify the payment session
				const response = await fetch(apiEndpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ sessionId: session_id }),
				});

				const data = await response.json();
				console.log("Payment verification response:", data); // Debug log
				setDebugInfo(
					(prev) => prev + `\nAPI response: ${JSON.stringify(data)}`
				);
				setSessionData(data);

				// Check if this is a fortune payment
				if (type === "fortune" && concern && data.status === 0) {
					console.log(
						"Showing thank you page for fortune concern:",
						concern
					); // Debug log
					setDebugInfo(
						(prev) =>
							prev +
							`\nShowing thank you page for fortune: ${concern}`
					);
					setConcernType(concern);
					setShowThankYou(true);
				}
				// Check if this is a couple payment
				else if (type === "couple" && data.status === 0) {
					console.log("Showing thank you page for couple"); // Debug log
					setDebugInfo(
						(prev) => prev + `\nShowing thank you page for couple`
					);
					setShowThankYou(true);
				}
				// If this is an expert188 or expert88 payment and status is complete, show thank you page
				else if (
					(type === "expert188" || type === "expert88") &&
					data.status === 0
				) {
					console.log(
						"Showing thank you page for expert payment:",
						type
					);
					setDebugInfo(
						(prev) =>
							prev +
							`\nShowing thank you page for expert: ${type}`
					);
					setShowThankYou(true);
				}
			} catch (error) {
				console.error("Error verifying payment:", error);
				setDebugInfo((prev) => prev + `\nError: ${error.message}`);
				setSessionData({ error: error.message });
			}
		};

		getSessionData();
	}, [params]);

	const handleCloseModal = () => {
		setShowFortuneModal(false);
		// Could redirect to home or show success message
	};

	const handleStartDataEntry = () => {
		const { type, session_id, concern, specificProblem, fromChat } = params;

		if (type === "fortune") {
			// Redirect to fortune-entry page for Fortune payments
			let fortuneUrl = `/${locale}/fortune-entry?session_id=${session_id}`;
			if (concern) fortuneUrl += `&concern=${concern}`;
			if (fromChat === "true" && specificProblem) {
				fortuneUrl += `&specificProblem=${encodeURIComponent(specificProblem)}&fromChat=true`;
			}
			console.log("📱 Navigating to fortune entry:", fortuneUrl);
			router.push(fortuneUrl);
		} else if (type === "couple") {
			// Redirect to couple-entry page for Couple payments
			let coupleUrl = `/${locale}/couple-entry?session_id=${session_id}`;
			if (fromChat === "true" && specificProblem) {
				coupleUrl += `&specificProblem=${encodeURIComponent(specificProblem)}&fromChat=true`;
			}
			console.log("📱 Navigating to couple entry:", coupleUrl);
			router.push(coupleUrl);
		} else if (type === "expert188" || type === "expert88") {
			// Redirect to birthday-entry for Expert payments
			const birthdayUrl = `/${locale}/birthday-entry?session_id=${session_id}`;
			console.log("📱 Navigating to birthday entry:", birthdayUrl);
			router.push(birthdayUrl);
		}
	};

	// Show loading while verifying payment
	if (!sessionData) {
		return (
			<div className="flex items-center justify-center min-h-screen p-8">
				<div className="max-w-2xl text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3B116] mx-auto mb-4"></div>
					<p className="mb-4 text-gray-600">驗證付款中...</p>
				</div>
			</div>
		);
	}

	if (sessionData.error) {
		return (
			<div className="flex items-center justify-center min-h-screen p-8">
				<div className="max-w-2xl text-center">
					<div className="mb-4 text-xl text-red-500">⚠️</div>
					<p className="mb-4 text-gray-600">
						錯誤: {sessionData.error}
					</p>
					<button
						onClick={() => (window.location.href = "/price")}
						className="px-4 py-2 bg-[#A3B116] text-white rounded-md hover:bg-[#8B9914]"
					>
						返回價格頁面
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Show Thank You page for fortune and couple payments */}
			{showThankYou && (
				<PaymentThankYou
					type={params.type}
					onStartDataEntry={handleStartDataEntry}
					sessionId={
						sessionData.sessionId || sessionData.data?.sessionId
					}
					concernType={concernType}
					chatContext={chatContext}
				/>
			)}

			{/* Only show CountdownTimer for non-fortune and non-couple payments */}
			{(!params.type ||
				(params.type !== "fortune" && params.type !== "couple")) && (
				<CountdownTimer
					time={5}
					status={
						sessionData.status === 0 ? "complete" : "incomplete"
					}
				/>
			)}

			<FortuneDataModal
				isOpen={showFortuneModal}
				onClose={handleCloseModal}
				concernType={concernType}
				sessionId={sessionData.sessionId || sessionData.data?.sessionId}
				chatContext={chatContext}
			/>
		</>
	);
}

export default function Success() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SuccessContent />
		</Suspense>
	);
}
