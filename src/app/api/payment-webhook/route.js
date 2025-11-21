import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const data = await request.json();
		const { sessionId, userId, userEmail, status, reportType } = data;

		if (status === "completed") {
			// Connect to MongoDB
			const client = new MongoClient(uri);
			await client.connect();
			const db = client.db("HarmoniqFengShui");

			// Update the smart user intent with report URL and ensure proper data structure
			const reportId = new ObjectId();
			const reportUrl = `/couple-report?id=${reportId}`;

			// First get the current SmartUserIntent to preserve all data
			const currentIntent = await db
				.collection("SmartUserIntents")
				.findOne({ sessionId: sessionId });

			if (!currentIntent) {
				await client.close();
				return Response.json(
					{ success: false, error: "Session not found" },
					{ status: 404 }
				);
			}

			await db.collection("SmartUserIntents").updateOne(
				{ sessionId: sessionId },
				{
					$set: {
						reportUrl: reportUrl,
						paymentStatus: "completed",
						reportId: reportId.toString(),
						// Ensure originalSpecificProblem is preserved
						originalSpecificProblem:
							currentIntent.originalSpecificProblem,
						updatedAt: new Date(),
					},
				}
			);

			// Create report entry for later retrieval
			await db.collection("CoupleReports").insertOne({
				_id: reportId,
				sessionId: sessionId,
				userId: userId,
				userEmail: userEmail,
				reportType: reportType,
				reportMetadata: {
					originalSpecificProblem:
						currentIntent.originalSpecificProblem,
					primaryConcern: currentIntent.primaryConcern,
					relationshipAnalysisType:
						currentIntent.relationshipAnalysisType,
					sessionId: sessionId,
				},
				userInputs: {
					birthday: currentIntent.userBirthday,
					birthday2: currentIntent.partnerBirthday,
					gender: currentIntent.userGender,
					gender2: currentIntent.partnerGender,
					time: currentIntent.userTime,
					time2: currentIntent.partnerTime,
					problem: currentIntent.specificQuestion,
				},
				createdAt: new Date(),
				status: "generated",
			});

			await client.close();

			return Response.json({
				success: true,
				reportUrl: reportUrl,
				reportId: reportId.toString(),
			});
		}

		return Response.json({
			success: false,
			message: "Payment not completed",
		});
	} catch (error) {
		console.error("Payment webhook error:", error);
		return Response.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
