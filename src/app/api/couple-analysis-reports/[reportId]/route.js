import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import CoupleAnalysisReport from "@/models/CoupleAnalysisReport";
import { ObjectId } from "mongodb";

// GET - Retrieve a specific couple analysis report by ID

// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request, { params }) {
	try {
		await dbConnect();

		const { reportId } = await params;

		if (!reportId) {
			return NextResponse.json(
				{ success: false, error: "Report ID is required" },
				{ status: 400 }
			);
		}

		console.log("🔍 Fetching couple analysis report:", reportId);

		// Validate ObjectId format
		if (!ObjectId.isValid(reportId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid report ID format" },
				{ status: 400 }
			);
		}

		// Find the report
		const report = await CoupleAnalysisReport.findById(reportId);

		if (!report) {
			console.log("❌ Report not found:", reportId);
			return NextResponse.json(
				{ success: false, error: "Report not found" },
				{ status: 404 }
			);
		}

		console.log("✅ Report found successfully!");
		console.log("📊 Report details:", {
			id: report._id,
			userId: report.userId,
			sessionId: report.sessionId,
			compatibilityScore: report.compatibilityAnalysis?.overallScore,
			problemCategory: report.problemAnalysis?.categoryType,
			createdAt: report.createdAt,
		});

		return NextResponse.json({
			success: true,
			report: report,
		});
	} catch (error) {
		console.error("❌ Failed to fetch couple analysis report:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch report",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}

// PUT - Update a specific couple analysis report
export async function PUT(request, { params }) {
	try {
		await dbConnect();

		const { reportId } = await params;
		const updateData = await request.json();

		if (!reportId) {
			return NextResponse.json(
				{ success: false, error: "Report ID is required" },
				{ status: 400 }
			);
		}

		console.log("📝 Updating couple analysis report:", reportId);

		// Validate ObjectId format
		if (!ObjectId.isValid(reportId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid report ID format" },
				{ status: 400 }
			);
		}

		// Update the report
		const updatedReport = await CoupleAnalysisReport.findByIdAndUpdate(
			reportId,
			{
				...updateData,
				"reportMetadata.updatedAt": new Date(),
			},
			{
				new: true, // Return the updated document
				runValidators: true, // Run schema validators
			}
		);

		if (!updatedReport) {
			return NextResponse.json(
				{ success: false, error: "Report not found" },
				{ status: 404 }
			);
		}

		console.log("✅ Report updated successfully!");

		return NextResponse.json({
			success: true,
			report: updatedReport,
			message: "Report updated successfully",
		});
	} catch (error) {
		console.error("❌ Failed to update couple analysis report:", error);

		if (error.name === "ValidationError") {
			return NextResponse.json(
				{
					success: false,
					error: "Validation failed",
					details: Object.keys(error.errors).map((key) => ({
						field: key,
						message: error.errors[key].message,
					})),
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: "Failed to update report",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}

// DELETE - Soft delete a couple analysis report
export async function DELETE(request, { params }) {
	try {
		await dbConnect();

		const { reportId } = await params;

		if (!reportId) {
			return NextResponse.json(
				{ success: false, error: "Report ID is required" },
				{ status: 400 }
			);
		}

		console.log("🗑️ Soft deleting couple analysis report:", reportId);

		// Validate ObjectId format
		if (!ObjectId.isValid(reportId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid report ID format" },
				{ status: 400 }
			);
		}

		// Soft delete by setting isDeleted flag
		const deletedReport = await CoupleAnalysisReport.findByIdAndUpdate(
			reportId,
			{
				isDeleted: 1,
				"reportMetadata.deletedAt": new Date(),
			},
			{ new: true }
		);

		if (!deletedReport) {
			return NextResponse.json(
				{ success: false, error: "Report not found" },
				{ status: 404 }
			);
		}

		console.log("✅ Report soft deleted successfully!");

		return NextResponse.json({
			success: true,
			message: "Report deleted successfully",
			reportId: deletedReport._id,
		});
	} catch (error) {
		console.error("❌ Failed to delete couple analysis report:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to delete report",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}
