"use client";
import { useState } from "react";

export default function FourFortune({ userInfo, wuxingData }) {
	return (
		<div className="min-h-screen bg-[#EFEFEF] p-6">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-[#374A37] mb-4">
						四大運勢分析
					</h1>
					<p className="text-gray-600">
						全面分析你的事業、感情、財運、健康四大運勢
					</p>
				</div>

				{/* Four Fortune Categories */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Career Fortune */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-gradient-to-r from-[#A3B116] to-[#3D5C2D] rounded-full flex items-center justify-center mr-4">
								<span className="text-white text-xl font-bold">
									事
								</span>
							</div>
							<h2 className="text-2xl font-bold text-[#374A37]">
								事業運勢
							</h2>
						</div>
						<div className="space-y-4">
							<p className="text-gray-700">
								正在分析你的事業運勢...
							</p>
							<div className="animate-pulse bg-gray-200 h-4 rounded"></div>
							<div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
						</div>
					</div>

					{/* Love Fortune */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-gradient-to-r from-[#A3B116] to-[#3D5C2D] rounded-full flex items-center justify-center mr-4">
								<span className="text-white text-xl font-bold">
									情
								</span>
							</div>
							<h2 className="text-2xl font-bold text-[#374A37]">
								感情運勢
							</h2>
						</div>
						<div className="space-y-4">
							<p className="text-gray-700">
								正在分析你的感情運勢...
							</p>
							<div className="animate-pulse bg-gray-200 h-4 rounded"></div>
							<div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
						</div>
					</div>

					{/* Wealth Fortune */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-gradient-to-r from-[#A3B116] to-[#3D5C2D] rounded-full flex items-center justify-center mr-4">
								<span className="text-white text-xl font-bold">
									財
								</span>
							</div>
							<h2 className="text-2xl font-bold text-[#374A37]">
								財運分析
							</h2>
						</div>
						<div className="space-y-4">
							<p className="text-gray-700">正在分析你的財運...</p>
							<div className="animate-pulse bg-gray-200 h-4 rounded"></div>
							<div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
						</div>
					</div>

					{/* Health Fortune */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<div className="flex items-center mb-4">
							<div className="w-12 h-12 bg-gradient-to-r from-[#A3B116] to-[#3D5C2D] rounded-full flex items-center justify-center mr-4">
								<span className="text-white text-xl font-bold">
									健
								</span>
							</div>
							<h2 className="text-2xl font-bold text-[#374A37]">
								健康運勢
							</h2>
						</div>
						<div className="space-y-4">
							<p className="text-gray-700">
								正在分析你的健康運勢...
							</p>
							<div className="animate-pulse bg-gray-200 h-4 rounded"></div>
							<div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
						</div>
					</div>
				</div>

				{/* Coming Soon Notice */}
				<div className="mt-8 text-center">
					<div className="bg-gradient-to-r from-[#A3B116] to-[#3D5C2D] text-white px-6 py-3 rounded-lg inline-block">
						<p className="font-semibold">功能開發中 - 敬請期待</p>
					</div>
				</div>
			</div>
		</div>
	);
}
