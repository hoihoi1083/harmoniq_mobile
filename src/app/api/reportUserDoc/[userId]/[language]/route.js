import { NextResponse } from "next/server";
import { getUserInfo } from "@/lib/session";
import dbConnect from "@/lib/mongoose";
import ReportUserDoc from "@/models/ReportUserDoc";
import {
	genSuccessData,
	genUnAuthData,
	genErrorData,
} from "../../../utils/gen-res-data";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request, { params }) {
	const { userId, language } = await params;
	try {
		const userInfo = await getUserInfo();
		if (userInfo == null) return Response.json(genUnAuthData());

		await dbConnect();
		const userDoc = await ReportUserDoc.findOne({
			userId,
			language,
			isDelete: 0,
		}).select("-__v");
		return NextResponse.json(genSuccessData(userDoc));
	} catch (error) {
		return NextResponse.json(genErrorData("Error fetching userDoc"));
	}
}

//TODO 创建用户报告
export async function POST(request, { params }) {
	const { userId, language } = await params;
	try {
		const userInfo = await getUserInfo();
		if (userInfo == null) return Response.json(genUnAuthData());

		const body = await request.json();
		await dbConnect();

		//let design = await Design.findOne({ userId });

		await ReportUserDoc.create({
			userId,
			language,
			...body,
		});
		return NextResponse.json(genSuccessData());
	} catch (error) {
		return NextResponse.json(genErrorData("Internal Server Error"));
	}
}
//更新用户报告。将付费内容更新进已有报告
export async function PATCH(request, { params }) {
	const { userId, language } = await params;
	try {
		console.log(
			"🔧 PATCH /api/reportUserDoc - userId:",
			userId,
			"language:",
			language
		);

		const userInfo = await getUserInfo();
		console.log(
			"👤 Auth check - userInfo:",
			userInfo ? "authenticated" : "not authenticated"
		);
		if (userInfo == null) {
			console.warn("❌ PATCH rejected - no authentication");
			return Response.json(genUnAuthData());
		}

		const body = await request.json();
		console.log("📦 PATCH body keys:", Object.keys(body));
		console.log("📊 Body data preview:", {
			hasBasicReportData: !!body.basicReportData,
			hasFourFortuneData: !!body.fourFortuneAnalysisData,
			hasAIContent: !!body.aiGeneratedContent,
			lifeReportStatus: body.lifeReportStatus,
		});

		await dbConnect();

		let userDoc = await ReportUserDoc.findOne({
			userId,
			language,
			isDelete: 0,
		});
		console.log("🔍 Found existing userDoc:", !!userDoc);

		if (userDoc) {
			console.log(
				"💾 Updating userDoc with",
				Object.keys(body).length,
				"fields"
			);
			for (let key in body) {
				userDoc[key] = body[key];
			}
			await userDoc.save();
			console.log("✅ UserDoc saved successfully");
		} else {
			console.warn("⚠️ No userDoc found to update");
		}

		return NextResponse.json(genSuccessData());
	} catch (error) {
		console.error("❌ PATCH error:", error);
		return NextResponse.json(genErrorData("Internal Server Error"));
	}
}
