import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8">
			<h2 className="text-2xl font-bold mb-4">頁面不存在</h2>
			<p className="text-gray-600 mb-8">很抱歉，您請求的頁面不存在。</p>
			<Link
				href="/"
				className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
			>
				返回首頁
			</Link>
		</div>
	);
}
