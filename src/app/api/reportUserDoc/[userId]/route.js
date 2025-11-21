import { NextResponse } from 'next/server';
import { getUserInfo } from '@/lib/session';
import dbConnect from '@/lib/mongoose';
import ReportUserDoc from '@/models/ReportUserDoc';
import { genSuccessData, genUnAuthData, genErrorData } from "../../utils/gen-res-data";




//更新用户报告isDelete

// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function PATCH(request, { params }) {
    const { userId } = await params;
    try {
        const userInfo = await getUserInfo();
        if (userInfo == null) return Response.json(genUnAuthData());

        const body = await request.json();
        await dbConnect();

        //let design = await Design.findOne({ userId });

        let userDocList = await ReportUserDoc.find({ userId, isDelete: 0 });
        let updates = userDocList.map(item => ({
            updateOne: {
                filter: { _id: item._id },
                update: { $set: body }
            }
        }));
        await ReportUserDoc.bulkWrite(updates);
        return NextResponse.json(genSuccessData())
    } catch (error) {return NextResponse.json(genErrorData('Internal Server Error'));
    }
} 
