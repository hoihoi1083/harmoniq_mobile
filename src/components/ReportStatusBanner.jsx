import React from "react";
import { AlertCircle, CheckCircle, Clock, CreditCard } from "lucide-react";

const ReportStatusBanner = ({ reportData, onNewReportRequest }) => {
	if (!reportData) return null;

	// If report is from database (already generated)
	if (reportData.fromDatabase) {
		return (
			<div className="mb-6 mx-4 lg:mx-0">
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
						<div className="flex-1">
							<h3 className="text-green-800 font-semibold text-sm">
								已保存的風水報告
							</h3>
							<p className="text-green-700 text-sm mt-1">
								此報告已於之前生成並安全保存。每次付款只能生成一份報告，確保內容的權威性和專業性。
							</p>
							<div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs text-green-600">
								<span className="flex items-center gap-1">
									<Clock className="w-3 h-3" />
									報告生成時間：
									{reportData.reportGeneratedAt
										? new Date(
												reportData.reportGeneratedAt
											).toLocaleString("zh-TW")
										: reportData.reportContent
													?.reportGeneratedAt
											? new Date(
													reportData.reportContent.reportGeneratedAt
												).toLocaleString("zh-TW")
											: "最近"}
								</span>
								{reportData.accessCount && (
									<span className="flex items-center gap-1">
										<AlertCircle className="w-3 h-3" />
										訪問次數：{reportData.accessCount}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* New Report Option */}
				<div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
						<div className="flex-1">
							<h3 className="text-blue-800 font-semibold text-sm">
								需要新的報告？
							</h3>
							<p className="text-blue-700 text-sm mt-1">
								如果您想要基於不同的生辰八字或問題生成新的風水報告，需要重新進行付費分析。
							</p>
							<button
								onClick={onNewReportRequest}
								className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
							>
								重新分析（需付費）
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// If report is newly generated
	return (
		<div className="mb-6 mx-4 lg:mx-0">
			<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
					<div className="flex-1">
						<h3 className="text-purple-800 font-semibold text-sm">
							全新風水報告
						</h3>
						<p className="text-purple-700 text-sm mt-1">
							恭喜！您的專屬風水分析報告已成功生成並保存。此報告將永久保存，您可以隨時回來查看。
						</p>
						<p className="text-purple-600 text-xs mt-2">
							⚡ 剛剛生成 • 已安全保存到您的帳戶
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReportStatusBanner;
