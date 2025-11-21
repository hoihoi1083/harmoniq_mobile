import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminUser, AdminActionLog } from "@/models/AdminModels";
import dbConnect from "@/lib/mongoose";

const JWT_SECRET =
	process.env.ADMIN_JWT_SECRET || "your-super-secret-admin-key-change-this";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		await dbConnect();

		const body = await request.json();
		const { username, password, action } = body;

		// Skip validation for checkSetup action
		if (action === "checkSetup") {
			return await handleCheckSetup();
		}

		if (!username || !password || !action) {
			return Response.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		if (action === "login") {
			return await handleLogin(username, password, request);
		} else if (action === "createAdmin") {
			return await handleCreateAdmin(username, password, request);
		}

		return Response.json({ error: "Invalid action" }, { status: 400 });
	} catch (error) {
		console.error("Admin auth error:", error);
		return Response.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

async function handleLogin(username, password, request) {
	try {
		// Find admin user
		const admin = await AdminUser.findOne({ username, isActive: true });

		if (!admin) {
			return Response.json(
				{ error: "無效的用戶名或密碼" },
				{ status: 401 }
			);
		}

		// Check if account is locked
		if (admin.isLocked) {
			return Response.json(
				{
					error: "帳戶已被鎖定，請稍後再試",
					lockUntil: admin.lockUntil,
				},
				{ status: 423 }
			);
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, admin.password);

		if (!isValidPassword) {
			// Increment login attempts
			admin.loginAttempts += 1;

			// Lock account if too many attempts
			if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
				admin.lockUntil = Date.now() + LOCK_TIME;
				await admin.save();

				return Response.json(
					{
						error: "登入失敗次數過多，帳戶已被鎖定30分鐘",
						lockUntil: admin.lockUntil,
					},
					{ status: 423 }
				);
			}

			await admin.save();
			return Response.json(
				{
					error: `無效的用戶名或密碼，剩餘嘗試次數: ${MAX_LOGIN_ATTEMPTS - admin.loginAttempts}`,
				},
				{ status: 401 }
			);
		}

		// Reset login attempts on successful login
		admin.loginAttempts = 0;
		admin.lockUntil = undefined;
		admin.lastLogin = new Date();
		await admin.save();

		// Generate JWT token
		const token = jwt.sign(
			{
				adminId: admin._id,
				username: admin.username,
				role: admin.role,
			},
			JWT_SECRET,
			{ expiresIn: "8h" }
		);

		// Log admin action
		await logAdminAction(admin._id, "login", null, null, {
			loginTime: new Date(),
			ipAddress: getClientIP(request),
		});

		return Response.json({
			success: true,
			token,
			admin: {
				id: admin._id,
				username: admin.username,
				email: admin.email,
				role: admin.role,
				lastLogin: admin.lastLogin,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return Response.json({ error: "登入過程發生錯誤" }, { status: 500 });
	}
}

async function handleCreateAdmin(username, password, request) {
	try {
		// Check if any admin exists (for initial setup)
		const existingAdmin = await AdminUser.findOne({});

		if (existingAdmin) {
			return Response.json(
				{ error: "管理員帳戶已存在" },
				{ status: 403 }
			);
		}

		// Validate input
		if (!username || !password) {
			return Response.json(
				{ error: "用戶名和密碼為必填項" },
				{ status: 400 }
			);
		}

		if (password.length < 8) {
			return Response.json(
				{ error: "密碼長度至少8個字符" },
				{ status: 400 }
			);
		}

		// Hash password
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create admin
		const admin = new AdminUser({
			username,
			password: hashedPassword,
			email: `${username}@fengshui-admin.local`,
			role: "super_admin",
		});

		await admin.save();

		return Response.json({
			success: true,
			message: "管理員帳戶創建成功",
			admin: {
				id: admin._id,
				username: admin.username,
				role: admin.role,
			},
		});
	} catch (error) {
		console.error("Create admin error:", error);
		return Response.json({ error: "創建管理員帳戶失敗" }, { status: 500 });
	}
}

// Verify admin token middleware
export async function verifyAdminToken(request) {
	try {
		const authHeader = request.headers.get("authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return {
				error: "Missing or invalid authorization header",
				status: 401,
			};
		}

		const token = authHeader.substring(7);
		const decoded = jwt.verify(token, JWT_SECRET);

		// Verify admin still exists and is active
		await dbConnect();
		const admin = await AdminUser.findById(decoded.adminId);

		if (!admin || !admin.isActive) {
			return { error: "Invalid or inactive admin account", status: 401 };
		}

		return { admin: decoded };
	} catch (error) {
		console.error("Token verification error:", error);
		return { error: "Invalid token", status: 401 };
	}
}

async function handleCheckSetup() {
	try {
		// Check if any admin exists
		const existingAdmin = await AdminUser.findOne({});

		return Response.json({
			hasAdmin: !!existingAdmin,
			message: existingAdmin ? "管理員帳戶已存在" : "需要創建管理員帳戶",
		});
	} catch (error) {
		console.error("Check setup error:", error);
		return Response.json({ error: "檢查設定失敗" }, { status: 500 });
	}
}

// Helper function to log admin actions
export async function logAdminAction(
	adminId,
	action,
	targetType,
	targetId,
	details
) {
	try {
		const actionLog = new AdminActionLog({
			adminId,
			action,
			targetType,
			targetId,
			details,
			ipAddress: details?.ipAddress,
		});

		await actionLog.save();
	} catch (error) {
		console.error("Error logging admin action:", error);
	}
}

// Helper function to get client IP
function getClientIP(request) {
	const forwarded = request.headers.get("x-forwarded-for");
	const realIP = request.headers.get("x-real-ip");

	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}

	if (realIP) {
		return realIP;
	}

	return "unknown";
}
