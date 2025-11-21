import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

/**
 * SIMPLE COUPLE REPORT CONTENT STORAGE
 * Direct component-to-database saving with minimal complexity
 */

// Simple schema for storing component content as it's generated
const CoupleContentSchema = new mongoose.Schema(
	{
		sessionId: { type: String, required: true, index: true },
		componentName: { type: String, required: true },
		content: { type: mongoose.Schema.Types.Mixed, required: true },
		// User identification fields (similar to FortuneReport)
		userId: { type: String, index: true }, // For logged-in users
		userEmail: { type: String, index: true }, // For logged-in users
		// Birthday and profile information
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

export async function POST(request) {
	try {
		const requestData = await request.json();
		const {
			sessionId,
			componentName,
			content,
			data,
			birthday,
			birthday2,
			gender,
			gender2,
			problem,
			specificProblem,
			// User identification fields
			userId,
			userEmail,
		} = requestData;

		// Use 'data' if provided, otherwise use 'content' for backward compatibility
		const actualContent = data || content;

		if (!sessionId || !componentName || !actualContent) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing sessionId, componentName, or content/data",
				},
				{ status: 400 }
			);
		}

		await connectDB();

		// Save component content directly - replace if exists, create if new
		const result = await CoupleContent.findOneAndUpdate(
			{ sessionId, componentName },
			{
				sessionId,
				componentName,
				content: actualContent,
				// User identification
				userId,
				userEmail,
				// Profile information
				birthday,
				birthday2,
				gender,
				gender2,
				problem: problem || specificProblem,
				savedAt: new Date(),
			},
			{ upsert: true, new: true }
		);

		console.log(
			`✅ Saved ${componentName} content for session ${sessionId}`
		);

		return NextResponse.json({
			success: true,
			message: `${componentName} content saved`,
			id: result._id,
		});
	} catch (error) {
		console.error("❌ Error saving couple content:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("sessionId");

		if (!sessionId) {
			return NextResponse.json(
				{
					success: false,
					error: "sessionId required",
				},
				{ status: 400 }
			);
		}

		await connectDB();

		// Get all saved components for this session
		const components = await CoupleContent.find({ sessionId }).sort({
			savedAt: 1,
		});

		// Transform into easy-to-use object
		const savedContent = {};
		const metadata = {};

		components.forEach((comp) => {
			savedContent[comp.componentName] = comp.content;
			if (comp.birthday) metadata.birthday = comp.birthday;
			if (comp.birthday2) metadata.birthday2 = comp.birthday2;
			if (comp.gender) metadata.gender = comp.gender;
			if (comp.gender2) metadata.gender2 = comp.gender2;
			if (comp.problem) metadata.problem = comp.problem;
			if (comp.userId) metadata.userId = comp.userId;
			if (comp.userEmail) metadata.userEmail = comp.userEmail;
		});

		return NextResponse.json({
			success: true,
			sessionId,
			savedContent,
			metadata,
			componentCount: components.length,
			lastSaved:
				components.length > 0
					? components[components.length - 1].savedAt
					: null,
		});
	} catch (error) {
		console.error("❌ Error retrieving couple content:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
