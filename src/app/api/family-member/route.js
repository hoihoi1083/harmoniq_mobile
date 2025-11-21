import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import FamilyMember from "@/models/FamilyMember";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		const familyMember = await FamilyMember.findOne({ userId });

		return NextResponse.json({
			success: true,
			familyMember: familyMember || null,
		});
	} catch (error) {return NextResponse.json(
			{ message: "Failed to fetch family member", error: error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		await FamilyMember.deleteMany({ userId });

		return NextResponse.json({
			success: true,
			message: "Family member data deleted successfully",
		});
	} catch (error) {return NextResponse.json(
			{ message: "Failed to delete family member", error: error.message },
			{ status: 500 }
		);
	}
}
