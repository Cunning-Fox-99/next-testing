import connectDB from '@/config/database';
import {NextRequest, NextResponse} from 'next/server';
import User from '@/models/User';
import {getUserIdFromRequest} from '@/utils/authUtils';

interface RequestBody {
    link: string;
}

export async function POST(request: NextRequest) {
    await connectDB();
    const userIdResult = getUserIdFromRequest(request);

    // Проверка авторизации пользователя
    if (!userIdResult.authorized) {
        return NextResponse.json({message: 'Unauthorized'}, {status: 403});
    }

    const {userId} = userIdResult;

    const body: RequestBody = await request.json();
    const {link} = body;

    await User.findByIdAndUpdate(userId, {profileImage: link})

    return new NextResponse('Profile image updated', {status: 200});
}