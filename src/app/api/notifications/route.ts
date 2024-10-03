// pages/api/notifications/page.ts
import connectDB from "@/config/database";
import Notification from "@/models/Notification";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Получаем ID пользователя из запроса
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;

        // Получаем все непрочитанные уведомления для данного пользователя
        const unreadNotifications = await Notification.find({
            recipient: userId,
            read: false
        }).sort({ createdAt: -1 }); // Сортируем по дате создания (сначала новые)

        return NextResponse.json({ notifications: unreadNotifications });
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
