// app/api/teams/[id]/toggle-search-status/route.ts
import connectDB from "@/config/database";
import Team from "@/models/Team";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const team = await Team.findById(params.id).exec();

        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        // Проверка, является ли пользователь владельцем команды
        if (!team.owner.equals(userId)) {
            return NextResponse.json({ message: 'You are not authorized to change this team status' }, { status: 403 });
        }

        // Переключение статуса поиска
        team.isSearchingOpen = !team.isSearchingOpen;
        await team.save();

        return NextResponse.json({ isSearchingOpen: team.isSearchingOpen });
    } catch (error) {
        console.error('Ошибка при переключении статуса поиска команды:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
