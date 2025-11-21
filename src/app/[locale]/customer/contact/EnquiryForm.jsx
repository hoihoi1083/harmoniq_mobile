"use client";
import React, { useState } from "react";
import { Send, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AntdSpin } from "antd-spin";
import { post } from "@/lib/ajax";
import { toast } from "react-toastify";

const labelMap = {
	name: "姓名",
	email: "邮箱",
	category: "类别",
	otherCategory: "其他类别",
	message: "留言内容",
};

const EnquiryForm = () => {
	const t = useTranslations("home.contact");
	const t2 = useTranslations("toast");
	let arr = Array.from(new Array(5));
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		category: "",
		otherCategory: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false); // Add success state

	const handleSubmit = async (e) => {
		e.preventDefault();

		let arr = Object.entries(formData).map(([key, value]) => {
			return `<p>${labelMap[key]}: ${value}</p>`;
		});
		let body = { content: `<div>${arr.join("")}</div>` };
		setLoading(true);

		try {
			const res = await post("/api/sendEmail", body);
			if (res.data) {
				// Show success message using proper translation
				toast.success(t("success.message"), {
					autoClose: 3000, // Show for 3 seconds
				});

				setLoading(false);
				setFormData({
					name: "",
					email: "",
					category: "",
					otherCategory: "",
					message: "",
				});

				setShowSuccess(true);

				// Delay redirect to allow user to see success message
				setTimeout(() => {
					router.push("/");
				}, 3000);
			} else {
				toast.error("发送失败");
				setLoading(false);
			}
		} catch (e) {
			toast.error("发送失败: " + e.message);
			setLoading(false);
			console.log("submit error", e);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Add success screen
	if (showSuccess) {
		return (
			<div className="p-6 text-center bg-white shadow-sm rounded-xl sm:p-8">
				<div className="mb-6">
					<div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
						<svg
							className="w-8 h-8 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-xl font-semibold text-gray-900">
						{t("success.title")}
					</h3>
					<p className="mb-6 text-gray-600">{t("success.message")}</p>
					<button
						onClick={() => router.push("/")}
						className="px-6 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark"
					>
						{t("success.button")}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 bg-white w-[80%] sm:w-full shadow-sm rounded-xl sm:p-8">
			<AntdSpin
				fullscreen={true}
				spinning={loading}
				tip={t2("loading2")}
				className="bg-[#fff9]"
			/>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="name"
						className="block mb-2 text-md font-medium font-lora text-[#A3B116]"
					>
						{t("name.label")}
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						required
						className="w-full px-4 py-3 bg-[#E7E7E7] rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
						placeholder={t("name.placeholder")}
					/>
				</div>

				<div>
					<label
						htmlFor="email"
						className="block mb-2 text-md font-medium font-lora text-[#A3B116]"
					>
						{t("email.label")}
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						required
						className="w-full px-4 py-3 bg-[#E7E7E7] rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
						placeholder={t("email.placeholder")}
					/>
				</div>

				<div>
					<label
						htmlFor="category"
						className="block mb-2 text-md font-medium font-lora text-[#A3B116]"
					>
						{t("category.label")}
					</label>
					<div className="relative">
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleInputChange}
							required
							className="w-full px-4 py-3 bg-[#E7E7E7] rounded-full appearance-none focus:ring-2 focus:ring-primary focus:border-primary"
						>
							<option value="">
								{t("category.placeholder")}
							</option>
							{arr.map((i, index) => (
								<option
									key={index}
									value={t(`category.option${index + 1}`)}
								>
									{t(`category.option${index + 1}`)}
								</option>
							))}
						</select>
						<ChevronDown className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 pointer-events-none right-4 top-1/2" />
					</div>
				</div>

				{/* FIXED: Check for translated "其他" instead of English "Other" */}
				{formData.category === t("category.option5") && (
					<div>
						<input
							type="text"
							name="otherCategory"
							value={formData.otherCategory}
							onChange={handleInputChange}
							required
							className="w-full px-4 py-3 bg-[#E7E7E7] rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
							placeholder={t("category.otherPlaceholder")}
						/>
					</div>
				)}

				<div>
					<label
						htmlFor="message"
						className="block mb-2 text-md font-medium font-lora text-[#A3B116]"
					>
						{t("message.label")}
					</label>
					<textarea
						id="message"
						name="message"
						value={formData.message}
						onChange={handleInputChange}
						required
						rows={4}
						className="w-full px-4 py-3 bg-[#E7E7E7] rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary"
						placeholder={t("message.placeholder")}
					/>
				</div>
				<div className="flex justify-center">
					<button
						disabled={loading}
						type="submit"
						className="flex items-center justify-center w-[40%] gap-2 py-3 font-medium text-white transition-colors rounded-full bg-[#A3B116] hover:bg-primary-dark"
					>
						<Send className="w-5 h-5" />
						{loading ? t("submitting") : t("submit")}
					</button>
				</div>
			</form>
		</div>
	);
};

export default EnquiryForm;
