import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/database";
import { getUserIdFromRequest } from "@/utils/authUtils";
import Project from "@/models/Project";

export async function DELETE(request: NextRequest, { params }: { params: { id: string; participantId: string } }) {
    try {
        await connectDB();

        // Проверяем авторизацию пользователя
        const userIdResult = getUserIdFromRequest(request);

        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const { id, participantId } = params;

        // Проверяем, что проект существует
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        // Проверяем, что текущий пользователь является владельцем проекта
        if (project.owner.toString() !== userId) {
            return NextResponse.json({ message: 'Unauthorized: You are not the owner of this project' }, { status: 403 });
        }


        // Ищем участника для удаления
        const participantExists = project.participants.some(
            (participant: any) => participant._id.toString() === participantId
        );

        console.log(participantExists)

        if (!participantExists) {
            return NextResponse.json({ message: 'Participant not found' }, { status: 404 });
        }

        // Удаляем участника из проекта
        project.participants = project.participants.filter(
            (participant: any) => participant._id.toString() !== participantId
        );

        await project.save(); // Сохраняем изменения

        return NextResponse.json({ message: 'Participant removed successfully' });
    } catch (error) {
        console.error('Error removing participant:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
