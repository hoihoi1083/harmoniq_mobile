import { useSession, signOut } from "next-auth/react";
import { useMobileAuth } from "@/hooks/useMobileAuth";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";

export default function Avatar({ from }) {
	const t = useTranslations("home.hero");
	const t2 = useTranslations("toast");
	const router = useRouter();
	const { data: session } = useSession();
	const { mobileSession, clearMobileSession, isMobile: isCapacitorMobile } = useMobileAuth();

	// Use mobile session if on mobile, otherwise use web session
	const effectiveSession =
		isCapacitorMobile && mobileSession ? mobileSession : session;

	const handleLogout = async () => {
		toast.info(t2("loading"), { autoClose: 2000 });
		try {
			if (isCapacitorMobile) {
				// Handle mobile logout
				await clearMobileSession();
			} else {
				// Use client-side signOut instead of server action
				await signOut({
					redirect: false, // Don't redirect automatically
				});
			}

			// Manually redirect after logout
			router.push("/auth/login");

			// Optional: Show success toast
			toast.success("Logged out successfully", { autoClose: 1000 });
		} catch (error) {
			toast.error("Logout failed", { autoClose: 2000 });
		}
	};

	if (!effectiveSession?.user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center outline-none overflow-hidden bg-[#b4b4b4]">
					{effectiveSession.user.image ? (
						<Image
							src={effectiveSession.user.image}
							alt="User Avatar"
							width={32}
							height={32}
							className="w-full h-full object-cover"
						/>
					) : (
						<span className="text-xl font-bold text-white select-none">
							{effectiveSession.user.name?.slice(0, 1).toUpperCase() || "?"}
						</span>
					)}
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="bg-white">
				<DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
					{t("logout")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
