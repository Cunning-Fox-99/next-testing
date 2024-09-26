import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from '@/models/User';

// Это запрос через GET с id в параметрах
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const { id } = params;

        if (!id) {
            return NextResponse.json({ message: 'User id not found' }, { status: 400 });
        }

        const user = await User.findById(id).lean(); // lean() для возврата простого объекта

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
