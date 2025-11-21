"use client";

import { useState, useEffect, useCallback } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectLabel,
	SelectGroup,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useMobile from "@/app/hooks/useMobile";
import DateCarousel from "./DateCarousel /index.jsx";
import { years, months, days, hours } from "./DateCarousel /index.jsx";

const petYears = Array.from({ length: 20 }, (_, i) => (2025 - i).toString()); // 2025 down to 2006

export default function UserInfoDialog({
	open,
	onUserOpen,
	onSubmit,
	userInfo,
}) {
	const t = useTranslations("design");
	const isMobile = useMobile();

	// User data
	const [gender, setGender] = useState("男");
	const [birthYear, setBirthYear] = useState("1996");
	const [birthMonth, setBirthMonth] = useState("03");
	const [birthDay, setBirthDay] = useState("12");
	const [birthHour, setBirthHour] = useState("22");

	// Family member data
	const [includeFamilyMember, setIncludeFamilyMember] = useState(false);
	const [familyGender, setFamilyGender] = useState("男");
	const [familyBirthYear, setFamilyBirthYear] = useState("1996");
	const [familyBirthMonth, setFamilyBirthMonth] = useState("03");
	const [familyBirthDay, setFamilyBirthDay] = useState("12");
	const [familyBirthHour, setFamilyBirthHour] = useState("22");

	// Pet data
	const [includePet, setIncludePet] = useState(false);
	const [petType, setPetType] = useState("猫");
	const [petName, setPetName] = useState("");
	const [petGender, setPetGender] = useState("未知");
	const [petBirthYear, setPetBirthYear] = useState("2020");
	const [petBirthMonth, setPetBirthMonth] = useState("01");
	const [petBirthDay, setPetBirthDay] = useState("01");

	// Pet options
	const petOptions = ["猫", "狗", "兔子", "蛇", "蜥蜴", "鳥類", "觀賞魚"];
	const petGenderOptions = ["雄性", "雌性", "未知"];

	// 当接收到用户信息时，更新表单状态
	useEffect(() => {
		if (userInfo) {
			setGender(userInfo.gender || "男");

			if (userInfo.birthDateTime) {
				const date = new Date(userInfo.birthDateTime);
				setBirthYear(date.getFullYear().toString());
				setBirthMonth(
					(date.getMonth() + 1).toString().padStart(2, "0")
				);
				setBirthDay(date.getDate().toString().padStart(2, "0"));
				setBirthHour(date.getHours().toString().padStart(2, "0"));
			}
		}
	}, [userInfo]);

	const handleSubmit = () => {
		const birthDateTime = new Date(
			parseInt(birthYear),
			parseInt(birthMonth) - 1,
			parseInt(birthDay),
			parseInt(birthHour)
		);

		const userData = {
			gender,
			birthDateTime,
		};

		let familyData = null;
		if (includeFamilyMember) {
			const familyBirthDateTime = new Date(
				parseInt(familyBirthYear),
				parseInt(familyBirthMonth) - 1,
				parseInt(familyBirthDay),
				parseInt(familyBirthHour)
			);

			familyData = {
				gender: familyGender,
				birthDateTime: familyBirthDateTime,
				birthYear: parseInt(familyBirthYear),
				birthMonth: parseInt(familyBirthMonth),
				birthDay: parseInt(familyBirthDay),
				birthHour: parseInt(familyBirthHour),
			};

			// Store family member data in localStorage for FamilyReport component
			localStorage.setItem(
				"familyMemberData",
				JSON.stringify(familyData)
			);
		} else {
			// Remove family member data if not included
			localStorage.removeItem("familyMemberData");
		}

		let petData = null;
		if (includePet) {
			const petBirthDateTime = new Date(
				parseInt(petBirthYear),
				parseInt(petBirthMonth) - 1,
				parseInt(petBirthDay)
			);

			petData = {
				type: petType,
				name: petName,
				gender: petGender,
				birthDateTime: petBirthDateTime,
				birthYear: parseInt(petBirthYear),
				birthMonth: parseInt(petBirthMonth),
				birthDay: parseInt(petBirthDay),
			};

			// Store pet data in localStorage for Pet component
			localStorage.setItem("petData", JSON.stringify(petData));
		} else {
			// Remove pet data if not included
			localStorage.removeItem("petData");
		}

		// Return user, family, and pet data
		onSubmit({
			user: userData,
			familyMember: familyData,
			pet: petData,
		});
	};

	const onDateChange = (value) => {
		if (value) {
			setBirthYear(value[0]);
			setBirthMonth(value[1]);
			setBirthDay(value[2]);
			setBirthHour(value[3]);
		}
	};

	const onFamilyDateChange = (value) => {
		if (value) {
			setFamilyBirthYear(value[0]);
			setFamilyBirthMonth(value[1]);
			setFamilyBirthDay(value[2]);
			setFamilyBirthHour(value[3]);
		}
	};

	const onPetDateChange = (value) => {
		if (value) {
			setPetBirthYear(value[0]);
			setPetBirthMonth(value[1]);
			setPetBirthDay(value[2]);
		}
	};

	// Custom Checkbox Component
	const CustomCheckbox = ({
		id,
		checked,
		onCheckedChange,
		children,
		className = "",
	}) => {
		return (
			<div className={`flex items-center space-x-2 ${className}`}>
				<button
					id={id}
					type="button"
					role="checkbox"
					aria-checked={checked}
					onClick={() => onCheckedChange(!checked)}
					className={`
                        w-4 h-4 border-2 border-gray-300 rounded 
                        ${checked ? "bg-[#13ab87] border-[#13ab87]" : "bg-white"}
                        focus:outline-none focus:ring-2 focus:ring-[#13ab87] focus:ring-offset-1
                        transition-colors duration-200 ease-in-out
                        flex items-center justify-center
                    `}
				>
					{checked && (
						<svg
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10 3L4.5 8.5L2 6"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</button>
				<Label htmlFor={id} className="cursor-pointer">
					{children}
				</Label>
			</div>
		);
	};

	const MobileTimeSelector = () => {
		return (
			<div>
				<div className="flex justify-between pb-4">
					<Label className="text-base">出生日期</Label>
					<span>{`${birthYear}年${birthMonth}月${birthDay}日${birthHour}${t("hour")}`}</span>
				</div>
				<Separator />
				<DateCarousel
					tHour={t("hour")}
					onChange={onDateChange}
					value={[birthYear, birthMonth, birthDay, birthHour]}
				/>
				<Separator />
			</div>
		);
	};

	const FamilyMobileTimeSelector = () => {
		return (
			<div>
				<div className="flex justify-between pb-4">
					<Label className="text-base">家庭成員出生日期</Label>
					<span>{`${familyBirthYear}年${familyBirthMonth}月${familyBirthDay}日${familyBirthHour}${t("hour")}`}</span>
				</div>
				<Separator />
				<DateCarousel
					tHour={t("hour")}
					onChange={onFamilyDateChange}
					value={[
						familyBirthYear,
						familyBirthMonth,
						familyBirthDay,
						familyBirthHour,
					]}
				/>
				<Separator />
			</div>
		);
	};

	const PetMobileTimeSelector = () => {
		return (
			<div>
				<div className="flex justify-between pb-4">
					<Label className="text-base">寵物出生日期</Label>
					<span>{`${petBirthYear}年${petBirthMonth}月${petBirthDay}日`}</span>
				</div>
				<Separator />
				<DateCarousel
					onChange={onPetDateChange}
					value={[petBirthYear, petBirthMonth, petBirthDay]}
					showHour={false}
					customYears={petYears} // Pass custom years for pets
				/>
				<Separator />
			</div>
		);
	};

	const DesktopTimeSelector = () => (
		<div className="grid grid-cols-4 gap-4">
			<div>
				<Label className="pb-4 text-base font-bold">年</Label>
				<Select value={birthYear} onValueChange={setBirthYear}>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="年" />
					</SelectTrigger>
					<SelectContent>
						{years.map((year) => (
							<SelectItem key={year} value={year}>
								{year}年
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="pb-4 text-base font-bold">月</Label>
				<Select value={birthMonth} onValueChange={setBirthMonth}>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="月" />
					</SelectTrigger>
					<SelectContent>
						{months.map((month) => (
							<SelectItem key={month} value={month}>
								{month}月
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="pb-4 text-base font-bold">日</Label>
				<Select value={birthDay} onValueChange={setBirthDay}>
					<SelectTrigger className="w-20">
						<SelectValue placeholder="日" />
					</SelectTrigger>
					<SelectContent>
						{days.map((day) => (
							<SelectItem key={day} value={day}>
								{day}日
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="pb-4 text-base font-bold">
					小{t("hour")}
				</Label>
				<Select value={birthHour} onValueChange={setBirthHour}>
					<SelectTrigger className="w-20">
						<SelectValue placeholder={t("hour")} />
					</SelectTrigger>
					<SelectContent>
						{hours.map((hour) => (
							<SelectItem key={hour} value={hour}>
								{hour}
								{t("hour")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);

	const FamilyDesktopTimeSelector = () => (
		<div className="grid grid-cols-4 gap-4">
			<div>
				<Label className="pb-4 text-base font-bold">年</Label>
				<Select
					value={familyBirthYear}
					onValueChange={setFamilyBirthYear}
				>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="年" />
					</SelectTrigger>
					<SelectContent>
						{years.map((year) => (
							<SelectItem key={year} value={year}>
								{year}年
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="pb-4 text-base font-bold">月</Label>
				<Select
					value={familyBirthMonth}
					onValueChange={setFamilyBirthMonth}
				>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="月" />
					</SelectTrigger>
					<SelectContent>
						{months.map((month) => (
							<SelectItem key={month} value={month}>
								{month}月
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="pb-4 text-base font-bold">日</Label>
				<Select
					value={familyBirthDay}
					onValueChange={setFamilyBirthDay}
				>
					<SelectTrigger className="w-20">
						<SelectValue placeholder="日" />
					</SelectTrigger>
					<SelectContent>
						{days.map((day) => (
							<SelectItem key={day} value={day}>
								{day}日
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="pb-4 text-base font-bold">
					小{t("hour")}
				</Label>
				<Select
					value={familyBirthHour}
					onValueChange={setFamilyBirthHour}
				>
					<SelectTrigger className="w-20">
						<SelectValue placeholder={t("hour")} />
					</SelectTrigger>
					<SelectContent>
						{hours.map((hour) => (
							<SelectItem key={hour} value={hour}>
								{hour}
								{t("hour")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);

	const PetDesktopTimeSelector = () => (
		<div className="grid grid-cols-3 gap-4">
			<div>
				<Label className="pb-4 text-base font-bold">年</Label>
				<Select value={petBirthYear} onValueChange={setPetBirthYear}>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="年" />
					</SelectTrigger>
					<SelectContent>
						{petYears.map((year) => (
							<SelectItem key={year} value={year}>
								{year}年
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="pb-4 text-base font-bold">月</Label>
				<Select value={petBirthMonth} onValueChange={setPetBirthMonth}>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="月" />
					</SelectTrigger>
					<SelectContent>
						{months.map((month) => (
							<SelectItem key={month} value={month}>
								{month}月
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="pb-4 text-base font-bold">日</Label>
				<Select value={petBirthDay} onValueChange={setPetBirthDay}>
					<SelectTrigger className="w-20">
						<SelectValue placeholder="日" />
					</SelectTrigger>
					<SelectContent>
						{days.map((day) => (
							<SelectItem key={day} value={day}>
								{day}日
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);

	const GenderDesktop = () => {
		return (
			<div className="pb-4 space-y-2">
				<Label className="pb-2 text-base font-bold">性别</Label>
				<RadioGroup
					value={gender}
					onValueChange={setGender}
					className="flex space-x-4"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="男" id="male" />
						<Label htmlFor="male">男</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="女" id="female" />
						<Label htmlFor="female">女</Label>
					</div>
				</RadioGroup>
			</div>
		);
	};

	const FamilyGenderDesktop = () => {
		return (
			<div className="pb-4 space-y-2">
				<Label className="pb-2 text-base font-bold">家庭成員性别</Label>
				<RadioGroup
					value={familyGender}
					onValueChange={setFamilyGender}
					className="flex space-x-4"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="男" id="family-male" />
						<Label htmlFor="family-male">男</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="女" id="family-female" />
						<Label htmlFor="family-female">女</Label>
					</div>
				</RadioGroup>
			</div>
		);
	};

	const GenderMobile = () => {
		return (
			<div className="flex justify-between">
				<Label className="text-base">性别</Label>
				<div className="flex bg-gray-200 p-1 rounded-[6px]">
					<button
						style={{
							boxShadow:
								gender === "男"
									? "0 1px 5px 0px rgba(0, 0, 0, 0.3)"
									: "none",
						}}
						className={`rounded-[6px] px-4 py-1 ${gender === "男" ? "bg-white" : "transparent"}`}
						onClick={() => setGender("男")}
					>
						男
					</button>
					<button
						style={{
							boxShadow:
								gender === "女"
									? "0 1px 5px 0px rgba(0, 0, 0, 0.3)"
									: "none",
						}}
						className={`rounded-[6px] px-4 py-1 ${gender === "女" ? "bg-white" : "transparent"}`}
						onClick={() => setGender("女")}
					>
						女
					</button>
				</div>
			</div>
		);
	};

	const FamilyGenderMobile = () => {
		return (
			<div className="flex justify-between">
				<Label className="text-base">家庭成員性别</Label>
				<div className="flex bg-gray-200 p-1 rounded-[6px]">
					<button
						style={{
							boxShadow:
								familyGender === "男"
									? "0 1px 5px 0px rgba(0, 0, 0, 0.3)"
									: "none",
						}}
						className={`rounded-[6px] px-4 py-1 ${familyGender === "男" ? "bg-white" : "transparent"}`}
						onClick={() => setFamilyGender("男")}
					>
						男
					</button>
					<button
						style={{
							boxShadow:
								familyGender === "女"
									? "0 1px 5px 0px rgba(0, 0, 0, 0.3)"
									: "none",
						}}
						className={`rounded-[6px] px-4 py-1 ${familyGender === "女" ? "bg-white" : "transparent"}`}
						onClick={() => setFamilyGender("女")}
					>
						女
					</button>
				</div>
			</div>
		);
	};

	const PetInfoDesktop = () => {
		return (
			<div className="space-y-4">
				<div>
					<Label className="pb-2 text-base font-bold">寵物類型</Label>
					<Select value={petType} onValueChange={setPetType}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="選擇寵物類型" />
						</SelectTrigger>
						<SelectContent>
							{petOptions.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="pb-2 text-base font-bold">
						寵物名字（可選）
					</Label>
					<Input
						type="text"
						placeholder="輸入寵物名字"
						value={petName}
						onChange={(e) => setPetName(e.target.value)}
						className="w-full"
					/>
				</div>

				<div>
					<Label className="pb-2 text-base font-bold">寵物性別</Label>
					<Select value={petGender} onValueChange={setPetGender}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="選擇寵物性別" />
						</SelectTrigger>
						<SelectContent>
							{petGenderOptions.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	};

	const PetInfoMobile = () => {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label className="text-base">寵物類型</Label>
					<Select value={petType} onValueChange={setPetType}>
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{petOptions.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center justify-between">
					<Label className="text-base">寵物名字</Label>
					<Input
						type="text"
						placeholder="名字"
						value={petName}
						onChange={(e) => setPetName(e.target.value)}
						className="w-32"
					/>
				</div>

				<div className="flex items-center justify-between">
					<Label className="text-base">寵物性別</Label>
					<Select value={petGender} onValueChange={setPetGender}>
						<SelectTrigger className="w-24">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{petGenderOptions.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={onUserOpen}>
			<DialogContent
				className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto z-[9999]"
				style={{
					fontFamily: '"Noto Serif TC", serif',
					zIndex: 9999, // Force highest z-index
				}}
			>
				<DialogHeader>
					<DialogTitle className="text-lg font-bold text-center md:text-xl md:text-left">
						個人、家庭及寵物資料
					</DialogTitle>
					<div className="py-4 text-sm text-left md:text-base">
						請填寫您的出生資料以進行風水分析，您也可以選擇添加家庭成員及寵物的資料。
					</div>
				</DialogHeader>
				<Separator className="md:hidden" />

				<div className="grid gap-4 pb-4">
					{/* User Section */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold">您的資料</h3>
						{isMobile ? <GenderMobile /> : <GenderDesktop />}
						<Separator className="md:hidden" />
						{isMobile ? (
							<MobileTimeSelector />
						) : (
							<DesktopTimeSelector />
						)}
					</div>

					<Separator />

					{/* Family Member Section */}
					<div className="space-y-4">
						<CustomCheckbox
							id="include-family"
							checked={includeFamilyMember}
							onCheckedChange={setIncludeFamilyMember}
							className="mb-4"
						>
							<span className="text-lg font-bold">
								添加家庭成員資料（可選）
							</span>
						</CustomCheckbox>

						{includeFamilyMember && (
							<>
								{isMobile ? (
									<FamilyGenderMobile />
								) : (
									<FamilyGenderDesktop />
								)}
								<Separator className="md:hidden" />
								{isMobile ? (
									<FamilyMobileTimeSelector />
								) : (
									<FamilyDesktopTimeSelector />
								)}
							</>
						)}
					</div>

					<Separator />

					{/* Pet Section */}
					<div className="space-y-4">
						<CustomCheckbox
							id="include-pet"
							checked={includePet}
							onCheckedChange={setIncludePet}
							className="mb-4"
						>
							<span className="text-lg font-bold">
								添加寵物資料（可選）
							</span>
						</CustomCheckbox>

						{includePet && (
							<>
								{isMobile ? (
									<PetInfoMobile />
								) : (
									<PetInfoDesktop />
								)}
								<Separator className="md:hidden" />
								{isMobile ? (
									<PetMobileTimeSelector />
								) : (
									<PetDesktopTimeSelector />
								)}
							</>
						)}
					</div>

					{isMobile ? (
						<div className="flex justify-around">
							<Button
								onClick={() => {
									onUserOpen(false);
								}}
								className="px-10 border-1 border-[#ccc] text-foreground rounded-[100px] bg-white font-bold mt-10"
							>
								取消
							</Button>
							<Button
								onClick={handleSubmit}
								className="px-10 bg-[#13ab87] font-bold mt-10 rounded-[100px]"
							>
								保存
							</Button>
						</div>
					) : (
						<Button
							onClick={handleSubmit}
							className="w-full bg-[#13ab87] font-bold mt-10 rounded-[100px]"
						>
							保存
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
