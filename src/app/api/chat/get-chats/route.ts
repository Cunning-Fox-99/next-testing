import connectDB from "@/config/database";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB(); // Подключение к базе данных

        // Получаем userId из токена
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;

        // Находим все чаты, где пользователь является участником
        const userChats = await Chat.find({
            participants: userId
        }).populate('participants chatWith', 'username profileImage email'); // Добавляем данные участников

        if (!userChats || userChats.length === 0) {
            return NextResponse.json({ chats: [] }, { status: 200 });
        }

        // Возвращаем чаты
        return NextResponse.json({ chats: userChats }, { status: 200 });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
    }
}
