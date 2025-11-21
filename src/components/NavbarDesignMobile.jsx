import { Save, UserPen, Menu, CircleHelp, X } from "lucide-react";
import Undo from "./canvasComp/Undo";
import { useState } from "react";
import MenuBar from "./MenuBar";
import Avatar from "@/components/Avatar";
import { useTranslations } from "next-intl";
export default function NavbarDesignMobile({
	onSaveProject,
	history,
	historyIndex,
	handleUndo,
	handleRedo,
	onUserOpen,
}) {
	const [showTip, setShowTip] = useState(false);
	const t = useTranslations("design");
	return (
		<div className="fixed top-0 left-0 right-0 z-50">
			<nav className="h-16 bg-white border-b-2 border-b-gray-100 ">
				<div className="h-full px-4 mx-auto">
					<div className="flex items-center justify-between h-full">
						<div className="flex items-center gap-3 space-x-4 text-foreground">
							<Undo
								history={history}
								historyIndex={historyIndex}
								handleUndo={handleUndo}
								handleRedo={handleRedo}
							/>
							<span
								className="flex items-center gap-1 cursor-pointer"
								onClick={onSaveProject}
							>
								<Save className="w-4 h-4" />{" "}
							</span>
						</div>

						<div className="flex items-center gap-3 space-x-4 text-foreground">
							<span className="flex items-center gap-1 cursor-pointer">
								<CircleHelp
									className="w-4 h-4"
									onClick={() => setShowTip(true)}
								/>
							</span>
							<span className="flex items-center gap-1 cursor-pointer">
								<UserPen
									className="w-4 h-4"
									onClick={() => onUserOpen(true)}
								/>{" "}
							</span>
							{/* <MenuBar className="text-foreground" /> */}
							<Avatar />
						</div>
					</div>
				</div>
			</nav>
			{showTip && (
				<div className="h-8 w-full bg-[#E5F4FF] px-6 py-3 flex justify-between items-center">
					<span className="text-[12px] text-foreground flex items-center gap-1">
						<CircleHelp className="w-4 h-4 text-[#888]" />
						{t("warning")}
					</span>
					<X
						className="w-4 h-4 text-[#888]"
						onClick={() => setShowTip(false)}
					/>
				</div>
			)}
		</div>
	);
}
