// app/api/invitations/[inviteId]/accept/page.ts
import connectDB from "@/config/database";
import Invitation from "@/models/Invitation";
import Team from "@/models/Team";  // Импортируем модель команды
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { inviteId: string } }) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const { inviteId } = params;

        // Поиск приглашения и проверка, что пользователь является получателем
        const invite = await Invitation.findById(inviteId);
        const user = await Invitation.findById(userId);
        if (!invite || invite.userId.toString() !== userId) {
            return new NextResponse('Приглашение не найдено или доступ запрещен', { status: 403 });
        }

        // Получаем команду по ID команды из приглашения
        const team = await Team.findById(invite.teamId);
        if (!team) {
            return new NextResponse('Команда не найдена', { status: 404 });
        }

        // Добавляем пользователя в члены команды, если его там еще нет
        if (!team.members.includes(user)) {
            team.members.push(userId);
            await team.save();
        }

        // Обновление статуса приглашения
        invite.status = 'accepted';
        await invite.save();

        return new NextResponse('Приглашение принято и пользователь добавлен в команду', { status: 200 });
    } catch (error) {
        console.error('Ошибка при принятии приглашения:', error);
        return new NextResponse('Внутренняя ошибка сервера', { status: 500 });
    }
}
