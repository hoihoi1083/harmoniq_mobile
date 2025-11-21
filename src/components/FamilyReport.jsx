"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus, User, Edit } from "lucide-react";
import Image from "next/image";
import getWuxingData from "@/lib/nayin";
import DateCarousel from "./DateCarousel /index.jsx";

export default function FamilyReport() {
	const [familyMember, setFamilyMember] = useState(null); // Only one family member
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [showPrompt, setShowPrompt] = useState(true); // Show initial prompt
	const [currentMember, setCurrentMember] = useState({
		gender: "男",
		birthYear: "1996",
		birthMonth: "03",
		birthDay: "12",
		birthHour: "22",
	});

	// Element colors mapping
	const wuxingColorMap = {
		金: "#B2A062",
		木: "#567156",
		水: "#939393",
		火: "#B4003C",
		土: "#DEAB20",
	};

	// Create date as local time to preserve the actual time for 八字 calculation
	const createLocalDate = (year, month, day, hour) => {
		return new Date(year, month - 1, day, hour, 0, 0);
	};

	// Load family member data from localStorage on component mount
	useEffect(() => {
		const storedFamilyData = localStorage.getItem("familyMemberData");
		if (storedFamilyData) {
			try {
				const familyData = JSON.parse(storedFamilyData);
				const birthDateTime = new Date(familyData.birthDateTime);
				const wuxingData = getWuxingData(
					birthDateTime,
					familyData.gender
				);

				const memberData = {
					id: Date.now(),
					gender: familyData.gender,
					birthDateTime,
					wuxingData,
				};

				setFamilyMember(memberData);
				setShowPrompt(false);
			} catch (error) {}
		}
	}, []);

	const handleAddMember = () => {
		const birthDateTime = createLocalDate(
			parseInt(currentMember.birthYear),
			parseInt(currentMember.birthMonth),
			parseInt(currentMember.birthDay),
			parseInt(currentMember.birthHour)
		);

		const wuxingData = getWuxingData(birthDateTime, currentMember.gender);

		const newMember = {
			id: Date.now(),
			gender: currentMember.gender,
			birthDateTime,
			wuxingData,
		};

		setFamilyMember(newMember);
		setIsDialogOpen(false);
		setShowPrompt(false);

		// Update localStorage
		localStorage.setItem(
			"familyMemberData",
			JSON.stringify({
				gender: currentMember.gender,
				birthDateTime: birthDateTime,
			})
		);
	};

	const handleDeleteMember = () => {
		setFamilyMember(null);
		setShowPrompt(true);
		// Remove from localStorage
		localStorage.removeItem("familyMemberData");
	};

	const handleEditMember = () => {
		// Populate current member state with existing data
		if (familyMember) {
			const date = familyMember.birthDateTime;
			setCurrentMember({
				gender: familyMember.gender,
				birthYear: date.getFullYear().toString(),
				birthMonth: (date.getMonth() + 1).toString().padStart(2, "0"),
				birthDay: date.getDate().toString().padStart(2, "0"),
				birthHour: date.getHours().toString().padStart(2, "0"),
			});
		}
		setIsDialogOpen(true);
	};

	const onDateChange = (value) => {
		if (value) {
			setCurrentMember({
				...currentMember,
				birthYear: value[0],
				birthMonth: value[1],
				birthDay: value[2],
				birthHour: value[3],
			});
		}
	};

	const calculateWuxingAnalysis = (wuxingData) => {
		const wuxingCounts = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };

		// Count elements from all pillars
		Object.entries(wuxingData).forEach(([key, value]) => {
			if (key.includes("Wuxing") && value) {
				wuxingCounts[value]++;
			}
		});

		const missingElements = Object.keys(wuxingCounts).filter(
			(element) => wuxingCounts[element] === 0
		);
		return { wuxingCounts, missingElements };
	};

	return (
		<div className="w-full max-w-4xl p-6 mx-auto">
			{/* Show prompt if no family member added */}
			{showPrompt && !familyMember && (
				<div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
					<h3
						className="mb-3 text-lg font-bold"
						style={{
							fontFamily: '"Noto Serif TC", serif',
							fontWeight: 700,
						}}
					>
						家庭成員八字分析
					</h3>
					<p
						className="mb-4 text-gray-700"
						style={{ fontFamily: '"Noto Serif TC", serif' }}
					>
						您是否想要輸入家庭成員的出生日期進行八字分析？
					</p>

					<div className="flex gap-3">
						<Dialog
							open={isDialogOpen}
							onOpenChange={setIsDialogOpen}
						>
							<DialogTrigger asChild>
								<Button className="flex items-center gap-2">
									<Plus size={16} />
									是的，添加家庭成員
								</Button>
							</DialogTrigger>
							<DialogContent
								className="sm:max-w-[432px]"
								style={{ fontFamily: '"Noto Serif TC", serif' }}
							>
								<DialogHeader>
									<DialogTitle>添加家庭成員資料</DialogTitle>
								</DialogHeader>

								<div className="space-y-4">
									{/* Gender Selection */}
									<div>
										<Label className="text-base font-bold">
											性別
										</Label>
										<RadioGroup
											value={currentMember.gender}
											onValueChange={(value) =>
												setCurrentMember({
													...currentMember,
													gender: value,
												})
											}
											className="flex gap-6 mt-2"
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="男"
													id="male"
												/>
												<Label htmlFor="male">男</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="女"
													id="female"
												/>
												<Label htmlFor="female">
													女
												</Label>
											</div>
										</RadioGroup>
									</div>

									<Separator />

									{/* Birth Date Selection */}
									<div>
										<div className="flex justify-between pb-4">
											<Label className="text-base font-bold">
												出生日期
											</Label>
											<span>{`${currentMember.birthYear}年${currentMember.birthMonth}月${currentMember.birthDay}日${currentMember.birthHour}時`}</span>
										</div>
										<DateCarousel
											tHour="時"
											onChange={onDateChange}
											value={[
												currentMember.birthYear,
												currentMember.birthMonth,
												currentMember.birthDay,
												currentMember.birthHour,
											]}
										/>
									</div>

									<div className="flex justify-end gap-3 pt-4">
										<Button
											variant="outline"
											onClick={() =>
												setIsDialogOpen(false)
											}
										>
											取消
										</Button>
										<Button onClick={handleAddMember}>
											{familyMember ? "更新" : "添加"}
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>

						<Button
							variant="outline"
							onClick={() => setShowPrompt(false)}
						>
							暫時不需要
						</Button>
					</div>
				</div>
			)}

			{/* Family Member Display */}
			{familyMember && (
				<div className="space-y-6">
					<div className="flex items-center justify-between mb-6">
						<h2
							className="text-2xl font-bold"
							style={{
								fontFamily: '"Noto Serif TC", serif',
								fontWeight: 700,
							}}
						>
							家庭成員八字命盤
						</h2>

						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleEditMember}
								className="text-blue-500 hover:text-blue-700"
							>
								<Edit size={16} />
								編輯
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleDeleteMember}
								className="text-red-500 hover:text-red-700"
							>
								<Trash2 size={16} />
								移除
							</Button>
						</div>
					</div>

					<div className="p-6 bg-white border rounded-lg shadow-sm">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<h3
									className="text-xl font-bold"
									style={{
										fontFamily: '"Noto Serif TC", serif',
										fontWeight: 700,
									}}
								>
									家庭成員
								</h3>
								<span className="text-sm text-gray-500">
									{familyMember.gender} ·{" "}
									{familyMember.birthDateTime.toLocaleDateString(
										"zh-CN"
									)}{" "}
									{familyMember.birthDateTime.toLocaleTimeString(
										"zh-CN",
										{ hour: "2-digit", minute: "2-digit" }
									)}
								</span>
							</div>
						</div>

						{/* 八字命盤 */}
						<div className="mb-6">
							<h4
								className="mb-3 text-lg font-bold"
								style={{
									fontFamily: '"Noto Serif TC", serif',
									fontWeight: 700,
								}}
							>
								八字命盤
							</h4>
							<div
								className="text-lg"
								style={{
									fontFamily: '"Noto Serif TC", serif',
									fontWeight: 900,
								}}
							>
								年柱-{familyMember.wuxingData.yearStem}
								{familyMember.wuxingData.yearBranch}， 月柱-
								{familyMember.wuxingData.monthStem}
								{familyMember.wuxingData.monthBranch}， 日柱-
								{familyMember.wuxingData.dayStem}
								{familyMember.wuxingData.dayBranch}， 時柱-
								{familyMember.wuxingData.hourStem}
								{familyMember.wuxingData.hourBranch}
							</div>
						</div>

						{/* Five Elements Analysis */}
						<div>
							<h4
								className="mb-3 text-lg font-bold"
								style={{
									fontFamily: '"Noto Serif TC", serif',
									fontWeight: 700,
								}}
							>
								五行分析
							</h4>

							{(() => {
								const { wuxingCounts, missingElements } =
									calculateWuxingAnalysis(
										familyMember.wuxingData
									);

								return (
									<>
										{/* Elements with counts */}
										<div className="flex flex-wrap gap-4 mb-4">
											{Object.entries(wuxingCounts).map(
												([element, count]) => (
													<div
														key={element}
														className="flex items-center gap-2"
													>
														<Image
															src={`/images/elements/${element}.png`}
															alt={element}
															width={24}
															height={24}
														/>
														<span
															className="text-lg font-bold"
															style={{
																color: wuxingColorMap[
																	element
																],
																fontFamily:
																	'"Noto Serif TC", serif',
																fontWeight: 700,
															}}
														>
															{element}: {count}
														</span>
													</div>
												)
											)}
										</div>

										{/* Missing elements */}
										{missingElements.length > 0 && (
											<div className="mt-3">
												<span
													className="text-sm text-gray-600"
													style={{
														fontFamily:
															'"Noto Serif TC", serif',
													}}
												>
													缺少五行:
												</span>
												<div className="flex flex-wrap gap-2 mt-1">
													{missingElements.map(
														(element) => (
															<div
																key={element}
																className="flex items-center gap-1"
															>
																<Image
																	src={`/images/elements/${element}.png`}
																	alt={
																		element
																	}
																	width={20}
																	height={20}
																	style={{
																		opacity: 0.5,
																	}}
																/>
																<span
																	className="text-sm"
																	style={{
																		color: wuxingColorMap[
																			element
																		],
																		fontFamily:
																			'"Noto Serif TC", serif',
																		opacity: 0.7,
																	}}
																>
																	{element}
																</span>
															</div>
														)
													)}
												</div>
											</div>
										)}
									</>
								);
							})()}
						</div>
					</div>
				</div>
			)}

			{/* Show option to add family member if none exists and prompt is hidden */}
			{!familyMember && !showPrompt && (
				<div className="py-12 text-center text-gray-500">
					<User size={48} className="mx-auto mb-4 opacity-50" />
					<p
						className="mb-4"
						style={{ fontFamily: '"Noto Serif TC", serif' }}
					>
						還沒有添加家庭成員
					</p>
					<Button
						variant="outline"
						onClick={() => setShowPrompt(true)}
						className="flex items-center gap-2 mx-auto"
					>
						<Plus size={16} />
						添加家庭成員
					</Button>
				</div>
			)}
		</div>
	);
}
