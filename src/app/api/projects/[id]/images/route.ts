import connectDB from '@/config/database';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/utils/authUtils';
import Project from '@/models/Project'; // Импортируем модель проекта

interface RequestBody {
    imageUrl: string; // Ссылка на изображение
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();

    // Получаем ID пользователя из запроса
    const userIdResult = getUserIdFromRequest(request);

    // Проверка авторизации пользователя
    if (!userIdResult.authorized) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = userIdResult;
    const body: RequestBody = await request.json();
    const { imageUrl } = body; // Извлекаем imageUrl из тела запроса

    // Находим проект
    const project = await Project.findById(params.id);

    // Проверка, существует ли проект
    if (!project) {
        return new NextResponse('Project not found', { status: 404 });
    }

    // Проверка, является ли текущий пользователь владельцем проекта
    if (project.owner.toString() !== userId) {
        return NextResponse.json({ message: 'Unauthorized: Only the project owner can add images.' }, { status: 403 });
    }

    // Обновление проекта, добавляя ссылку на изображение в массив
    project.images.push(imageUrl); // Добавляем ссылку в массив изображений
    await project.save(); // Сохраняем изменения

    return new NextResponse('Image link added successfully', { status: 200 });
}

// Удаление изображения
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();

    // Получаем ID пользователя из запроса
    const userIdResult = getUserIdFromRequest(request);

    // Проверка авторизации пользователя
    if (!userIdResult.authorized) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = userIdResult;
    const body: RequestBody = await request.json();
    const { imageUrl } = body; // Извлекаем imageUrl из тела запроса

    // Находим проект
    const project = await Project.findById(params.id);

    // Проверка, существует ли проект
    if (!project) {
        return new NextResponse('Project not found', { status: 404 });
    }

    // Проверка, является ли текущий пользователь владельцем проекта
    if (project.owner.toString() !== userId) {
        return NextResponse.json({ message: 'Unauthorized: Only the project owner can add or remove images.' }, { status: 403 });
    }

    // Удаление изображения из массива
    project.images = project.images.filter((image:any) => image !== imageUrl); // Удаляем ссылку из массива
    await project.save(); // Сохраняем изменения

    return new NextResponse('Image link removed successfully', { status: 200 });
}
