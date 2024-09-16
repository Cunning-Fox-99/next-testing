import connectDB from "@/config/database";
import Team from "@/models/Team";
import Invitation from "@/models/Invitation";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        if (userIdResult instanceof NextResponse) {
            return userIdResult;
        }

        const { userId } = userIdResult;

        // Получаем команды пользователя
        const teams = await Team.find({
            $or: [{ owner: userId }, { members: userId }]
        }).populate('owner').populate('members').exec();

        // Получаем приглашения пользователя
        const invitations = await Invitation.find({ userId }).populate('team').exec();

        return NextResponse.json({ teams, invitations });
    } catch (error) {
        console.error('Ошибка при получении команд и приглашений:', error);
        return new NextResponse('Внутренняя ошибка сервера', { status: 500 });
    }
}
