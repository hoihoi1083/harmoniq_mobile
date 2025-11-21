
// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET() {
	const endTime = new Date("2025-07-01T00:00:00Z").getTime();
	return Response.json({ endTime });
}
