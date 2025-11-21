import { verifyAdminToken, logAdminAction } from "@/app/api/admin/auth/route";
import { UserActivity, SystemMetrics } from "@/models/AdminModels";
import ChatHistory from "@/models/ChatHistory";
import SmartUserIntent from "@/models/SmartUserIntent";
import User from "@/models/User";
import dbConnect from "@/lib/mongoose";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		// Verify admin authentication
		const authResult = await verifyAdminToken(request);
		if (authResult.error) {
			return Response.json(
				{ error: authResult.error },
				{ status: authResult.status }
			);
		}

		await dbConnect();

		const { searchParams } = new URL(request.url);
		const action = searchParams.get("action");
		const timeRange = searchParams.get("timeRange") || "7d";

		switch (action) {
			case "dashboard_overview":
				return await getDashboardOverview(timeRange);
			case "user_activities":
				return await getUserActivities(searchParams);
			case "chat_analytics":
				return await getChatAnalytics(searchParams);
			case "user_list":
				return await getUserList(searchParams);
			case "conversation_list":
				return await getConversationList(searchParams);
			case "system_health":
				return await getSystemHealth();
			default:
				return Response.json(
					{ error: "Invalid action" },
					{ status: 400 }
				);
		}
	} catch (error) {
		console.error("Admin dashboard error:", error);
		return Response.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

async function getDashboardOverview(timeRange) {
	const timeFilter = getTimeFilter(timeRange);

	try {
		// Get basic stats
		const [
			totalUsers,
			totalConversations,
			activeUsersToday,
			totalRevenue,
			recentActivities,
		] = await Promise.all([
			User.countDocuments(),
			ChatHistory.countDocuments(),
			getActiveUsersCount(timeFilter),
			getRevenueStats(timeFilter),
			UserActivity.find(timeFilter).sort({ createdAt: -1 }).limit(50),
		]);

		// Get user type distribution
		const userTypeStats = await SmartUserIntent.aggregate([
			{ $match: timeFilter },
			{
				$group: {
					_id: "$aiAnalysis.userType",
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
		]);

		// Get concern distribution
		const concernStats = await SmartUserIntent.aggregate([
			{ $match: timeFilter },
			{
				$group: {
					_id: "$primaryConcern",
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
		]);

		// Get conversation completion rates
		const completionStats = await SmartUserIntent.aggregate([
			{ $match: timeFilter },
			{
				$group: {
					_id: "$conversationState",
					count: { $sum: 1 },
				},
			},
		]);

		return Response.json({
			success: true,
			data: {
				overview: {
					totalUsers,
					totalConversations,
					activeUsersToday,
					totalRevenue: totalRevenue.total,
					avgSessionDuration:
						await getAverageSessionDuration(timeFilter),
				},
				userTypeDistribution: userTypeStats,
				concernDistribution: concernStats,
				completionStats,
				recentActivities: recentActivities.map((activity) => ({
					id: activity._id,
					userId: activity.userId,
					type: activity.activityType,
					timestamp: activity.createdAt,
					details: activity.activityData,
					success: activity.success,
				})),
				timeRange,
			},
		});
	} catch (error) {
		console.error("Dashboard overview error:", error);
		return Response.json(
			{ error: "Failed to get dashboard overview" },
			{ status: 500 }
		);
	}
}

async function getUserActivities(searchParams) {
	const page = parseInt(searchParams.get("page")) || 1;
	const limit = parseInt(searchParams.get("limit")) || 50;
	const userId = searchParams.get("userId");
	const activityType = searchParams.get("activityType");
	const timeRange = searchParams.get("timeRange") || "7d";

	const filter = getTimeFilter(timeRange);

	if (userId) filter.userId = userId;
	if (activityType) filter.activityType = activityType;

	try {
		const skip = (page - 1) * limit;

		const [activities, totalCount] = await Promise.all([
			UserActivity.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			UserActivity.countDocuments(filter),
		]);

		return Response.json({
			success: true,
			data: {
				activities: activities.map((activity) => ({
					id: activity._id,
					userId: activity.userId,
					sessionId: activity.sessionId,
					type: activity.activityType,
					data: activity.activityData,
					metadata: activity.metadata,
					duration: activity.duration,
					success: activity.success,
					timestamp: activity.createdAt,
					errorDetails: activity.errorDetails,
				})),
				pagination: {
					page,
					limit,
					total: totalCount,
					pages: Math.ceil(totalCount / limit),
				},
			},
		});
	} catch (error) {
		console.error("User activities error:", error);
		return Response.json(
			{ error: "Failed to get user activities" },
			{ status: 500 }
		);
	}
}

async function getChatAnalytics(searchParams) {
	const timeRange = searchParams.get("timeRange") || "7d";
	const timeFilter = getTimeFilter(timeRange);

	try {
		// Chat volume over time
		const chatVolumeByDay = await ChatHistory.aggregate([
			{ $match: timeFilter },
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
						day: { $dayOfMonth: "$createdAt" },
					},
					conversationCount: { $sum: 1 },
					messageCount: { $sum: { $size: "$messages" } },
				},
			},
			{ $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
		]);

		// Average messages per conversation
		const avgMessagesPerConversation = await ChatHistory.aggregate([
			{ $match: timeFilter },
			{
				$group: {
					_id: null,
					avgMessages: { $avg: { $size: "$messages" } },
				},
			},
		]);

		// Most common topics
		const topicDistribution = await ChatHistory.aggregate([
			{ $match: timeFilter },
			{
				$group: {
					_id: "$primaryConcern",
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
		]);

		// User engagement patterns
		const engagementPatterns = await SmartUserIntent.aggregate([
			{ $match: timeFilter },
			{
				$group: {
					_id: "$aiAnalysis.engagementLevel",
					count: { $sum: 1 },
				},
			},
		]);

		return Response.json({
			success: true,
			data: {
				chatVolumeByDay,
				avgMessagesPerConversation:
					avgMessagesPerConversation[0]?.avgMessages || 0,
				topicDistribution,
				engagementPatterns,
				timeRange,
			},
		});
	} catch (error) {
		console.error("Chat analytics error:", error);
		return Response.json(
			{ error: "Failed to get chat analytics" },
			{ status: 500 }
		);
	}
}

async function getUserList(searchParams) {
	const page = parseInt(searchParams.get("page")) || 1;
	const limit = parseInt(searchParams.get("limit")) || 20;
	const search = searchParams.get("search");
	const userType = searchParams.get("userType");

	try {
		const skip = (page - 1) * limit;
		let userFilter = {};

		if (search) {
			userFilter.$or = [
				{ userId: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		// Get users with their latest SmartUserIntent data
		const pipeline = [
			{ $match: userFilter },
			{
				$lookup: {
					from: "smartuserintents",
					localField: "userId",
					foreignField: "userId",
					as: "intents",
				},
			},
			{
				$lookup: {
					from: "chathistories",
					localField: "userId",
					foreignField: "userId",
					as: "conversations",
				},
			},
			{
				$addFields: {
					latestIntent: {
						$arrayElemAt: [
							{
								$sortArray: {
									input: "$intents",
									sortBy: { createdAt: -1 },
								},
							},
							0,
						],
					},
					conversationCount: { $size: "$conversations" },
					totalMessages: {
						$sum: {
							$map: {
								input: "$conversations",
								as: "conv",
								in: { $size: "$$conv.messages" },
							},
						},
					},
				},
			},
		];

		if (userType) {
			pipeline.push({
				$match: { "latestIntent.aiAnalysis.userType": userType },
			});
		}

		pipeline.push(
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: limit }
		);

		const [users, totalCount] = await Promise.all([
			User.aggregate(pipeline),
			User.countDocuments(userFilter),
		]);

		return Response.json({
			success: true,
			data: {
				users: users.map((user) => ({
					id: user._id,
					userId: user.userId,
					email: user.email,
					gender: user.gender,
					birthDateTime: user.birthDateTime,
					provider: user.provider,
					isLock: user.isLock,
					createdAt: user.createdAt,
					userType: user.latestIntent?.aiAnalysis?.userType,
					emotionalState:
						user.latestIntent?.aiAnalysis?.emotionalState,
					conversationCount: user.conversationCount,
					totalMessages: user.totalMessages,
					lastActivity: user.latestIntent?.updatedAt,
				})),
				pagination: {
					page,
					limit,
					total: totalCount,
					pages: Math.ceil(totalCount / limit),
				},
			},
		});
	} catch (error) {
		console.error("User list error:", error);
		return Response.json(
			{ error: "Failed to get user list" },
			{ status: 500 }
		);
	}
}

async function getConversationList(searchParams) {
	const page = parseInt(searchParams.get("page")) || 1;
	const limit = parseInt(searchParams.get("limit")) || 20;
	const userId = searchParams.get("userId");
	const primaryConcern = searchParams.get("primaryConcern");

	try {
		const skip = (page - 1) * limit;
		let filter = {};

		if (userId) filter.userId = userId;
		if (primaryConcern) filter.primaryConcern = primaryConcern;

		const [conversations, totalCount] = await Promise.all([
			ChatHistory.find(filter)
				.sort({ updatedAt: -1 })
				.skip(skip)
				.limit(limit),
			ChatHistory.countDocuments(filter),
		]);

		return Response.json({
			success: true,
			data: {
				conversations: conversations.map((conv) => ({
					id: conv._id,
					conversationId: conv.conversationId,
					userId: conv.userId,
					title: conv.title,
					primaryConcern: conv.primaryConcern,
					messageCount: conv.messages.length,
					lastMessage: conv.messages[conv.messages.length - 1],
					createdAt: conv.createdAt,
					updatedAt: conv.updatedAt,
				})),
				pagination: {
					page,
					limit,
					total: totalCount,
					pages: Math.ceil(totalCount / limit),
				},
			},
		});
	} catch (error) {
		console.error("Conversation list error:", error);
		return Response.json(
			{ error: "Failed to get conversation list" },
			{ status: 500 }
		);
	}
}

async function getSystemHealth() {
	try {
		const [dbHealth, recentErrors, performanceMetrics] = await Promise.all([
			checkDatabaseHealth(),
			getRecentErrors(),
			getPerformanceMetrics(),
		]);

		return Response.json({
			success: true,
			data: {
				database: dbHealth,
				errors: recentErrors,
				performance: performanceMetrics,
				timestamp: new Date(),
			},
		});
	} catch (error) {
		console.error("System health error:", error);
		return Response.json(
			{ error: "Failed to get system health" },
			{ status: 500 }
		);
	}
}

// Helper functions
function getTimeFilter(timeRange) {
	const now = new Date();
	const ranges = {
		"1d": new Date(now.getTime() - 24 * 60 * 60 * 1000),
		"7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
		"30d": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
		"90d": new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
	};

	return { createdAt: { $gte: ranges[timeRange] || ranges["7d"] } };
}

async function getActiveUsersCount(timeFilter) {
	return await UserActivity.distinct("userId", timeFilter).then(
		(users) => users.length
	);
}

async function getRevenueStats(timeFilter) {
	const revenue = await SmartUserIntent.aggregate([
		{ $match: { ...timeFilter, paymentCompleted: true } },
		{
			$group: {
				_id: null,
				total: { $sum: "$paymentAmount" },
				count: { $sum: 1 },
			},
		},
	]);

	return revenue[0] || { total: 0, count: 0 };
}

async function getAverageSessionDuration(timeFilter) {
	const sessions = await UserActivity.aggregate([
		{ $match: { ...timeFilter, duration: { $exists: true } } },
		{
			$group: {
				_id: null,
				avgDuration: { $avg: "$duration" },
			},
		},
	]);

	return sessions[0]?.avgDuration || 0;
}

async function checkDatabaseHealth() {
	try {
		await User.findOne({}).limit(1);
		return { status: "healthy", message: "Database connection OK" };
	} catch (error) {
		return { status: "error", message: error.message };
	}
}

async function getRecentErrors() {
	return await UserActivity.find({
		success: false,
		createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
	})
		.sort({ createdAt: -1 })
		.limit(10);
}

async function getPerformanceMetrics() {
	// This would typically integrate with your monitoring system
	return {
		responseTime: Math.random() * 100 + 50, // Placeholder
		cpuUsage: Math.random() * 100,
		memoryUsage: Math.random() * 100,
		uptime: process.uptime(),
	};
}
