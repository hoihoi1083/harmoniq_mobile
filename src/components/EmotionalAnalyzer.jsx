import { useState } from "react";
import { Calendar, MapPin, Star, Heart, Sparkles } from "lucide-react";

const EmotionalAnalyzer = ({ onAnalysisComplete, userProfile }) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [analysisData, setAnalysisData] = useState({
		emotionalState: "",
		lifeAreas: [],
		priorities: [],
		timeframe: "",
	});

	const emotionalStates = [
		{
			id: "stressed",
			label: "壓力很大",
			icon: "😓",
			color: "bg-red-100 text-red-700",
		},
		{
			id: "anxious",
			label: "感到焦慮",
			icon: "😰",
			color: "bg-orange-100 text-orange-700",
		},
		{
			id: "confused",
			label: "感到迷茫",
			icon: "😕",
			color: "bg-yellow-100 text-yellow-700",
		},
		{
			id: "sad",
			label: "心情低落",
			icon: "😢",
			color: "bg-blue-100 text-blue-700",
		},
		{
			id: "hopeful",
			label: "充滿希望",
			icon: "😊",
			color: "bg-green-100 text-green-700",
		},
		{
			id: "neutral",
			label: "情緒平穩",
			icon: "😐",
			color: "bg-gray-100 text-gray-700",
		},
	];

	const lifeAreas = [
		{
			id: "career",
			label: "事業工作",
			icon: <Star className="w-5 h-5" />,
			description: "工作發展、職場關係",
		},
		{
			id: "relationship",
			label: "感情關係",
			icon: <Heart className="w-5 h-5" />,
			description: "愛情、婚姻、人際關係",
		},
		{
			id: "health",
			label: "健康狀況",
			icon: <Sparkles className="w-5 h-5" />,
			description: "身體健康、精神狀態",
		},
		{
			id: "finance",
			label: "財運金錢",
			icon: <Calendar className="w-5 h-5" />,
			description: "財務狀況、投資理財",
		},
		{
			id: "family",
			label: "家庭和睦",
			icon: <MapPin className="w-5 h-5" />,
			description: "家人關係、居家環境",
		},
		{
			id: "personal",
			label: "個人成長",
			icon: <Star className="w-5 h-5" />,
			description: "學習進步、自我提升",
		},
	];

	const handleEmotionSelect = (emotionId) => {
		setAnalysisData((prev) => ({ ...prev, emotionalState: emotionId }));
		setCurrentStep(1);
	};

	const handleAreaToggle = (areaId) => {
		setAnalysisData((prev) => ({
			...prev,
			lifeAreas: prev.lifeAreas.includes(areaId)
				? prev.lifeAreas.filter((id) => id !== areaId)
				: [...prev.lifeAreas, areaId],
		}));
	};

	const generateAnalysisPrompt = () => {
		const selectedEmotion = emotionalStates.find(
			(e) => e.id === analysisData.emotionalState
		);
		const selectedAreas = lifeAreas.filter((area) =>
			analysisData.lifeAreas.includes(area.id)
		);

		return `我目前的情緒狀態是${selectedEmotion?.label}，主要關心的生活領域包括：${selectedAreas.map((area) => area.label).join("、")}。請根據我的情況提供情感支持和風水建議，幫助我改善目前的狀況。`;
	};

	const completeAnalysis = () => {
		const prompt = generateAnalysisPrompt();
		onAnalysisComplete(prompt, analysisData);
	};

	const steps = [
		{
			title: "你現在的心情如何？",
			subtitle: "選擇最符合你目前情緒狀態的選項",
			content: (
				<div className="grid grid-cols-2 gap-3">
					{emotionalStates.map((emotion) => (
						<button
							key={emotion.id}
							onClick={() => handleEmotionSelect(emotion.id)}
							className={`p-4 rounded-xl border-2 hover:border-purple-300 transition-all text-left ${
								analysisData.emotionalState === emotion.id
									? "border-purple-500 bg-purple-50"
									: "border-gray-200 hover:bg-gray-50"
							}`}
						>
							<div className="flex items-center space-x-3">
								<span className="text-2xl">{emotion.icon}</span>
								<div>
									<div className="font-medium text-gray-800">
										{emotion.label}
									</div>
								</div>
							</div>
						</button>
					))}
				</div>
			),
		},
		{
			title: "哪些生活領域需要關注？",
			subtitle: "可以選擇多個你想改善的方面",
			content: (
				<div className="space-y-3">
					{lifeAreas.map((area) => (
						<button
							key={area.id}
							onClick={() => handleAreaToggle(area.id)}
							className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
								analysisData.lifeAreas.includes(area.id)
									? "border-purple-500 bg-purple-50"
									: "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
							}`}
						>
							<div className="flex items-center space-x-3">
								<div className="text-purple-600">
									{area.icon}
								</div>
								<div className="flex-1">
									<div className="font-medium text-gray-800">
										{area.label}
									</div>
									<div className="text-sm text-gray-600">
										{area.description}
									</div>
								</div>
								{analysisData.lifeAreas.includes(area.id) && (
									<div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
										<span className="text-white text-sm">
											✓
										</span>
									</div>
								)}
							</div>
						</button>
					))}
					<div className="flex justify-between pt-4">
						<button
							onClick={() => setCurrentStep(0)}
							className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
						>
							上一步
						</button>
						<button
							onClick={completeAnalysis}
							disabled={analysisData.lifeAreas.length === 0}
							className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							開始分析
						</button>
					</div>
				</div>
			),
		},
	];

	return (
		<div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-lg font-semibold text-gray-800">
						{steps[currentStep].title}
					</h3>
					<span className="text-sm text-gray-500">
						{currentStep + 1}/2
					</span>
				</div>
				<p className="text-gray-600">{steps[currentStep].subtitle}</p>
			</div>

			{steps[currentStep].content}

			{/* Progress bar */}
			<div className="mt-6">
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
						style={{
							width: `${((currentStep + 1) / steps.length) * 100}%`,
						}}
					></div>
				</div>
			</div>
		</div>
	);
};

export default EmotionalAnalyzer;
