import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { DraggableItem } from "../DraggableItem";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
export default function DragBarMobile(props) {
	const {
		showTab,
		setShowTab,
		roomItems,
		furnitureItems,
		isOverCanvas,
		draggingItemSize,
	} = props;
	const [active, setActive] = useState("");
	const t = useTranslations("design");
	useEffect(() => {
		setActive("room");
	}, []);
	return (
		<div
			style={{
				boxShadow: "0 -1px 5px 0px rgba(0, 0, 0, 0.2)",
			}}
			className={cn(
				"fixed bottom-0 left-0 z-10 w-full pb-20 pl-0 pr-2 bg-white md:hidden rounded-t-2xl transition-transform duration-300 ease-in-out",
				showTab ? "translate-y-0" : "translate-y-full"
			)}
		>
			<Tabs
				value={active}
				className="w-full gap-4"
				setShowTab={setShowTab}
				onValueChange={(value) => setActive(value)}
			>
				<TabsList className="gap-8 mx-auto bg-white ">
					<TabsTrigger
						defaultValue
						value="room"
						className="rounded-[3px] text-[12px] font-bold data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
					>
						{t("room")}
					</TabsTrigger>
					<TabsTrigger
						value="furniture"
						className="rounded-[3px] text-[12px] font-bold data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
					>
						{t("furniture")}
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value="room"
					className="w-full pb-3 overflow-hidden sidebar-rooms sidebar-furniture"
				>
					<Carousel>
						<CarouselContent>
							<CarouselItem>
								<div className="grid grid-cols-4 gap-x-8 gap-y-6 ">
									{roomItems.slice(0, 8).map((item) => (
										<DraggableItem
											key={item.id}
											id={item.id}
											type={item.type}
											data={item.data}
											isOverCanvas={isOverCanvas}
										>
											<div className="flex flex-col items-center">
												<div className="flex items-center justify-center transition-colors bg-gray-100 rounded-lg w-14 h-14 hover:bg-gray-200">
													<Image
														className="bg-[#EFF7F4] rounded-lg"
														src={item.data.icon}
														alt={item.data.label}
														width={draggingItemSize}
														height={
															draggingItemSize
														}
														priority
													/>
												</div>
												<span className="mt-1 text-[12px] text-gray-600">
													{item.data.label}
												</span>
											</div>
										</DraggableItem>
									))}
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="grid grid-cols-4 gap-x-8 gap-y-6 ">
									{roomItems.slice(8).map((item) => (
										<DraggableItem
											key={item.id}
											id={item.id}
											type={item.type}
											data={item.data}
											isOverCanvas={isOverCanvas}
										>
											<div className="flex flex-col items-center">
												<div className="flex items-center justify-center transition-colors bg-gray-100 rounded-lg w-14 h-14 hover:bg-gray-200">
													<Image
														className="bg-[#EFF7F4] rounded-lg"
														src={item.data.icon}
														alt={item.data.label}
														width={draggingItemSize}
														height={
															draggingItemSize
														}
														priority
													/>
												</div>
												<span className="mt-1 text-[12px] text-gray-600">
													{item.data.label}
												</span>
											</div>
										</DraggableItem>
									))}
								</div>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="left-0 " />
						<CarouselNext className="right-0" />
					</Carousel>
					{/* <div className="grid grid-cols-6 gap-x-8 gap-y-4 min-w-110 ">
                       
                    </div> */}
				</TabsContent>
				<TabsContent
					value="furniture"
					className="w-full pb-3 overflow-hidden "
				>
					<Carousel>
						<CarouselContent>
							<CarouselItem>
								<div className="grid grid-cols-4 gap-x-8 gap-y-6 ">
									{furnitureItems.slice(0, 8).map((item) => (
										<DraggableItem
											key={item.id}
											id={item.id}
											type={item.type}
											data={item.data}
											isOverCanvas={isOverCanvas}
										>
											<div className="flex flex-col items-center">
												<div className="flex items-center justify-center transition-colors bg-gray-100 rounded-lg w-14 h-14 hover:bg-gray-200">
													<Image
														className="bg-[#EFF7F4] rounded-lg"
														src={item.data.icon}
														alt={item.data.label}
														width={draggingItemSize}
														height={
															draggingItemSize
														}
													/>
												</div>
												<span className="mt-1 text-[12px] text-gray-600">
													{item.data.label}
												</span>
											</div>
										</DraggableItem>
									))}
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="grid grid-cols-4 gap-x-8 gap-y-6 ">
									{furnitureItems.slice(8, 16).map((item) => (
										<DraggableItem
											key={item.id}
											id={item.id}
											type={item.type}
											data={item.data}
											isOverCanvas={isOverCanvas}
										>
											<div className="flex flex-col items-center">
												<div className="flex items-center justify-center transition-colors bg-gray-100 rounded-lg w-14 h-14 hover:bg-gray-200">
													<Image
														className="bg-[#EFF7F4] rounded-lg"
														src={item.data.icon}
														alt={item.data.label}
														width={draggingItemSize}
														height={
															draggingItemSize
														}
													/>
												</div>
												<span className="mt-1 text-[12px] text-gray-600">
													{item.data.label}
												</span>
											</div>
										</DraggableItem>
									))}
								</div>
							</CarouselItem>
							<CarouselItem>
								<div className="grid grid-cols-4 gap-x-8 gap-y-6">
									{furnitureItems.slice(16).map((item) => (
										<DraggableItem
											key={item.id}
											id={item.id}
											type={item.type}
											data={item.data}
											isOverCanvas={isOverCanvas}
										>
											<div className="flex flex-col items-center">
												<div className="flex items-center justify-center transition-colors bg-gray-100 rounded-lg w-14 h-14 hover:bg-gray-200">
													<Image
														className="bg-[#EFF7F4] rounded-lg"
														src={item.data.icon}
														alt={item.data.label}
														width={draggingItemSize}
														height={
															draggingItemSize
														}
													/>
												</div>
												<span className="mt-1 text-[12px] text-gray-600">
													{item.data.label}
												</span>
											</div>
										</DraggableItem>
									))}
								</div>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="left-0 " />
						<CarouselNext className="right-0" />
					</Carousel>
				</TabsContent>
			</Tabs>
		</div>
	);
}
