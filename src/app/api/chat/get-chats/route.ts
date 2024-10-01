import connectDB from "@/config/database";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // Не забываем импортировать модель пользователя

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
        }).populate('participants', 'username profileImage email'); // Подгружаем данные участников

        if (!userChats || userChats.length === 0) {
            return NextResponse.json({ chats: [] }, { status: 200 });
        }

        // Формируем чаты с динамически вычисляемым собеседником
        const chatsWithChatWithField = userChats.map(chat => {
            // Определяем собеседника, исключая текущего пользователя
            const chatWith = chat.participants.find((participant: { _id: { equals: (arg0: string | undefined) => any; }; }) => !participant._id.equals(userId));

            return {
                ...chat.toObject(),
                chatWith // Добавляем поле с собеседником
            };
        });

        // Возвращаем чаты
        return NextResponse.json({ chats: chatsWithChatWithField }, { status: 200 });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
    }
}
