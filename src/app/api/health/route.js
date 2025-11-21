// 健康检查端点

// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET() {
	return Response.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		service: "feng-shui-chat",
	});
}
