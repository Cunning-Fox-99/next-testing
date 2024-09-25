import connectDB from "@/config/database";
import Project from "@/models/Project";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import { ParticipantStatus } from "@/types/project.type"; // Импортируем типы статусов участников

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB(); // Подключаемся к базе данных

        // Извлекаем ID пользователя из токена
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult; // Получаем ID пользователя
        const { id } = params; // Получаем ID проекта из параметров

        // Получаем данные из тела запроса
        const { participantStatus } = await request.json();

        // Проверяем, что статус является допустимым значением
        if (!Object.values(ParticipantStatus).includes(participantStatus)) {
            return new NextResponse('Invalid participant status', { status: 400 });
        }

        // Находим проект по ID
        const project = await Project.findById(id).populate('owner team');

        if (!project) {
            return new NextResponse('Project not found', { status: 404 });
        }

        // Проверяем, является ли пользователь владельцем проекта
        if (project.owner._id.toString() !== userId) {
            return new NextResponse('Unauthorized', { status: 403 }); // Запрещаем доступ, если не владелец
        }

        // Обновляем статус приема заявок
        project.participantStatus = participantStatus;
        await project.save(); // Сохраняем изменения в базе данных

        return NextResponse.json({ message: 'Participant status updated successfully', project });
    } catch (error) {
        console.error('Error updating participant status:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
