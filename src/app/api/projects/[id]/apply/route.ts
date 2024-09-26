// pages/api/projects/[id]/apply.ts
import connectDB from "@/config/database";
import Project from "@/models/Project";
import Notification from "@/models/Notification";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import {NotificationType} from "@/types/notification.type";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        // Получаем ID пользователя из запроса
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const projectId = params.id;

        // Проверка, что проект существует
        const project = await Project.findById(projectId);

        if (!project) {
            return new NextResponse('Project not found', { status: 404 });
        }

        // Убедимся, что поле participationRequests существует и является массивом
        if (!project.participationRequests) {
            project.participationRequests = [];
        }

        // Проверка, не подана ли уже заявка от этого пользователя
        const existingRequest = project.participationRequests.find(
            (request: any) => request.user.toString() === userId
        );

        if (existingRequest) {
            return new NextResponse('You have already applied for this project', { status: 400 });
        }

        // Извлечение данных из тела запроса
        const { name, about, contact } = await request.json();

        // Проверка обязательных полей
        if (!name || !contact) {
            return new NextResponse('Name and contact are required', { status: 400 });
        }

        // Добавление новой заявки
        const newParticipationRequest = {
            user: new mongoose.Types.ObjectId(userId),
            status: 'pending',
            submittedAt: new Date(),
            name,   // Имя заявителя
            about,  // Информация о заявителе
            contact // Контактные данные
        };

        project.participationRequests.push(newParticipationRequest);
        await project.save();

        // Создание уведомления для владельца проекта
        const newNotification = new Notification({
            recipient: project.owner._id,
            message: `User ${name} has applied for your project "${project.title}"`,
            type: NotificationType.PROJECT_APPLICATION,
            project: project._id,
            createdAt: new Date()
        });

        await newNotification.save();

        return NextResponse.json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error applying for project:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}