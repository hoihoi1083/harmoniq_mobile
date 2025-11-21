import { useState } from "react";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

const BirthdayAnalyzer = ({ onAnalysisComplete, userProfile }) => {
	const [birthdayData, setBirthdayData] = useState({
		year: "",
		month: "",
		day: "",
		hour: "",
		gender: "",
		location: userProfile.location || "",
	});

	const [showTimeHelp, setShowTimeHelp] = useState(false);

	const hours = [
		{ value: "23-01", label: "子時 (23:00-01:00)", element: "水" },
		{ value: "01-03", label: "丑時 (01:00-03:00)", element: "土" },
		{ value: "03-05", label: "寅時 (03:00-05:00)", element: "木" },
		{ value: "05-07", label: "卯時 (05:00-07:00)", element: "木" },
		{ value: "07-09", label: "辰時 (07:00-09:00)", element: "土" },
		{ value: "09-11", label: "巳時 (09:00-11:00)", element: "火" },
		{ value: "11-13", label: "午時 (11:00-13:00)", element: "火" },
		{ value: "13-15", label: "未時 (13:00-15:00)", element: "土" },
		{ value: "15-17", label: "申時 (15:00-17:00)", element: "金" },
		{ value: "17-19", label: "酉時 (17:00-19:00)", element: "金" },
		{ value: "19-21", label: "戌時 (19:00-21:00)", element: "土" },
		{ value: "21-23", label: "亥時 (21:00-23:00)", element: "水" },
	];

	const generateAnalysis = () => {
		if (!birthdayData.year || !birthdayData.month || !birthdayData.day) {
			alert("請填寫完整的出生年月日");
			return;
		}

		// Calculate age
		const birthDate = new Date(
			birthdayData.year,
			birthdayData.month - 1,
			birthdayData.day
		);
		const today = new Date();
		const age = today.getFullYear() - birthDate.getFullYear();

		// Determine zodiac sign
		const zodiacSigns = [
			"摩羯座",
			"水瓶座",
			"雙魚座",
			"牡羊座",
			"金牛座",
			"雙子座",
			"巨蟹座",
			"獅子座",
			"處女座",
			"天秤座",
			"天蠍座",
			"射手座",
		];

		const month = parseInt(birthdayData.month);
		const day = parseInt(birthdayData.day);
		let zodiacIndex;

		if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
			zodiacIndex = 0;
		else if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
			zodiacIndex = 1;
		else if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
			zodiacIndex = 2;
		else if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
			zodiacIndex = 3;
		else if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
			zodiacIndex = 4;
		else if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
			zodiacIndex = 5;
		else if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
			zodiacIndex = 6;
		else if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
			zodiacIndex = 7;
		else if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
			zodiacIndex = 8;
		else if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
			zodiacIndex = 9;
		else if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
			zodiacIndex = 10;
		else zodiacIndex = 11;

		const zodiacSign = zodiacSigns[zodiacIndex];

		// Chinese zodiac (simplified)
		const chineseZodiac = [
			"鼠",
			"牛",
			"虎",
			"兔",
			"龍",
			"蛇",
			"馬",
			"羊",
			"猴",
			"雞",
			"狗",
			"豬",
		];
		const chineseZodiacYear =
			chineseZodiac[(parseInt(birthdayData.year) - 1900) % 12];

		// Get selected hour element
		const selectedHour = hours.find((h) => h.value === birthdayData.hour);
		const hourElement = selectedHour?.element || "未知";

		const analysisPrompt = `請幫我分析生辰八字：
出生日期：${birthdayData.year}年${birthdayData.month}月${birthdayData.day}日
出生時辰：${selectedHour?.label || "未提供"}
性別：${birthdayData.gender}
星座：${zodiacSign}
生肖：${chineseZodiacYear}
出生地：${birthdayData.location}
目前年齡：${age}歲

請根據這些資訊分析我的：
1. 五行屬性和個人特質
2. 適合的風水佈局建議
3. 今年的運勢走向
4. 開運的顏色和方位
5. 需要注意的事項

請用溫暖關懷的語調，提供實用的建議。`;

		onAnalysisComplete(analysisPrompt, {
			...birthdayData,
			zodiacSign,
			chineseZodiacYear,
			hourElement,
			age,
		});
	};

	return (
		<div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-2">
					生辰八字分析
				</h3>
				<p className="text-gray-600">
					請提供您的出生資訊，我會為您進行詳細的命理分析
				</p>
			</div>

			<div className="space-y-4">
				{/* Birth Date */}
				<div className="grid grid-cols-3 gap-3">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							出生年
						</label>
						<select
							value={birthdayData.year}
							onChange={(e) =>
								setBirthdayData((prev) => ({
									...prev,
									year: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
						>
							<option value="">選擇年份</option>
							{Array.from({ length: 80 }, (_, i) => {
								const year = new Date().getFullYear() - i;
								return (
									<option key={year} value={year}>
										{year}
									</option>
								);
							})}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							出生月
						</label>
						<select
							value={birthdayData.month}
							onChange={(e) =>
								setBirthdayData((prev) => ({
									...prev,
									month: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
						>
							<option value="">月份</option>
							{Array.from({ length: 12 }, (_, i) => (
								<option key={i + 1} value={i + 1}>
									{i + 1}月
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							出生日
						</label>
						<select
							value={birthdayData.day}
							onChange={(e) =>
								setBirthdayData((prev) => ({
									...prev,
									day: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
						>
							<option value="">日期</option>
							{Array.from({ length: 31 }, (_, i) => (
								<option key={i + 1} value={i + 1}>
									{i + 1}日
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Birth Time */}
				<div>
					<div className="flex items-center justify-between mb-1">
						<label className="block text-sm font-medium text-gray-700">
							出生時辰
						</label>
						<button
							onClick={() => setShowTimeHelp(!showTimeHelp)}
							className="text-sm text-purple-600 hover:text-purple-700"
						>
							<Clock className="w-4 h-4 inline mr-1" />
							時辰說明
						</button>
					</div>
					<select
						value={birthdayData.hour}
						onChange={(e) =>
							setBirthdayData((prev) => ({
								...prev,
								hour: e.target.value,
							}))
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
					>
						<option value="">選擇出生時辰（可選）</option>
						{hours.map((hour) => (
							<option key={hour.value} value={hour.value}>
								{hour.label} - {hour.element}行
							</option>
						))}
					</select>

					{showTimeHelp && (
						<div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm text-purple-700">
							<p className="font-medium mb-1">💡 時辰提示：</p>
							<p>
								出生時辰對八字分析很重要，如果不確定確切時間，可以詢問家人或查看出生證明。沒有時辰資訊也可以進行基本分析。
							</p>
						</div>
					)}
				</div>

				{/* Gender */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						性別
					</label>
					<div className="flex space-x-4">
						<button
							onClick={() =>
								setBirthdayData((prev) => ({
									...prev,
									gender: "男",
								}))
							}
							className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
								birthdayData.gender === "男"
									? "border-purple-500 bg-purple-50 text-purple-700"
									: "border-gray-300 hover:border-purple-300"
							}`}
						>
							男性
						</button>
						<button
							onClick={() =>
								setBirthdayData((prev) => ({
									...prev,
									gender: "女",
								}))
							}
							className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
								birthdayData.gender === "女"
									? "border-purple-500 bg-purple-50 text-purple-700"
									: "border-gray-300 hover:border-purple-300"
							}`}
						>
							女性
						</button>
					</div>
				</div>

				{/* Location */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						<MapPin className="w-4 h-4 inline mr-1" />
						出生地
					</label>
					<input
						type="text"
						value={birthdayData.location}
						onChange={(e) =>
							setBirthdayData((prev) => ({
								...prev,
								location: e.target.value,
							}))
						}
						placeholder="例：台北市、高雄市..."
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
					/>
				</div>

				{/* Submit Button */}
				<button
					onClick={generateAnalysis}
					className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 flex items-center justify-center space-x-2"
				>
					<Star className="w-5 h-5" />
					<span>開始八字分析</span>
				</button>
			</div>

			<div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
				<p className="font-medium mb-1">🔮 分析內容包含：</p>
				<ul className="list-disc list-inside space-y-1">
					<li>個人五行屬性與性格特質</li>
					<li>適合的風水佈局建議</li>
					<li>運勢趨勢與開運方法</li>
					<li>幸運顏色與方位指引</li>
				</ul>
			</div>
		</div>
	);
};

export default BirthdayAnalyzer;
