import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import FortuneReport from "@/models/FortuneReport";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const userEmail = searchParams.get("userEmail");
		const userId = searchParams.get("userId");
		const limit = parseInt(searchParams.get("limit")) || 20;
		const page = parseInt(searchParams.get("page")) || 1;

		if (!userEmail && !userId) {
			return NextResponse.json(
				{ error: "User email or ID is required", status: 1 },
				{ status: 400 }
			);
		}

		await dbConnect();

		// Build query - search by both userEmail and userId
		const query = {
			$or: [],
		};
		if (userEmail) {
			query.$or.push({ userEmail: userEmail });
		}
		if (userId) {
			query.$or.push({ userId: userId });
		}

		// If no conditions, return empty
		if (query.$or.length === 0) {
			return NextResponse.json(
				{ error: "No valid user identifier provided", status: 1 },
				{ status: 400 }
			);
		}

		// Calculate skip for pagination
		const skip = (page - 1) * limit;

		// Fetch reports with pagination
		const reports = await FortuneReport.find(query)
			.select({
				sessionId: 1,
				userInputs: 1,
				reportGenerated: 1,
				reportGeneratedAt: 1,
				createdAt: 1,
				reportType: 1,
				paymentAmount: 1,
				paymentCurrency: 1,
				accessCount: 1,
				lastAccessedAt: 1,
			})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		// Get total count for pagination
		const totalCount = await FortuneReport.countDocuments(query);
		const totalPages = Math.ceil(totalCount / limit);

		return NextResponse.json({
			status: 0,
			data: {
				reports,
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
		console.error("Report history fetch error:", err);
		return NextResponse.json(
			{
				error: "獲取報告歷史失敗: " + err.message,
				status: 1,
			},
			{ status: 500 }
		);
	}
}
