import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request, { params }) {
	try {
		const { reportId } = params;

		if (!reportId) {
			return Response.json(
				{ success: false, error: "Report ID is required" },
				{ status: 400 }
			);
		}

		// Connect to MongoDB
		const client = new MongoClient(uri);
		await client.connect();
		const db = client.db("HarmoniqFengShui");

		console.log(`🔍 正在查找報告 ID: ${reportId}`);

		// Try to find in CoupleReports collection first (new structure)
		let coupleReport = await db.collection("CoupleReports").findOne({
			_id: new ObjectId(reportId),
		});

		if (coupleReport) {
			console.log(`📄 從CoupleReports找到報告:`, {
				sessionId: coupleReport.sessionId,
				originalSpecificProblem:
					coupleReport.reportMetadata?.originalSpecificProblem,
			});

			await client.close();

			return Response.json({
				userInputs: coupleReport.userInputs,
				reportMetadata: coupleReport.reportMetadata,
				messages: [
					{
						content:
							coupleReport.reportMetadata
								?.originalSpecificProblem ||
							coupleReport.userInputs?.problem ||
							"感情分析",
						timestamp: coupleReport.createdAt,
					},
				],
			});
		}

		// Fallback: Find the report and associated Smart User Intent (old method)
		const smartUserIntent = await db
			.collection("SmartUserIntents")
			.findOne({
				reportId: reportId,
			});

		if (!smartUserIntent) {
			await client.close();
			return Response.json(
				{ success: false, error: "Report not found" },
				{ status: 404 }
			);
		}

		console.log(`📄 找到SmartUserIntent:`, {
			sessionId: smartUserIntent.sessionId,
			originalSpecificProblem: smartUserIntent.originalSpecificProblem,
			primaryConcern: smartUserIntent.primaryConcern,
		});

		// Build the report data response
		const reportData = {
			userInputs: {
				birthday: smartUserIntent.userBirthday,
				birthday2: smartUserIntent.partnerBirthday,
				gender: smartUserIntent.userGender || "male",
				gender2: smartUserIntent.partnerGender || "female",
				time: smartUserIntent.userTime,
				time2: smartUserIntent.partnerTime,
				problem: smartUserIntent.specificQuestion,
			},
			reportMetadata: {
				originalSpecificProblem:
					smartUserIntent.originalSpecificProblem,
				primaryConcern: smartUserIntent.primaryConcern,
				relationshipAnalysisType:
					smartUserIntent.relationshipAnalysisType,
				sessionId: smartUserIntent.sessionId,
				reportId: reportId,
				paymentStatus: smartUserIntent.paymentStatus,
				createdAt: smartUserIntent.createdAt,
			},
			messages: [
				{
					content:
						smartUserIntent.originalSpecificProblem ||
						smartUserIntent.specificQuestion,
					timestamp: smartUserIntent.createdAt,
				},
			],
		};

		await client.close();

		console.log(`✅ 報告數據準備完成:`, {
			originalSpecificProblem:
				reportData.reportMetadata.originalSpecificProblem,
			fallbackProblem: reportData.userInputs.problem,
		});

		return Response.json(reportData);
	} catch (error) {
		console.error("Get report error:", error);
		return Response.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
