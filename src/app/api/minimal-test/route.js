import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";

// Minimal schema for testing
const TestSchema = new mongoose.Schema({
	sessionId: String,
	userId: String,
	testField: String,
});

const TestModel =
	mongoose.models.TestReportData ||
	mongoose.model("TestReportData", TestSchema);


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();

		await dbConnect();

		const doc = await TestModel.create({
			sessionId: body.sessionId,
			userId: body.userId,
			testField: "test",
		});

		return NextResponse.json({
			status: 0,
			message: "Test document created",
			created: doc.toObject(),
			hasUserId: !!doc.userId,
		});
	} catch (error) {
		return NextResponse.json({
			status: -1,
			error: error.message,
		});
	}
}
