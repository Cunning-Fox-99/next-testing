// src/app/api/me/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/config/database';
import { getUserIdFromRequest } from '@/utils/authUtils';

interface RequestBody {
    username?: string;
    about?: string;
    workHours?: string;
    profession?: string;
    fio?: string
    daysOff?: string[];
}

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const userIdResult = getUserIdFromRequest(req);

        if (userIdResult instanceof NextResponse) {
            return userIdResult;
        }

        const { userId } = userIdResult;
        const body: RequestBody = await req.json();

        if (!userId) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Удаляем поля, которые не были переданы
        const updateFields: Partial<RequestBody> = {};
        if (body.username) updateFields.username = body.username;
        if (body.about) updateFields.about = body.about;
        if (body.workHours) updateFields.workHours = body.workHours;
        if (body.profession) updateFields.profession = body.profession;
        if (body.fio) updateFields.fio = body.fio;
        if (body.daysOff) updateFields.daysOff = body.daysOff;

        console.log('Update fields:', updateFields);

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
