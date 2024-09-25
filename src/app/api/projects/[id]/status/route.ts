import connectDB from "@/config/database";
import Project from "@/models/Project";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import { ProjectStatus } from "@/types/project.type";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        // Извлекаем ID пользователя из токена
              const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const { id } = params;

        // Получаем данные из тела запроса
        const { status } = await request.json();

        // Проверяем, что статус является допустимым значением
        if (!Object.values(ProjectStatus).includes(status)) {
            return new NextResponse('Invalid status', { status: 400 });
        }

        // Находим проект по ID
        const project = await Project.findById(id).populate('owner team');

        if (!project) {
            return new NextResponse('Project not found', { status: 404 });
        }

        // Проверяем, является ли пользователь владельцем проекта или членом команды
        if (project.owner._id.toString() !== userId &&
            !project.team.some((member: { _id: { toString: () => string; }; }) => member._id.toString() === userId)) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        // Обновляем статус проекта
        project.status = status;
        await project.save();

        return NextResponse.json({ message: 'Project status updated successfully', project });
    } catch (error) {
        console.error('Error updating project status:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
