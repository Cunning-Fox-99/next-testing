import connectDB from "@/config/database";
import Project from "@/models/Project";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import { IProjectOptional } from "@/types/project.type"; // Импортируйте только необходимые типы
import { UserType } from "@/types/user.type";
import User from "@/models/User";

interface PopulatedProject extends IProjectOptional {
    owner: UserType;
    team: UserType[];
}

interface UserIdResult {
    userId: string; // Определите тип userId
}

interface ResponseData {
    project: PopulatedProject;
    user: UserType | null; // Пользователь может быть null, если не авторизован
    authorized: boolean; // Флаг авторизации
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<ResponseData>> { // Указываем возвращаемый тип
    try {
        await connectDB();
        const userIdResult = getUserIdFromRequest(request); // Получаем результат аутентификации

        const { id } = params;

        // Ищем проект по ID и используем правильный тип
        const project = await Project.findById(id).populate<PopulatedProject>('owner team');

        if (!project) {
            return new NextResponse('Project not found', { status: 404 });
        }

        let user: UserType | null = null; // По умолчанию пользователь null

        // Проверяем, авторизован ли пользователь
        if (userIdResult.authorized) {
            user = await User.findById(userIdResult.userId); // Используем userId
        }

        // Возв ращаем проект и данные пользователя, а также флаг авторизации
        return NextResponse.json<ResponseData>({
            project,
            user, // Возвращаем объект пользователя (или null, если не авторизован)
            authorized: userIdResult.authorized, // Добавляем флаг авторизации
        });

    } catch (error) {
        console.error('Error fetching project:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
