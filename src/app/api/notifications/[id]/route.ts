// pages/api/notifications/[id]/page.ts
import connectDB from "@/config/database";
import Notification from "@/models/Notification";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        // Получаем ID пользователя из запроса
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const notificationId = params.id;

        // Найдем уведомление по ID и убедимся, что оно принадлежит пользователю
        const notification = await Notification.findOne({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return new NextResponse('Notification not found or access denied', { status: 404 });
        }

        // Обновляем статус уведомления на "прочитано"
        notification.read = true;
        await notification.save();

        return NextResponse.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
