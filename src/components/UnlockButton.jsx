"use client";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { get, post, patch } from "@/lib/ajax";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function ({ className }) {
	const t = useTranslations("Navigation");
	const [isLock, setIsLock] = useState(true);
	const { data: session } = useSession();
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		const userId = session?.user?.userId;
		if (userId) {
			const loadData = async () => {
				const {
					status,
					message,
					data: userInfo,
				} = await get(`/api/users/${userId}`);
				if (status == 0) {
					setIsLock(userInfo.isLock);
				}
			};
			loadData();
		}
	}, [session?.user?.userId]);
	const onClick = async () => {
		// 這裡可以用 prompt 或自訂 modal 讓用戶輸入尺數
		const input = window.prompt("請輸入家居尺數", quantity);
		const qty = Number(input) || 1;

		const { status, data, message } = await post(`/api/checkoutSessions`, {
			quantity: qty,
		});
		if (status == 0) {
			const { url } = data;
			window.open(url, "_self");
		} else {
			toast.error(message);
		}
	};
	return (
		isLock && (
			<button
				onClick={onClick}
				className={cn(
					"cursor-pointer font-bold text-[#066952] rounded-[20px] bg-[#A7F7D3] md:px-4 px-1.5 py-1 mr-1 md:mr-6",
					className
				)}
				style={{ fontFamily: '"Noto Serif TC", serif' }}
			>
				{t("unlock")}
			</button>
		)
	);
}
