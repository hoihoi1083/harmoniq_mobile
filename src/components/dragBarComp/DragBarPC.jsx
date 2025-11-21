import { DraggableItem } from "../DraggableItem";
import { Canvas } from "../Canvas";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

export default function DragBarPC(props) {
	const {
		sidebarRef,
		roomItems,
		furnitureItems,
		isOverCanvas,
		draggingItemSize,
	} = props;
	const t = useTranslations("design");

	return (
		<ScrollArea className="h-[calc(100vh-64px)] w-1/6">
			<div
				ref={sidebarRef}
				className="hidden p-4 bg-white border-r-2 shadow md:block border-r-gray-100"
			>
				{/* Rooms section with demo data attribute */}
				<div className="mb-8" data-demo-area="sidebar-rooms">
					<h3 className="mb-4 text-2xl font-semibold">{t("room")}</h3>
					<div className="grid gap-2 2xl:grid-cols-3 xl:grid-cols-2 sidebar-rooms">
						{roomItems.map((item) => (
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
											height={draggingItemSize}
											priority
										/>
									</div>
									<span className="mt-1 text-sm text-gray-600">
										{item.data.label}
									</span>
								</div>
							</DraggableItem>
						))}
					</div>
				</div>

				{/* Furniture section with demo data attribute */}
				<div data-demo-area="sidebar-furniture">
					<h3 className="mb-4 text-2xl font-semibold">
						{t("furniture")}
					</h3>
					<div className="grid gap-2 2xl:grid-cols-3 xl:grid-cols-2 sidebar-furniture">
						{furnitureItems.map((item) => (
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
											height={draggingItemSize}
											priority
										/>
									</div>
									<span className="mt-1 text-sm text-gray-600">
										{item.data.label}
									</span>
								</div>
							</DraggableItem>
						))}
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}
