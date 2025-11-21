import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

// Use the existing CoupleContent schema
const CoupleContentSchema = new mongoose.Schema(
	{
		sessionId: { type: String, required: true, index: true },
		componentName: { type: String, required: true },
		content: { type: mongoose.Schema.Types.Mixed, required: true },
		// User identification fields
		userId: { type: String, index: true },
		userEmail: { type: String, index: true },
		// Profile information
		birthday: String,
		birthday2: String,
		gender: String,
		gender2: String,
		problem: String,
		savedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const CoupleContent =
	mongoose.models.CoupleContent ||
	mongoose.model("CoupleContent", CoupleContentSchema);


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const userEmail = searchParams.get("userEmail");
		const userId = searchParams.get("userId");
		const limit = parseInt(searchParams.get("limit")) || 20;
		const page = parseInt(searchParams.get("page")) || 1;

		await connectDB();

		// Build query to filter by user ID/email (similar to fortune reports)
		let userQuery = {};
		if (userEmail || userId) {
			const orConditions = [];
			if (userEmail) orConditions.push({ userEmail: userEmail });
			if (userId) orConditions.push({ userId: userId });
			userQuery = { $or: orConditions };
		}

		// Calculate skip for pagination
		const skip = (page - 1) * limit;

		// Get unique sessionIds with their latest update dates, filtered by user
		const pipeline = [
			// Add user filter if provided
			...(Object.keys(userQuery).length > 0
				? [{ $match: userQuery }]
				: []),
			{
				$group: {
					_id: "$sessionId",
					latestUpdate: { $max: "$createdAt" },
					componentCount: { $sum: 1 },
					birthday: { $first: "$birthday" },
					birthday2: { $first: "$birthday2" },
					gender: { $first: "$gender" },
					gender2: { $first: "$gender2" },
					problem: { $first: "$problem" },
					userId: { $first: "$userId" },
					userEmail: { $first: "$userEmail" },
					components: { $push: "$componentName" },
				},
			},
			{
				$match: {
					componentCount: { $gte: 1 }, // At least one component saved
				},
			},
			{
				$sort: { latestUpdate: -1 },
			},
			{
				$skip: skip,
			},
			{
				$limit: limit,
			},
		];

		const reports = await CoupleContent.aggregate(pipeline);

		// Get total count of unique sessions
		const totalCountPipeline = [
			{
				$group: {
					_id: "$sessionId",
					componentCount: { $sum: 1 },
				},
			},
			{
				$match: {
					componentCount: { $gte: 1 },
				},
			},
			{
				$count: "total",
			},
		];

		const totalCountResult =
			await CoupleContent.aggregate(totalCountPipeline);
		const totalCount =
			totalCountResult.length > 0 ? totalCountResult[0].total : 0;
		const totalPages = Math.ceil(totalCount / limit);

		// Format the response to match the structure expected by the frontend
		const formattedReports = reports.map((report) => ({
			sessionId: report._id,
			userInputs: {
				birthday: report.birthday,
				birthday2: report.birthday2,
				gender: report.gender,
				gender2: report.gender2,
				problem: report.problem,
			},
			reportGenerated: true,
			reportGeneratedAt: report.latestUpdate,
			createdAt: report.latestUpdate,
			reportType: "couple",
			componentCount: report.componentCount,
			components: report.components,
			paymentAmount: null,
			paymentCurrency: null,
			accessCount: 0,
			lastAccessedAt: null,
		}));

		return NextResponse.json({
			status: 0,
			data: {
				reports: formattedReports,
				pagination: {
					currentPage: page,
					totalPages,
					totalCount,
					hasNextPage: page < totalPages,
					hasPrevPage: page > 1,
				},
			},
		});
	} catch (err) {
		console.error("Couple report history fetch error:", err);
		return NextResponse.json(
			{
				error: "獲取合盤報告歷史失敗: " + err.message,
				status: 1,
			},
			{ status: 500 }
		);
	}
}
