import { NextResponse } from "next/server";
import crypto from "crypto";

// WeChat OAuth endpoints
const WECHAT_AUTH_URL = "https://open.weixin.qq.com/connect/oauth2/authorize";
const WECHAT_TOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/access_token";
const WECHAT_USER_INFO_URL = "https://api.weixin.qq.com/sns/userinfo";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const state = searchParams.get("state");

	try {
		if (!code) {
			// Step 1: Redirect to WeChat for authorization
			return redirectToWeChatAuth();
		}

		// Step 2: Exchange code for access token
		const tokenData = await getWeChatAccessToken(code);

		if (!tokenData.access_token) {
			throw new Error("Failed to get access token from WeChat");
		}

		// Step 3: Get user information
		const userInfo = await getWeChatUserInfo(
			tokenData.access_token,
			tokenData.openid
		);

		// Step 4: Create or update user in your database
		const user = await processWeChatUser(userInfo);

		// Step 5: Create session or JWT token
		const sessionToken = await createUserSession(user);

		// Redirect to your app with session
		const redirectUrl = new URL("/", process.env.NEXTAUTH_URL);
		redirectUrl.searchParams.set("token", sessionToken);

		return NextResponse.redirect(redirectUrl);
	} catch (error) {
		console.error("WeChat login error:", error);

		const errorUrl = new URL("/login", process.env.NEXTAUTH_URL);
		errorUrl.searchParams.set("error", "wechat_login_failed");

		return NextResponse.redirect(errorUrl);
	}
}

function redirectToWeChatAuth() {
	const state = crypto.randomBytes(16).toString("hex");
	const redirectUri = encodeURIComponent(
		`${process.env.NEXTAUTH_URL}/api/auth/wechat`
	);

	const authUrl = new URL(WECHAT_AUTH_URL);
	authUrl.searchParams.set("appid", process.env.WECHAT_APP_ID);
	authUrl.searchParams.set("redirect_uri", redirectUri);
	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("scope", "snsapi_userinfo");
	authUrl.searchParams.set("state", state);

	return NextResponse.redirect(`${authUrl.toString()}#wechat_redirect`);
}

async function getWeChatAccessToken(code) {
	const tokenUrl = new URL(WECHAT_TOKEN_URL);
	tokenUrl.searchParams.set("appid", process.env.WECHAT_APP_ID);
	tokenUrl.searchParams.set("secret", process.env.WECHAT_APP_SECRET);
	tokenUrl.searchParams.set("code", code);
	tokenUrl.searchParams.set("grant_type", "authorization_code");

	const response = await fetch(tokenUrl.toString());
	const data = await response.json();

	if (data.errcode) {
		throw new Error(`WeChat API error: ${data.errmsg}`);
	}

	return data;
}

async function getWeChatUserInfo(accessToken, openid) {
	const userInfoUrl = new URL(WECHAT_USER_INFO_URL);
	userInfoUrl.searchParams.set("access_token", accessToken);
	userInfoUrl.searchParams.set("openid", openid);
	userInfoUrl.searchParams.set("lang", "zh_CN");

	const response = await fetch(userInfoUrl.toString());
	const data = await response.json();

	if (data.errcode) {
		throw new Error(`WeChat user info error: ${data.errmsg}`);
	}

	return data;
}

async function processWeChatUser(wechatUser) {
	// Here you would typically save to your database
	// For now, return a user object
	const user = {
		id: wechatUser.openid,
		name: wechatUser.nickname,
		avatar: wechatUser.headimgurl,
		wechatOpenId: wechatUser.openid,
		wechatUnionId: wechatUser.unionid,
		gender:
			wechatUser.sex === 1
				? "male"
				: wechatUser.sex === 2
					? "female"
					: "unknown",
		city: wechatUser.city,
		province: wechatUser.province,
		country: wechatUser.country,
		createdAt: new Date(),
		lastLoginAt: new Date(),
	};

	// TODO: Save to your database
	// await saveUserToDatabase(user);

	return user;
}

async function createUserSession(user) {
	// Create a simple JWT or session token
	// In production, use proper JWT library
	const payload = {
		userId: user.id,
		name: user.name,
		avatar: user.avatar,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
	};

	// For demo purposes, return base64 encoded payload
	// In production, use proper JWT signing
	return Buffer.from(JSON.stringify(payload)).toString("base64");
}
