import connectDB from "@/config/database";
import Project from "@/models/Project";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import { IProjectOptional, ProjectStatus } from "@/types/project.type";
import { UserType } from "@/types/user.type";

interface PopulatedProject extends IProjectOptional {
    owner: UserType;
    team: UserType[];
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request);

        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const { id } = params;

        // Ищем проект по ID и используем правильный тип
        const project = await Project.findById(id).populate<PopulatedProject>('owner team');

        if (!project) {
            return new NextResponse('Project not found', { status: 404 });
        }

        // Сначала проверяем статус проекта
        if (project.status === ProjectStatus.ONGOING ||
            project.owner._id.toString() === userId ||
            project.team.some((member: { _id: { toString: () => string; }; }) => member._id.toString() === userId)) {
            return NextResponse.json(project);
        } else {
            return new NextResponse('Unauthorized', { status: 403 });
        }

    } catch (error) {
        console.error('Error fetching project:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}