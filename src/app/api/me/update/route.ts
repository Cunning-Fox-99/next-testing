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
    phone?: string;
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

        // Находим пользователя по ID
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Обновляем только переданные поля
        if (body.username) user.username = body.username;
        if (body.about) user.about = body.about;
        if (body.workHours) user.workHours = body.workHours;
        if (body.profession) user.profession = body.profession;
        if (body.phone) user.phone = body.phone;
        if (body.daysOff) user.daysOff = body.daysOff;
        console.log(body)
        console.log('User before saving:', user);

        // Сохраняем пользователя с обновленными данными
        const updatedUser = await user.save();

        console.log('Updated user:', updatedUser);

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
