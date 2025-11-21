"use client";
import _ from "lodash";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import RoomCanvas from "./RoomCanvas";
import getWuxingData from "@/lib/nayin";
import { post } from "@/lib/ajax";
import { AntdSpin } from "antd-spin";
import { toast } from "react-toastify";
import { Separator } from "@/components/ui/separator";
import {
	getJiajuPrompt as getJiajuPromptZh,
	getJiajuUserData as getJiajuUserDataZh,
} from "./utilsZh";
import {
	getJiajuPrompt as getJiajuPromptTw,
	getJiajuUserData as getJiajuUserDataTw,
} from "./utilsTw";
import { getRoomLabel } from "@/lib/utils";
import { Line } from "@rc-component/progress";
import { ChevronDown } from "lucide-react";

export default function Chapter3({
	locale,
	userInfo,
	jiajuProDataString,
	onSaveData,
	assistantDataString,
	isPrinting,
	jiajuDataString,
}) {
	// All hooks at the top level - no conditional hooks
	const t = useTranslations("report.pro");
	const t2 = useTranslations("toast");
	const [activeRoom, setActiveRoom] = useState(null);
	const [activeTab, setActiveTab] = useState("tab0");
	const [designData, setDesignData] = useState(null);
	const [roomList, setRoomList] = useState([]);
	const [jiajuProData, setJiajuProData] = useState({});
	const [loading, setLoading] = useState(false);
	const [wuxingData, setWuxingData] = useState({});
	const [progress, setProgress] = useState(5);
	const [showDropdown, setShowDropdown] = useState(false);

	// Derived values (not state)
	const getJiajuPrompt =
		locale === "zh-CN" ? getJiajuPromptZh : getJiajuPromptTw;
	const getJiajuUserData =
		locale === "zh-CN" ? getJiajuUserDataZh : getJiajuUserDataTw;
	const jiajuData = jiajuDataString ? JSON.parse(jiajuDataString) : {};
	const hasJiajuProData =
		jiajuProData && Object.keys(jiajuProData).length > 0;

	useEffect(() => {
		if (jiajuProDataString) {
			try {
				const parsedData = JSON.parse(jiajuProDataString);
				setJiajuProData(parsedData);
			} catch (error) {setJiajuProData({});
			}
		}
	}, [jiajuProDataString]);

	useEffect(() => {
		if (userInfo) {
			const wuxingData = getWuxingData(
				userInfo.birthDateTime,
				userInfo.gender
			);
			setWuxingData(wuxingData);

			if (designData && !jiajuProDataString && !userInfo.isLock) {
				onGenerate(userInfo, wuxingData);
			}
		}
	}, [userInfo, designData, jiajuProDataString]);

	const fetchDesignData = (designData) => {
		setDesignData(designData);
	};

	const fetchRoomList = (roomList) => {
		setRoomList(roomList);
	};

	const onSetActiveRoom = (room) => {
		setActiveRoom(room);
		setActiveTab("tab0");
	};

	const onGenerate = (userInfo, _wuxingData) => {setProgress(0);
		const systemPrompt = getJiajuPrompt();
		const rooms = designData.localItems.filter(
			(item) => item._type === "room"
		);
		const furnitures = designData.localItems.filter(
			(item) => item._type === "furniture"
		);

		const newRooms = rooms.map((room) => {
			let furList = furnitures
				.filter(
					(furniture) => furniture.data.parentRoom?.id === room.id
				)
				.map(
					(item) =>
						`{家具类型: ${item.data.label.split("-")[1]} ，家具坐标：x-${item.position.x},y-${item.position.y}}`
				);

			return {
				...room,
				furListStr: furList.toString(),
			};
		});

		const roomIndexIdArr = rooms.map((item) => item.id);
		let transAssistantData = assistantDataString
			? JSON.parse(assistantDataString)
			: {};
		let fix = userInfo.genStatus === "done" ? t("transfer") : "";
		setLoading(true);

		const promises = newRooms.map((room) =>
			post("/api/generateCode", {
				user: getJiajuUserData(
					room,
					userInfo,
					_wuxingData || wuxingData
				),
				system: fix + systemPrompt,
				assistant:
					userInfo.genStatus === "done"
						? JSON.stringify(transAssistantData[room.id])
						: "",
				jsonResult: true,
			})
		);

		createProgressivePromiseAll(promises)
			.then(async (results) => {
				setLoading(false);
				let newResults = {};
				results.forEach((item, index) => {
					let obj = JSON.parse(item.data);
					let newObj = {};
					Object.keys(obj).forEach((key, objIndex) => {
						newObj[`tab${objIndex + 1}`] = obj[key];
					});
					newResults[roomIndexIdArr[index]] = newObj;
				});
				setJiajuProData(newResults);onSaveData(newResults);
			})
			.catch((e) => {
				setLoading(false);
				toast.error(
					"家居风水进阶分析生成错误，请稍后刷新此页面重试。" +
						e.message,
					{ autoClose: false }
				);
			});
	};

	function createProgressivePromiseAll(promises) {
		const results = [];
		let completed = 0;
		const total = promises.length;

		return new Promise((resolve, reject) => {
			promises.forEach((promise, index) => {
				promise
					.then((result) => {
						if (result.status !== 0) {
							throw new Error(result.message);
						}
						results[index] = result;
						completed++;
						const progress = completed / total;
						setProgress(progress * 100);
						if (completed === total) {
							resolve(results);
						}
					})
					.catch(reject);
			});
		});
	}

	const getCurrentTabLabel = () => {
		switch (activeTab) {
			case "tab0":
				return "佈局基本分析";
			case "tab1":
				return t("tab1");
			case "tab2":
				return t("tab2");
			case "tab3":
				return t("tab3");
			case "tab4":
				return t("tab4");
			default:
				return "佈局基本分析";
		}
	};

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		setShowDropdown(false);
	};

	// Render tab content based on activeTab
	const renderTabContent = () => {
		if (activeTab === "tab0") {
			return (
				<div className="mt-3">
					{jiajuData &&
						jiajuData[activeRoom?.data._type] &&
						jiajuData[activeRoom?.data._type][
							activeRoom?.direction
						] &&
						Object.entries(
							jiajuData[activeRoom?.data._type][
								activeRoom?.direction
							]
						).map(([key, value]) => (
							<p key={key} className="flex leading-8">
								<span className="font-bold whitespace-nowrap min-w-22.5">
									{key}：
								</span>
								<span className="whitespace-pre-wrap">
									{value}
								</span>
							</p>
						))}
				</div>
			);
		}

		if (hasJiajuProData && activeRoom && jiajuProData[activeRoom.id]) {
			const tabValue = jiajuProData[activeRoom.id][activeTab];
			return (
				<div className="mt-3">
					{(tabValue || "")
						.toString()
						.replace(/\\n/g, "\n") // Convert literal \\n to actual \n
						.split("\n")
						.map((line, index) => (
							<div key={index} className="mb-1">
								{line.trim() || "\u00A0"}
							</div>
						))}
				</div>
			);
		}

		return null;
	};

	return (
		<section className="relative">
			{loading && (
				<div className="absolute z-12 w-[80%] max-w-125 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
					<Line
						percent={progress}
						strokeWidth={2}
						strokeColor="#2db7f5"
						railWidth={2}
					/>
				</div>
			)}

			<AntdSpin
				size="large"
				spinning={loading}
				tip={t2(
					userInfo?.genStatus === "done"
						? "translating2"
						: "generating"
				)}
				className="bg-[#fff9]"
			>
				{/* Card Container */}
				<div className="w-[82%] mb-10 mx-auto bg-white rounded-[60px] shadow-md p-6 md:p-8">
					<p className="md:mb-20 mb-10 md:px-0 px-2.5 font-bold leading-8 tracking-normal text-justify">
						<span className="text-sm leading-8">命主八字</span>
						<br />
						<span className="text-[#073E31] font-bold text-xl">
							{`${wuxingData.year}年、${wuxingData.month}月、${wuxingData.day}日、${wuxingData.hour}${t("hour")}`}
						</span>
					</p>

					<RoomCanvas
						activeRoom={activeRoom}
						setActiveRoom={onSetActiveRoom}
						onChangeDesignData={fetchDesignData}
						onChangeRoomList={fetchRoomList}
					/>

					{/* Room Tabs - Show all rooms horizontally */}
					{roomList.length > 0 && !isPrinting && (
						<div className="w-full mt-8">
							{/* Room Selection Tabs */}
							<div className="flex flex-wrap justify-between mb-6">
								{roomList.map((room) => (
									<button
										key={room.id}
										onClick={() => onSetActiveRoom(room)}
										className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
											activeRoom?.id === room.id
												? "border-[#066952] bg-[#066952] text-white shadow-md"
												: "border-gray-200 bg-white text-gray-700 hover:border-[#066952] hover:bg-gray-50"
										}`}
									>
										<Image
											width={24}
											height={24}
											alt=""
											src={`/images/report/${room.data._type}.svg`}
											className={
												activeRoom?.id === room.id
													? "brightness-0 invert"
													: ""
											}
										/>
										<span className="text-sm font-medium md:text-base">
											{room.data.label}
										</span>
									</button>
								))}
							</div>

							{/* Active Room Content */}
							{activeRoom && (
								<div className="w-full p-5 bg-white border border-gray-200 rounded-lg md:p-8">
									<div className="flex items-center gap-2 mb-6">
										<Image
											width={
												activeRoom?.data._type ===
												"dining_room"
													? 28
													: 32
											}
											height={
												activeRoom?.data._type ===
												"dining_room"
													? 28
													: 32
											}
											style={{ color: "red" }}
											alt=""
											src={`/images/report/${activeRoom?.data._type}.svg`}
										/>
										<h2 className="text-xl font-bold">
											{activeRoom?.data.label}
										</h2>
									</div>

									<div className="mt-8">
										{/* Mobile Dropdown */}
										<div className="block mb-5 md:hidden">
											<div className="relative">
												<button
													onClick={() =>
														setShowDropdown(
															!showDropdown
														)
													}
													className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium bg-white border border-gray-200 rounded-lg"
												>
													<span>
														{getCurrentTabLabel()}
													</span>
													<ChevronDown
														className={`w-4 h-4 transition-transform ${
															showDropdown
																? "rotate-180"
																: ""
														}`}
													/>
												</button>

												{showDropdown && (
													<div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
														<button
															onClick={() =>
																handleTabChange(
																	"tab0"
																)
															}
															className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
																activeTab ===
																"tab0"
																	? "bg-blue-50 text-blue-600 font-medium"
																	: ""
															}`}
														>
															佈局基本分析
														</button>

														{hasJiajuProData && (
															<>
																<button
																	onClick={() =>
																		handleTabChange(
																			"tab1"
																		)
																	}
																	className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
																		activeTab ===
																		"tab1"
																			? "bg-blue-50 text-blue-600 font-medium"
																			: ""
																	}`}
																>
																	{t("tab1")}
																</button>
																<button
																	onClick={() =>
																		handleTabChange(
																			"tab2"
																		)
																	}
																	className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
																		activeTab ===
																		"tab2"
																			? "bg-blue-50 text-blue-600 font-medium"
																			: ""
																	}`}
																>
																	{t("tab2")}
																</button>
																<button
																	onClick={() =>
																		handleTabChange(
																			"tab3"
																		)
																	}
																	className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
																		activeTab ===
																		"tab3"
																			? "bg-blue-50 text-blue-600 font-medium"
																			: ""
																	}`}
																>
																	{t("tab3")}
																</button>
																<button
																	onClick={() =>
																		handleTabChange(
																			"tab4"
																		)
																	}
																	className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
																		activeTab ===
																		"tab4"
																			? "bg-blue-50 text-blue-600 font-medium"
																			: ""
																	}`}
																>
																	{t("tab4")}
																</button>
															</>
														)}
													</div>
												)}
											</div>
										</div>

										{/* Desktop Tabs */}
										<div className="hidden md:block">
											<Tabs
												value={activeTab}
												className="w-full gap-0"
												onValueChange={setActiveTab}
											>
												<TabsList className="justify-start gap-40 p-0 bg-transparent">
													<TabsTrigger
														value="tab0"
														className="cursor-pointer pb-3 px-0 rounded-none bg-transparent text-[24px] font-extrabold text-[#434343] data-[state=active]:font-extrabold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
														style={{
															fontFamily:
																"Noto Serif TC, serif",
															fontWeight: 800,
														}}
													>
														佈局基本分析
													</TabsTrigger>

													{hasJiajuProData && (
														<>
															<TabsTrigger
																value="tab1"
																className="cursor-pointer pb-3 px-0 rounded-none bg-transparent text-[24px] font-extrabold text-[#434343] data-[state=active]:font-extrabold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
																style={{
																	fontFamily:
																		"Noto Serif TC, serif",
																	fontWeight: 800,
																}}
															>
																{t("tab1")}
															</TabsTrigger>
															<TabsTrigger
																value="tab2"
																className="cursor-pointer pb-3 px-0 rounded-none bg-transparent text-[24px] font-extrabold text-[#434343] data-[state=active]:font-extrabold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
																style={{
																	fontFamily:
																		"Noto Serif TC, serif",
																	fontWeight: 800,
																}}
															>
																{t("tab2")}
															</TabsTrigger>
															<TabsTrigger
																value="tab3"
																className="cursor-pointer pb-3 px-0 rounded-none bg-transparent text-[24px] font-extrabold text-[#434343] data-[state=active]:font-extrabold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
																style={{
																	fontFamily:
																		"Noto Serif TC, serif",
																	fontWeight: 800,
																}}
															>
																{t("tab3")}
															</TabsTrigger>
															<TabsTrigger
																value="tab4"
																className="cursor-pointer pb-3 px-0 rounded-none bg-transparent text-[24px] font-extrabold text-[#434343] data-[state=active]:font-extrabold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
																style={{
																	fontFamily:
																		"Noto Serif TC, serif",
																	fontWeight: 800,
																}}
															>
																{t("tab4")}
															</TabsTrigger>
														</>
													)}
												</TabsList>
												<Separator className="mb-5" />

												<TabsContent
													value="tab0"
													className="w-full leading-8"
												>
													{renderTabContent()}
												</TabsContent>
												{hasJiajuProData && (
													<>
														<TabsContent
															value="tab1"
															className="w-full leading-8"
														>
															{renderTabContent()}
														</TabsContent>
														<TabsContent
															value="tab2"
															className="w-full leading-8"
														>
															{renderTabContent()}
														</TabsContent>
														<TabsContent
															value="tab3"
															className="w-full leading-8"
														>
															{renderTabContent()}
														</TabsContent>
														<TabsContent
															value="tab4"
															className="w-full leading-8"
														>
															{renderTabContent()}
														</TabsContent>
													</>
												)}
											</Tabs>
										</div>

										{/* Mobile Content Area */}
										<div className="block md:hidden">
											<div className="w-full leading-8">
												{renderTabContent()}
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					<div className="px-6 my-5 md:p-0">
						<p>
							<span className="text-[#FF531A]">*</span>
							{t("p6-1")}
						</p>
					</div>
				</div>
			</AntdSpin>

			{/* Print section - outside the card */}
			{isPrinting && (
				<div className="w-full p-5 bg-white md:p-8 ">
					<div className="mb-8">
						<h3 className="mb-4 text-lg font-bold text-primary">
							佈局基本分析
						</h3>
						{roomList.map((room) => (
							<div key={`basic-${room.id}`} className="mb-6">
								<h4 className="text-md font-bold text-[#073E31] mb-2">
									{room.data.label}
								</h4>
								{jiajuData &&
									jiajuData[room.data._type] &&
									jiajuData[room.data._type][
										room.direction
									] &&
									Object.entries(
										jiajuData[room.data._type][
											room.direction
										]
									).map(([key, value]) => (
										<p
											key={key}
											className="flex text-sm leading-8"
										>
											<span className="font-bold whitespace-nowrap min-w-22.5">
												{key}：
											</span>
											<span className="whitespace-pre-wrap">
												{value}
											</span>
										</p>
									))}
							</div>
						))}
					</div>

					{hasJiajuProData &&
						Object.entries(jiajuProData).map(
							([roomId, roomTabObj]) => {
								const roomlabel = getRoomLabel(roomId, locale);
								return (
									<div className="text-sm" key={roomId}>
										<p className="mt-3 mb-2 font-bold whitespace-nowrap text-primary">
											{roomlabel}：
										</p>
										{Object.entries(roomTabObj).map(
											([tabKey, tabValue]) => (
												<div
													key={roomId + tabKey}
													className="mb-4"
												>
													<p className="font-bold whitespace-nowrap">
														{t(tabKey)}：
													</p>
													<div className="mt-1">
														{(tabValue || "")
															.toString()
															.replace(
																/\\n/g,
																"\n"
															) // Convert literal \\n to actual \n
															.split("\n")
															.map(
																(
																	line,
																	index
																) => (
																	<div
																		key={
																			index
																		}
																		className="mb-1"
																	>
																		{line.trim() ||
																			"\u00A0"}
																	</div>
																)
															)}
													</div>
												</div>
											)
										)}
									</div>
								);
							}
						)}
				</div>
			)}
		</section>
	);
}
