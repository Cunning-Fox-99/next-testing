// app/api/invitations/[inviteId]/accept/route.ts
import connectDB from "@/config/database";
import Invitation from "@/models/Invitation";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { inviteId: string } }) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const { inviteId } = params;

        // Поиск приглашения и проверка, что пользователь является получателем
        const invite = await Invitation.findById(inviteId);
        if (!invite || invite.userId.toString() !== userId) {
            return new NextResponse('Приглашение не найдено или доступ запрещен', { status: 403 });
        }

        // Обновление статуса приглашения
        invite.status = 'accepted';
        await invite.save();

        return new NextResponse('Приглашение принято', { status: 200 });
    } catch (error) {
        console.error('Ошибка при принятии приглашения:', error);
        return new NextResponse('Внутренняя ошибка сервера', { status: 500 });
    }
}