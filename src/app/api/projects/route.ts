import connectDB from "@/config/database";
import Project from "@/models/Project";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
              const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;

        // Получаем проекты, где пользователь является владельцем или участником команды
        const projects = await Project.find({
            $or: [
                { owner: userId },
                { team: userId },
                { participants: userId }
            ]
        }).populate('owner team');

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
