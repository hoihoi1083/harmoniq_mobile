import React, { useState, useEffect } from "react";

const CoupleDataModal = ({ isOpen, onClose, sessionId, chatContext }) => {
	const [step, setStep] = useState(1); // 1: Gender & Birthday, 2: Problem
	const [formData, setFormData] = useState({
		gender1: "male",
		gender2: "female",
		birthday1: "",
		birthday2: "",
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
				"💬 Pre-filled couple problem from chat:",
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
		console.log("CoupleDataModal props:", {
			isOpen,
			sessionId,
			chatContext,
		});
	}, [isOpen, sessionId, chatContext]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Prepare the data for couple report
			const reportParams = new URLSearchParams({
				birthday: formData.birthday1,
				birthday2: formData.birthday2,
				gender: formData.gender1,
				gender2: formData.gender2,
				problem: formData.problem,
				// No need for concern as it's fixed to "感情" in couple-report
			});

			// Redirect to couple report with parameters
			window.location.href = `/couple-report?${reportParams.toString()}`;
		} catch (error) {
			console.error("Error submitting form:", error);
			setIsSubmitting(false);
		}
	};

	const handleNoSpecificProblem = () => {
		const generalProblem = "一般情侶關係分析";

		setFormData((prev) => ({
			...prev,
			problem: generalProblem,
		}));

		setIsSubmitting(true);

		// Auto submit after setting general problem
		setTimeout(() => {
			// Prepare the data for couple report
			const reportParams = new URLSearchParams({
				birthday: formData.birthday1,
				birthday2: formData.birthday2,
				gender: formData.gender1,
				gender2: formData.gender2,
				problem: generalProblem,
			});

			// Redirect to couple report with parameters
			window.location.href = `/couple-report?${reportParams.toString()}`;
		}, 100);
	};

	const handleNextStep = () => {
		if (
			formData.gender1 &&
			formData.birthday1 &&
			formData.gender2 &&
			formData.birthday2
		) {
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

	console.log("Rendering couple modal with sessionId:", sessionId);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
						{step === 1 ? "基本資料" : "感情問題"}
					</h2>

					{step === 1 && (
						<div className="space-y-6">
							{/* Person 1 Section */}
							<div className="p-4 rounded-lg bg-gray-50">
								<h3 className="mb-4 text-lg font-medium text-gray-800">
									第一人資料
								</h3>

								{/* Person 1 Gender */}
								<div className="mb-4">
									<label className="block mb-3 text-sm font-medium text-gray-700">
										性別{" "}
										<span className="text-red-500">*</span>
									</label>
									<div className="flex justify-center gap-4">
										<div
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													gender1: "male",
												}))
											}
											className={`flex flex-col items-center p-4 cursor-pointer transition-all ${
												formData.gender1 === "male"
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
													gender1: "female",
												}))
											}
											className={`flex flex-col items-center p-4 cursor-pointer transition-all ${
												formData.gender1 === "female"
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

								{/* Person 1 Birthday */}
								<div>
									<label className="block mb-2 text-sm font-medium text-gray-700">
										出生日期{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="date"
										value={formData.birthday1}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												birthday1: e.target.value,
											}))
										}
										required
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3B116]"
									/>
								</div>
							</div>

							{/* Person 2 Section */}
							<div className="p-4 rounded-lg bg-gray-50">
								<h3 className="mb-4 text-lg font-medium text-gray-800">
									第二人資料
								</h3>

								{/* Person 2 Gender */}
								<div className="mb-4">
									<label className="block mb-3 text-sm font-medium text-gray-700">
										性別{" "}
										<span className="text-red-500">*</span>
									</label>
									<div className="flex justify-center gap-4">
										<div
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													gender2: "male",
												}))
											}
											className={`flex flex-col items-center p-4 cursor-pointer transition-all ${
												formData.gender2 === "male"
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
													gender2: "female",
												}))
											}
											className={`flex flex-col items-center p-4 cursor-pointer transition-all ${
												formData.gender2 === "female"
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

								{/* Person 2 Birthday */}
								<div>
									<label className="block mb-2 text-sm font-medium text-gray-700">
										出生日期{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="date"
										value={formData.birthday2}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												birthday2: e.target.value,
											}))
										}
										required
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3B116]"
									/>
								</div>
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
										!formData.gender1 ||
										!formData.birthday1 ||
										!formData.gender2 ||
										!formData.birthday2
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
									具體感情問題或想了解的方面
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
									placeholder="例如：我們經常吵架，如何改善關係？或者想了解彼此的性格相容性..."
									rows={4}
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

export default CoupleDataModal;
