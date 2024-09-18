
import connectDB from "@/config/database";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const query = new URL(request.url).searchParams.get('query');

        const users = await User.find({
            email: { $regex: query, $options: 'i' }
        }).exec();

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error searching teams:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
