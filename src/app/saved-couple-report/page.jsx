"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSavedContent } from "@/utils/simpleCoupleContentSave";

function SavedCoupleReportContent() {
	const searchParams = useSearchParams();
	const sessionId = searchParams?.get("sessionId") || "couple_complete_test";

	return (
		<div className="p-8 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Saved Couple Report</h1>
			<p className="mb-4">
				Session ID:{" "}
				<code className="bg-gray-100 px-2 py-1 rounded">
					{sessionId}
				</code>
			</p>

			<SavedContentDisplay sessionId={sessionId} />
		</div>
	);
}

function SavedContentDisplay({ sessionId }) {
	const [savedData, setSavedData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const loadSavedContent = async () => {
			const result = await getSavedContent(sessionId);
			setSavedData(result);
			setLoading(false);
		};

		loadSavedContent();
	}, [sessionId]);

	if (loading) {
		return <div className="text-center py-8">Loading saved content...</div>;
	}

	if (!savedData.success) {
		return (
			<div className="text-red-500 py-8">
				No saved content found for this session.
			</div>
		);
	}

	const { savedContent, metadata, componentCount, lastSaved } = savedData;

	return (
		<div className="space-y-6">
			<div className="bg-blue-50 p-4 rounded-lg">
				<h2 className="text-xl font-semibold mb-2">Report Summary</h2>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						Components Saved: <strong>{componentCount}</strong>
					</div>
					<div>
						Last Saved:{" "}
						<strong>{new Date(lastSaved).toLocaleString()}</strong>
					</div>
					<div>
						Birthday 1: <strong>{metadata.birthday}</strong>
					</div>
					<div>
						Birthday 2: <strong>{metadata.birthday2}</strong>
					</div>
				</div>
			</div>

			{Object.entries(savedContent).map(([componentName, content]) => (
				<div
					key={componentName}
					className="bg-white border rounded-lg p-6"
				>
					<h3 className="text-lg font-semibold mb-3 capitalize">
						{componentName.replace(/([A-Z])/g, " $1")}
					</h3>
					<pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
						{JSON.stringify(content, null, 2)}
					</pre>
				</div>
			))}

			<div className="bg-green-50 p-4 rounded-lg">
				<h3 className="text-lg font-semibold mb-2">
					✅ Simple Save Approach Works!
				</h3>
				<ul className="text-sm space-y-1">
					<li>
						• Each component saves content immediately after
						generation
					</li>
					<li>• No complex timing or background processes needed</li>
					<li>• Content is preserved even if user navigates away</li>
					<li>• Easy to retrieve and display saved reports</li>
					<li>• Scalable to any number of components</li>
				</ul>
			</div>
		</div>
	);
}

export default function SavedCoupleReportPage() {
	return (
		<Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
			<SavedCoupleReportContent />
		</Suspense>
	);
}
