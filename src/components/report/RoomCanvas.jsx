"use client";
import _ from "lodash";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { get } from "@/lib/ajax";
import { ITEM_TYPES, ROOM_COLORS } from "@/types/room";
import { Trash2, Save, Minus, Plus, RotateCcwSquare } from "lucide-react";

import Image from "next/image";
import { useTranslations } from "next-intl";
const CANVAS_PADDING = 200; // 画布边缘预留空间
const MAX_SCALE = 120;
const MIN_SCALE = 50;

export default function ({
	activeRoom,
	setActiveRoom,
	onChangeDesignData,
	onChangeRoomList,
}) {
	const t = useTranslations("report");

	const [designData, setDesignData] = useState({});
	//const [position, setPosition] = useState({ x: 0, y: 0 });
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
	const [scale, setScale] = useState(100); // 缩放比例，初始为100%
	const [compassRotation, setCompassRotation] = useState(0);
	const [roomList, setRoomList] = useState([]); // 所有房间列表

	const [showMenu, setShowMenu] = useState(false);
	const { data: session } = useSession();

	useEffect(() => {
		const userId = session?.user?.userId;
		if (!userId) return;
		const loadData = async () => {
			const { data: designData } = await get(`/api/design/${userId}`);
			setScale(designData.scale);
			setCompassRotation(designData.compassRotation);
			//计算最边缘的家具位置，设置画布大小
			let rooms = designData.localItems;
			if (!rooms || rooms.length === 0) return;
			let roomList = rooms.filter((item) => item._type === "room");
			setRoomList(roomList);
			setActiveRoom(roomList[0]);
			let minX = rooms[0].position.x,
				minY = rooms[0].position.y,
				maxX = rooms[0].position.x + rooms[0].size.width,
				maxY = rooms[0].position.y + rooms[0].size.height;
			rooms.forEach((room) => {
				if (room.position.x < minX) {
					minX = room.position.x;
				}
				if (room.position.y < minY) {
					minY = room.position.y;
				}
				if (room.position.x + room.size.width > maxX) {
					maxX = room.position.x + room.size.width;
				}
				if (room.position.y + room.size.height > maxY) {
					maxY = room.position.y + room.size.height;
				}
			});
			let newItems = rooms.map((item) => {
				return {
					...item,
					position: {
						x: item.position.x - minX + CANVAS_PADDING / 2,
						y: item.position.y - minY + CANVAS_PADDING / 2,
					},
				};
			});
			const newDesignData = {
				...designData,
				localItems: newItems,
			};
			setDesignData(newDesignData);
			if (onChangeDesignData) {
				onChangeDesignData(newDesignData);
			}
			if (onChangeRoomList) {
				onChangeRoomList(roomList);
			}
			setCanvasSize({
				width: maxX - minX + CANVAS_PADDING,
				height: maxY - minY + CANVAS_PADDING,
			});
		};

		loadData();
	}, [session?.user?.userId]);

	if (!designData.localItems) return "";
	function handleZoom(type, step = 5) {
		let newScale;
		if (type === "in" && scale < MAX_SCALE) {
			newScale = scale + step;
		} else if (type === "out" && scale > MIN_SCALE) {
			newScale = scale - step;
		} else if (type === "reset") {
			newScale = 100;
		} else {
			return;
		}
		// if (type === 'out') {
		//     setCanvasSize({
		//         width: (canvasSize.width - (position.x < 0 ? position.x : 0)) * (1 + (scale - newScale) / 100),
		//         height: (canvasSize.height - (position.y < 0 ? position.y : 0)) * (1 + (scale - newScale) / 100)
		//     })
		// }
		setScale(newScale);
	}
	const onRoomClick = (room) => {
		setActiveRoom(room);
	};

	const onHandleActiveRoom = (room) => {
		setActiveRoom(room);
	};

	// translate(${position.x}px, ${position.y}px)
	return (
		<div className="relative canvasImage">
			<div className="relative  rounded-t-3xl py-[2px] mt-8 overflow-scroll">
				<div
					onClick={() => setShowMenu(false)}
					className="relative flex justify-center w-full h-135"
					style={{ minWidth: canvasSize.width }}
				>
					<div
						id="roomCanvas"
						className="absolute cursor-not-allowed"
						style={{
							width: `${canvasSize.width}px`,
							height: `${canvasSize.height}px`,
							transform: `scale(${scale / 100})`,
							transformOrigin: "top left",
							// backgroundImage:
							//     "radial-gradient(circle, #ddd 1px, transparent 1px)",
							// backgroundSize: "10px 10px",
						}}
					>
						<div className="relative">
							{designData.localItems.map((item) => {
								if (item._type === ITEM_TYPES.ROOM) {
									return (
										<div
											// id={item.id}
											key={item.id}
											data-room-element="true"
											className={`absolute ${
												activeRoom?.id === item.id
													? "ring-2 ring-red-500"
													: ""
											} cursor-move z-100`}
											style={{
												left: item.position.x,
												top: item.position.y,
												width: item.size.width,
												height: item.size.height,
												// transform: `scale(${scale / 100})`,
												// transformOrigin: "center",
											}}
											onClick={(e) => {
												e.stopPropagation();
												onHandleActiveRoom(item);
											}}
											// onMouseDown={(e) => handleRoomMouseDown(e, item)}
											// onTouchStart={(e) => handleRoomMouseDown(e, item)}
										>
											<div
												className="w-full h-full"
												style={{
													border:
														item._type ===
														ITEM_TYPES.ROOM
															? "8px solid"
															: "none",
													borderColor:
														item._type ===
														ITEM_TYPES.ROOM
															? ROOM_COLORS[
																	item.data
																		._type
																]
															: "transparent",
													borderRadius: "8px",
													backgroundColor:
														ROOM_COLORS[
															item.data._type
														] + "80",
												}}
											>
												<div
													className="absolute top-2 left-2 text-[14px] text-[#888888]"
													style={{
														zIndex: 1,
													}}
												>
													{item.data.label}
												</div>
											</div>
										</div>
									);
								} else if (
									item._type === ITEM_TYPES.FURNITURE
								) {
									return (
										<div
											key={item.id}
											data-room-element="true"
											className={`absolute cursor-move z-200`}
											style={{
												left: item.position.x,
												top: item.position.y,
												width: item.size.width,
												height: item.size.height,
												// transform: `translate(${position.x}px, ${position.y}px)`,
												// transformOrigin: "center",
											}}
											// onClick={(e) => {
											//     e.stopPropagation();
											//     onHandleActiveRoom(item);
											// }}
											// onMouseDown={(e) => {
											//     e.stopPropagation();
											//     handleRoomMouseDown(e, item);
											// }}
											// onTouchStart={(e) => {
											//     e.stopPropagation();
											//     handleRoomMouseDown(e, item);
											// }}
										>
											<Image
												draggable="false"
												className={
													activeRoom?.id === item.id
														? "ring-2 ring-red-500"
														: ""
												}
												style={{
													transform: item.rotation
														? `rotate(${item.rotation}deg)`
														: "none",
													transformOrigin: "center",
												}}
												//  objectFit= 'contain'
												src={item.activeIcon}
												alt="Furniture"
												width={item.size.width}
												height={item.size.height}
											/>
										</div>
									);
								}
							})}
						</div>
					</div>
				</div>
			</div>
			{/* 指南针 */}
			<div
				style={{
					transform: `rotate(${compassRotation}deg)`,
					transition: "transform 0.3s ease-out",
				}}
				// onClick={onCompassClick}
				className="absolute flex flex-col items-center top-5 right-5"
			>
				<div className="text-sm text-gray-600">N</div>

				<Image
					src="/images/compass.png"
					alt="方向"
					width={40}
					height={40}
					// className="cursor-pointer"
				/>
				{/* 显示当前角度 */}
			</div>
			{/* 缩放控制 */}
			<div className="absolute flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-lg top-120 right-5">
				<button
					className="p-1 text-gray-600 rounded hover:bg-gray-100"
					onClick={(e) => handleZoom("out")}
					disabled={scale <= 50}
				>
					<Minus className="w-4 h-4" />
				</button>
				<span className="text-sm font-medium text-gray-600 min-w-[48px] text-center">
					{scale}%
				</span>
				<button
					className="p-1 text-gray-600 rounded hover:bg-gray-100"
					onClick={(e) => handleZoom("in")}
					disabled={scale >= 120}
				>
					<Plus className="w-4 h-4" />
				</button>
			</div>
			{/* 目录结构 */}

			<div
				onClick={() => setShowMenu(true)}
				className="absolute z-20 flex items-center justify-center w-10 h-10 text-xs rounded-full shadow-lg cursor-pointer top-120 left-5"
			>
				{showMenu && (
					<div className="absolute left-0 w-20 px-4 py-4 overflow-y-auto text-sm bg-white rounded-lg shadow-lg bottom-10 report-menu max-h-110">
						{roomList.map((room, i) => (
							<div
								key={i}
								className={`text-sm mb-4 cursor-pointer ${activeRoom?.id === room.id ? "text-[#20B580]" : ""}`}
								onClick={() => onRoomClick(room)}
							>
								{room.data.label}
							</div>
						))}
					</div>
				)}
				<span>{t("catelog")}</span>
			</div>
		</div>
	);
}
