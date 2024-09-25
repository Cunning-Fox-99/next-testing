import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import { getUserIdFromRequest } from "@/utils/authUtils";
import Project from "@/models/Project";
import User from "@/models/User"; // Импортируем модель пользователя

export async function PUT(request: NextRequest, { params }: { params: { id: string; requestId: string } }) {
    try {
        await connectDB();

        // Если пользователь не аутентифицирован
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const { id, requestId } = params;

        // Проверка, что проект существует
        const project = await Project.findById(id)

        if (!project) {
            return new NextResponse('Project not found', { status: 404 });
        }

        // Проверка, что текущий пользователь является владельцем проекта
        if (project.owner.toString() !== userId) {
            return new NextResponse('Unauthorized: You are not the owner of this project', { status: 403 });
        }

        // Извлечение нового статуса из тела запроса
        const { status } = await request.json();

        // Проверка, что статус предоставлен
        if (!status) {
            return new NextResponse('Status is required', { status: 400 });
        }

        // Поиск заявки на участие
        const requestToUpdate = project.participationRequests.find((req: any) => req._id.toString() === requestId);

        if (!requestToUpdate) {
            return new NextResponse('Participation request not found', { status: 404 });
        }

        // Обновляем статус заявки
        requestToUpdate.status = status;

        // Если статус "approved", добавляем пользователя в список участников
        if (status === 'approved') {
            // Получаем полный объект пользователя по ID
            const userToAdd = await User.findById(requestToUpdate.user);
            if (!userToAdd) {
                return new NextResponse('User not found', { status: 404 });
            }

            // Проверяем, что пользователь уже не в списке участников
            const participantExists = project.participants.some((participant: any) => participant.toString() === userToAdd._id.toString());
            if (!participantExists) {
                project.participants.push(userToAdd); // Добавляем ID пользователя
            }

        }

        project.participationRequests = project.participationRequests.filter((req: any) => req._id.toString() !== requestId);

        await project.save(); // Сохраняем изменения в проекте

        return NextResponse.json({ message: 'Participation request status updated successfully', request: requestToUpdate });
    } catch (error) {
        console.error('Error updating participation request status:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
