// app/api/delete-image/page.ts
import connectDB from '@/config/database';
import User from '@/models/User';
import { getUserIdFromRequest } from '@/utils/authUtils';
import { NextRequest, NextResponse } from 'next/server';

interface DeleteImageRequestBody {
    url: string;
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
              const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const body: DeleteImageRequestBody = await request.json();
        const { url } = body;

        if (!url) {
            return new NextResponse('URL is required', { status: 400 });
        }

        // Удаление изображения из базы данных
        await User.findByIdAndUpdate(userId, { $pull: { images: url } });

        return NextResponse.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
