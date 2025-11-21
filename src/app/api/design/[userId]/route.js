import { NextResponse } from "next/server";
import { getUserInfo } from "@/lib/session";
import dbConnect from "@/lib/mongoose";
import Design from "@/models/Design";
import {
	genSuccessData,
	genUnAuthData,
	genErrorData,
} from "../../utils/gen-res-data";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request, { params }) {
	const { userId } = await params;
	try {
		await dbConnect();
		const design = await Design.findOne({ userId }).select("-__v");
		return NextResponse.json(genSuccessData(design || {}));
	} catch (error) {
		console.error("Error fetching design:", error);
		return NextResponse.json(genErrorData("Error fetching design"));
	}
}
//TODO
export async function POST(request, { params }) {
	const { userId } = await params;
	try {
		const userInfo = await getUserInfo();
		if (userInfo == null) return Response.json(genUnAuthData());

		const body = await request.json();
		let localItems = body.localItems.map((item) => {
			return {
				...item,
				_type: item.type,
				data: {
					...item.data,
					_type: item.data.type,
				},
			};
		});
		await dbConnect();

		let design = await Design.findOne({ userId });

		if (design) {
			for (let key in body) {
				design[key] = body[key];
			}
			design.localItems = localItems;
			await design.save();
		} else {
			await Design.create({
				userId,
				...body,
				localItems,
			});
		}

		return NextResponse.json(genSuccessData());
	} catch (error) {
		console.error("Error saving design:", error);
		return NextResponse.json(genErrorData("Internal Server Error"));
	}
}
