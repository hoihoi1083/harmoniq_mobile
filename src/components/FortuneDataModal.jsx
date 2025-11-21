import React, { useState, useEffect } from "react";

const FortuneDataModal = ({
	isOpen,
	onClose,
	concernType,
	sessionId,
	chatContext,
}) => {
	const [step, setStep] = useState(1); // 1: Gender & Birthday, 2: Problem
	const [formData, setFormData] = useState({
		gender: "",
		birthday: "",
		problem: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Pre-fill specific problem from chat context
	useEffect(() => {
		if (chatContext?.fromChat && chatContext.specificProblem) {
			setFormData((prev) => ({
				...prev,
				problem: chatContext.specificProblem,
			}));
			console.log(
				"💬 Pre-filled problem from chat:",
				chatContext.specificProblem
			);
		}
	}, [chatContext]);

	// Reset to step 1 when modal opens
	useEffect(() => {
		if (isOpen) {
			setStep(1);
		}
	}, [isOpen]);

	// Debug logging
	useEffect(() => {
		console.log("FortuneDataModal props:", {
			isOpen,
			concernType,
			sessionId,
			chatContext,
		});
	}, [isOpen, concernType, sessionId, chatContext]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Convert English concern types to Chinese for feng-shui-report page
			const concernMapping = {
				financial: "財運",
				love: "感情",
				health: "健康",
				career: "事業",
			};

			// Prepare the data for feng-shui report
			const reportParams = new URLSearchParams({
				birthday: formData.birthday,
				concern: concernMapping[concernType] || concernType, // Convert to Chinese
				problem: formData.problem,
				gender: formData.gender || "", // optional
			});

			// Redirect to feng-shui report with parameters
			window.location.href = `/feng-shui-report?${reportParams.toString()}`;
		} catch (error) {
			console.error("Error submitting form:", error);
			setIsSubmitting(false);
		}
	};

	const handleNoSpecificProblem = () => {
		const concernMapping = {
			financial: "財運",
			love: "感情",
			health: "健康",
			career: "事業",
		};

		const generalProblem = `一般${concernMapping[concernType] || concernType}運勢分析`;

		setFormData((prev) => ({
			...prev,
			problem: generalProblem,
		}));

		setIsSubmitting(true);

		// Auto submit after setting general problem
		setTimeout(() => {
			const concernMapping = {
				financial: "財運",
				love: "感情",
				health: "健康",
				career: "事業",
			};

			// Prepare the data for feng-shui report
			const reportParams = new URLSearchParams({
				birthday: formData.birthday,
				concern: concernMapping[concernType] || concernType,
				problem: generalProblem,
				gender: formData.gender || "",
			});

			// Redirect to feng-shui report with parameters
			window.location.href = `/feng-shui-report?${reportParams.toString()}`;
		}, 100);
	};

	const handleNextStep = () => {
		if (formData.gender && formData.birthday) {
			setStep(2);
		}
	};

	const handlePrevStep = () => {
		setStep(1);
	};

	if (!isOpen) {
		console.log("Modal not open, returning null");
		return null;
	}

	console.log("Rendering modal with concernType:", concernType);

	const getConcernTitle = () => {
		const mapping = {
			financial: "財運",
			love: "感情",
			health: "健康",
			career: "事業",
		};
		return mapping[concernType] || "運勢";
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
			<div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					{/* Step indicator */}
					<div className="flex items-center mb-6">
						<div
							className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-[#A3B116] text-white" : "bg-gray-200 text-gray-600"} text-sm font-medium`}
						>
							1
						</div>
						<div
							className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-[#A3B116]" : "bg-gray-200"}`}
						></div>
						<div
							className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-[#A3B116] text-white" : "bg-gray-200 text-gray-600"} text-sm font-medium`}
						>
							2
						</div>
					</div>

					<h2 className="mb-6 text-xl font-bold text-gray-800">
						{step === 1
							? "基本資料"
							: `${getConcernTitle()}測算問題`}
					</h2>

					{step === 1 && (
						<div className="space-y-6">
							{/* Gender Selection with Images */}
							<div>
								<label className="block mb-4 text-sm font-medium text-gray-700">
									選擇性別{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="flex justify-center gap-4">
									<div
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												gender: "male",
											}))
										}
										className={`flex flex-col items-center p-4 cursor-pointer transition-all ${
											formData.gender === "male"
												? "border-[#A3B116] bg-[#A3B116]/10"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<img
											src="/images/hero/male.png"
											alt="Male"
											className="mb-2 w-30 h-30"
										/>
									</div>
									<div
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												gender: "female",
											}))
										}
										className={`flex flex-col items-center p-4 cursor-pointer transition-all ${
											formData.gender === "female"
												? "border-[#A3B116] bg-[#A3B116]/10"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<img
											src="/images/hero/female.png"
											alt="Female"
											className="mb-2 w-30 h-30"
										/>
									</div>
								</div>
							</div>

							{/* Birthday Field */}
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700">
									出生日期{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									type="date"
									name="birthday"
									value={formData.birthday}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											birthday: e.target.value,
										}))
									}
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3B116]"
								/>
							</div>

							{/* Step 1 Buttons */}
							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={onClose}
									className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
								>
									取消
								</button>
								<button
									type="button"
									onClick={handleNextStep}
									disabled={
										!formData.gender || !formData.birthday
									}
									className="flex-1 px-4 py-2 bg-[#A3B116] text-white rounded-md hover:bg-[#8B9914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									下一步
								</button>
							</div>
						</div>
					)}

					{step === 2 && (
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Problem Field */}
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700">
									具體問題描述
								</label>
								<textarea
									name="problem"
									value={formData.problem}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											problem: e.target.value,
										}))
									}
									rows={4}
									placeholder={`請詳細描述您想了解的${getConcernTitle()}問題...`}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3B116] resize-none"
								/>
							</div>

							{/* Step 2 Buttons */}
							<div className="pt-4 space-y-3">
								{/* No specific problem button */}
								<button
									type="button"
									onClick={handleNoSpecificProblem}
									disabled={formData.problem.trim() !== ""}
									className="w-full px-4 py-2 text-gray-700 transition-colors bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									我無特定疑惑
								</button>

								{/* Action buttons */}
								<div className="flex gap-3">
									<button
										type="button"
										onClick={handlePrevStep}
										className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
										disabled={isSubmitting}
									>
										上一步
									</button>
									<button
										type="submit"
										disabled={
											isSubmitting ||
											formData.problem.trim() === ""
										}
										className="flex-1 px-4 py-2 bg-[#A3B116] text-white rounded-md hover:bg-[#8B9914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSubmitting ? "提交中..." : "完成"}
									</button>
								</div>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default FortuneDataModal;
