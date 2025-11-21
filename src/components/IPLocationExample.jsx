// Example component showing how to use IP detection
import React, { useState, useEffect } from "react";
import { useChineseRegionDetection } from "../hooks/useIPLocation";
import { isFromChinaOrHK } from "../utils/ipGeolocation";

const IPLocationExample = () => {
	const { regionInfo, isLoading, error } = useChineseRegionDetection();
	const [showChineseContent, setShowChineseContent] = useState(false);

	useEffect(() => {
		// Simple check without hooks
		const checkLocation = async () => {
			const isChinaHK = await isFromChinaOrHK();
			setShowChineseContent(isChinaHK);
		};

		checkLocation();
	}, []);

	if (isLoading) {
		return <div>Detecting your location...</div>;
	}

	if (error) {
		console.error("Location detection error:", error);
		// Fallback to default content
	}

	return (
		<div className="p-6 bg-white rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold mb-4">Location-Based Content</h2>

			{regionInfo ? (
				<div className="space-y-4">
					<div className="bg-blue-50 p-4 rounded-lg">
						<h3 className="font-semibold text-blue-800">
							Your Location Info:
						</h3>
						<p>Country: {regionInfo.location?.country}</p>
						<p>Region: {regionInfo.location?.region}</p>
						<p>City: {regionInfo.location?.city}</p>
					</div>

					{regionInfo.isMainlandChina && (
						<div className="bg-red-50 p-4 rounded-lg border border-red-200">
							<h3 className="font-semibold text-red-800">
								🇨🇳 中国大陆用户
							</h3>
							<p>您好！我们检测到您来自中国大陆。</p>
							<p>我们为您提供特别的内容和服务。</p>
						</div>
					)}

					{regionInfo.isHongKong && (
						<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
							<h3 className="font-semibold text-purple-800">
								🇭🇰 香港用户
							</h3>
							<p>您好！我们检测到您来自香港。</p>
							<p>
								We provide special content for Hong Kong users.
							</p>
						</div>
					)}

					{regionInfo.isMacau && (
						<div className="bg-green-50 p-4 rounded-lg border border-green-200">
							<h3 className="font-semibold text-green-800">
								🇲🇴 澳门用户
							</h3>
							<p>您好！我们检测到您来自澳门。</p>
						</div>
					)}

					{!regionInfo.isMainlandChina &&
						!regionInfo.isHongKong &&
						!regionInfo.isMacau && (
							<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<h3 className="font-semibold text-gray-800">
									🌍 International User
								</h3>
								<p>
									Welcome! We detected you're accessing from{" "}
									{regionInfo.location?.country}.
								</p>
							</div>
						)}
				</div>
			) : (
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<p>
						Unable to detect your location. Showing default content.
					</p>
				</div>
			)}

			{/* Conditional content based on location */}
			{showChineseContent && (
				<div className="mt-6 p-4 bg-gradient-to-r from-red-100 to-yellow-100 rounded-lg">
					<h3 className="font-bold text-red-800">
						Chinese Specific Content
					</h3>
					<p>
						This content is specifically shown to users from China
						and Hong Kong.
					</p>
				</div>
			)}
		</div>
	);
};

export default IPLocationExample;
