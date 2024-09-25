import connectDB from "@/config/database";
import Project from "@/models/Project";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
              const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const body = await request.json();
        const { title, eventDate, description, tags, status } = body;

        // Проверяем, что обязательные поля заполнены
        if (!title || !eventDate || !description) {
            return new NextResponse('Title, eventDate, and description are required', { status: 400 });
        }

        const newProject = new Project({
            title,
            eventDate,
            description,
            tags,
            status,
            owner: userId,  // Записываем владельца
            team: [userId],  // Добавляем владельца в команду
        });

        await newProject.save();

        return NextResponse.json({ message: 'Project created', project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
