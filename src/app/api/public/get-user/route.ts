import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from '@/models/User';

// Это запрос через POST (если хотите передавать userId в теле запроса)
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User id not found' }, { status: 400 });
        }

        const user = await User.findById(userId).lean(); // lean() для возврата простого объекта
        console.log(user);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
