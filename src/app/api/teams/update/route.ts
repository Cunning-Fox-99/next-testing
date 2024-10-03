// app/api/teams/update/page.ts
import connectDB from "@/config/database";
import Team from "@/models/Team";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        await connectDB();
              const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const body = await request.json();
        console.log(body)
        const { teamId, name, description, workHours, daysOff } = body;

        if (!teamId) {
            return new NextResponse('Team ID is required', { status: 400 });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return new NextResponse('Team not found', { status: 404 });
        }

        if (!team.owner.equals(userId)) {
            return new NextResponse('Only the team owner can update team details', { status: 403 });
        }

        // Обновляем поля команды
        team.name = name ?? team.name;
        team.description = description ?? team.description;
        team.workHours = workHours ?? team.workHours;
        team.workDays = daysOff ?? team.workDays;
        console.log(team)

        await team.save();

        return NextResponse.json({ message: 'Team updated successfully' });
    } catch (error) {
        console.error('Error updating team:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
