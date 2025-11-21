import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		await dbConnect();
		const data = await request.json();

		// Validate required fields
		const requiredFields = [
			"userId",
			"gender",
			"birthYear",
			"birthMonth",
			"birthDay",
			"birthHour",
			"provider",
		];
		for (const field of requiredFields) {
			if (!data[field]) {
				return NextResponse.json(
					{ message: `Missing required field: ${field}` },
					{ status: 400 }
				);
			}
		}

		// Check if user already exists
		const existingUser = await User.findOne({ userId: data.userId });
		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 }
			);
		}

		// Validate birth date components
		const { birthYear, birthMonth, birthDay, birthHour } = data;
		if (
			birthYear < 1900 ||
			birthYear > new Date().getFullYear() ||
			birthMonth < 1 ||
			birthMonth > 12 ||
			birthDay < 1 ||
			birthDay > 31 ||
			birthHour < 0 ||
			birthHour > 23
		) {
			return NextResponse.json(
				{ message: "Invalid birth date or time" },
				{ status: 400 }
			);
		}

		// Create new user
		const newUser = new User({
			userId: data.userId,
			gender: data.gender,
			birthYear: data.birthYear,
			birthMonth: data.birthMonth,
			birthDay: data.birthDay,
			birthHour: data.birthHour,
			email: data.email || null,
			provider: data.provider,
		});

		await newUser.save();

		return NextResponse.json(
			{
				success: true,
				user: {
					id: newUser.userId,
					gender: newUser.gender,
					provider: newUser.provider,
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error saving user profile:", error);
		return NextResponse.json(
			{ message: "Failed to save user profile", error: error.message },
			{ status: 500 }
		);
	}
}
