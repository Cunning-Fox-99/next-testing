import connectDB from "@/config/database";
import Project from "@/models/Project";  // Импорт модели Project
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const query = new URL(request.url).searchParams.get('query');

        if (!query) {
            return new NextResponse('Query parameter is missing', { status: 400 });
        }

        const projects = await Project.find({
            status: 'ongoing',
            participantStatus: 'registration',
            $or: [
                { title: { $regex: query, $options: 'i' } },  // Поиск по названию проекта (регистронезависимо)
                { tags: { $regex: query, $options: 'i' } },   // Поиск по тегам (регистронезависимо)
            ],
        }).exec();

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error searching projects:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
