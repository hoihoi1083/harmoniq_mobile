import { Metadata } from "next";

export const metadata: Metadata = {
	title: "歷史紀錄 - 命理測算報告",
	description: "查看您的所有命理測算報告歷史記錄",
};

export default function ReportHistoryLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="min-h-screen bg-gray-50">{children}</div>;
}
