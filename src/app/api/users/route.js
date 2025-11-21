import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]/route';

// Get all users (admin only in a real app)

// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET() {
	try {
		// In a real app, add authentication check here
		// const session = await getServerSession(authOptions);
		// if (!session || !session.user.isAdmin) {
		//   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		// }

		await dbConnect();
		const users = await User.find({}).select("-__v");

		return NextResponse.json({ users });
	} catch (error) {return NextResponse.json(
			{ message: "Failed to fetch users", error: error.message },
			{ status: 500 }
		);
	}
}
