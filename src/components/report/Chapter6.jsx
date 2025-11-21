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
export default function ({
	locale,
	userInfo,
	jiajuProDataString,
	onSaveData,
	assistantDataString,
	isPrinting,
}) {
	const t = useTranslations("report.pro");
	const t2 = useTranslations("toast");
	const [activeRoom, setActiveRoom] = useState(null); // 当前激活的房间
	const [activeTab, setActiveTab] = useState("tab1");
	const [designData, setDesignData] = useState(null); //房间布局数据

	const [jiajuProData, setJiajuProData] = useState({});
	const [loading, setLoading] = useState(false);
	const [wuxingData, setWuxingData] = useState({});
	const [progress, setProgress] = useState(5);

	const getJiajuPrompt =
		locale === "zh-CN" ? getJiajuPromptZh : getJiajuPromptTw;
	const getJiajuUserData =
		locale === "zh-CN" ? getJiajuUserDataZh : getJiajuUserDataTw;

	useEffect(() => {
		if (jiajuProDataString) {
			const jiajuProData = JSON.parse(jiajuProDataString);
			setJiajuProData(jiajuProData);
		}
	}, [jiajuProDataString]);

	useEffect(() => {
		let wuxingData = {};
		if (userInfo) {
			wuxingData = getWuxingData(userInfo.birthDateTime, userInfo.gender);
			setWuxingData(wuxingData);
		}
		if (userInfo && designData && !jiajuProDataString) {
			if (!userInfo.isLock) {
				//toast.info(t2('generating'));
				//生成付费报告
				onGenerate(userInfo, wuxingData);
			}
		}
	}, [userInfo, designData, jiajuProDataString]);
	const fetchDesignData = (designData) => {
		setDesignData(designData);
	};
	const onSetActiveRoom = (room) => {
		setActiveRoom(room);
		setActiveTab("tab1");
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
				results.map((item, index) => {
					let obj = JSON.parse(item.data);
					let newObj = {};
					Object.keys(obj).forEach((key, index) => {
						newObj[`tab${index + 1}`] = obj[key];
					});

					newResults[roomIndexIdArr[index]] = newObj; //newResults: {bedroom-1:{tab1:xxx,tab2:yyy}}
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
						//// 更新进度条
						if (completed === total) {
							resolve(results);
						}
					})
					.catch(reject); // 如果任何一个promise失败，则立即拒绝主promise
			});
		});
	}

	return (
		<section className="relative">
			{loading && (
				<div className="absolute z-12 w-[80%] max-w-125 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
					<Line
						percent={progress}
						strokeWidth={2}
						strokeColor="#2db7f5"
						railWidth={2}
					/>{" "}
				</div>
			)}
			<AntdSpin
				size={"large"}
				spinning={loading}
				tip={t2(
					userInfo?.genStatus == "done"
						? "translating2"
						: "generating"
				)}
				className="bg-[#fff9]"
			>
				{/* <button onClick={() => { onGenerate(userInfo) }}>重新生成</button> */}
				<p className="md:mb-20 mb-10  md:px-0 px-2.5 font-bold leading-8 tracking-normal text-justify">
					<span className="text-sm leading-8">命主八字</span>
					<br />
					<span className="text-[#073E31] font-bold text-xl">
						{" "}
						{`${wuxingData.year}年、${wuxingData.month}月、${wuxingData.day}日、${wuxingData.hour}${t("hour")}`}
					</span>
				</p>

				<RoomCanvas
					activeRoom={activeRoom}
					setActiveRoom={onSetActiveRoom}
					onChangeDesignData={fetchDesignData}
				/>
				{activeRoom && !isPrinting && (
					<div className="w-full md:rounded-b-3xl bg-[#fafafa] md:p-8 p-5 border-1 border-[#E6E6E6]">
						<div className="flex items-center gap-2">
							<Image
								width={
									activeRoom?.data._type === "dining_room"
										? 28
										: 32
								}
								height={
									activeRoom?.data._type === "dining_room"
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
							{jiajuProData && (
								<Tabs
									value={activeTab}
									className="w-full gap-0"
									onValueChange={(value) =>
										setActiveTab(value)
									}
								>
									<TabsList className="justify-start gap-5 p-0 bg-transparent">
										<TabsTrigger
											defaultValue
											value="tab1"
											className="cursor-pointer pb-3  px-0 rounded-none bg-transparent text-sm md:text-base data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
										>
											{t("tab1")}
										</TabsTrigger>
										<TabsTrigger
											value="tab2"
											className="cursor-pointer pb-3  px-0 rounded-none bg-transparent text-sm md:text-base data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
										>
											{t("tab2")}
										</TabsTrigger>
										<TabsTrigger
											value="tab3"
											className="cursor-pointer pb-3  px-0 rounded-none bg-transparent text-sm md:text-base data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
										>
											{t("tab3")}
										</TabsTrigger>
										<TabsTrigger
											value="tab4"
											className="cursor-pointer pb-3  px-0 rounded-none bg-transparent text-sm md:text-base data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-[#333] data-[state=active]:bg-transparent"
										>
											{t("tab4")}
										</TabsTrigger>
									</TabsList>
									<Separator className="mb-5" />
									<TabsContent
										value="tab1"
										className="w-full leading-8"
									>
										{jiajuProData[activeRoom.id]?.tab1}
									</TabsContent>
									<TabsContent
										value="tab2"
										className="w-full leading-8"
									>
										{jiajuProData[activeRoom.id]?.tab2}
									</TabsContent>
									<TabsContent
										value="tab3"
										className="w-full leading-8"
									>
										{jiajuProData[activeRoom.id]?.tab3}
									</TabsContent>
									<TabsContent
										value="tab4"
										className="w-full leading-8"
									>
										{jiajuProData[activeRoom.id]?.tab4}
									</TabsContent>
								</Tabs>
							)}
						</div>
					</div>
				)}
			</AntdSpin>

			{/* 在页面上隐藏，打印时展示 */}
			{isPrinting && (
				<div className="w-full  bg-[#fafafa] md:p-8 p-5 border-1 border-[#E6E6E6]">
					{jiajuProData &&
						Object.entries(jiajuProData).map(
							([roomId, roomTabObj]) => {
								const roomlabel = getRoomLabel(roomId, locale);

								return (
									<div className="text-sm" key={roomId}>
										<p className="mt-3 mb-2 font-bold whitespace-nowrap text-primary">
											{roomlabel}：
										</p>

										{Object.entries(roomTabObj).map(
											([tabKey, tabValue]) => {
												return (
													<div key={roomId + tabKey}>
														<p className="font-bold whitespace-nowrap">
															{t(tabKey)}：
														</p>
														<span className="whitespace-pre-wrap">
															{" "}
															{tabValue}
														</span>
													</div>
												);
											}
										)}
									</div>
								);
							}
						)}
				</div>
			)}

			<div className="px-6 my-5 md:p-0">
				<p>
					<span className="text-[#FF531A]">*</span>
					{t("p6-1")}
				</p>
			</div>
		</section>
	);
}
