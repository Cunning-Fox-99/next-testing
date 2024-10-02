import connectDB from "@/config/database";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB(); // Подключение к базе данных

        // Получаем userId из токена
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const { recipientId } = await request.json(); // Получаем ID пользователя, которому хотим написать

        // Проверяем, что recipientId существует
        if (!recipientId) {
            return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 });
        }

        // Проверяем, существует ли уже чат между двумя пользователями
        const existingChat = await Chat.findOne({
            participants: { $all: [userId, recipientId] }, // Найти чат с обоими участниками
        });

        if (existingChat) {
            return NextResponse.json({ chat: existingChat }, { status: 200 }); // Вернуть существующий чат
        }

        // Если чата нет, создаём новый
        const newChat = new Chat({
            participants: [userId, recipientId],
            messages: [],
        });

        await newChat.save(); // Сохраняем чат в базе данных

        return NextResponse.json({ chat: newChat }, { status: 201 }); // Вернуть новый чат
    } catch (error) {
        console.error("Error creating chat:", error);
        return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
    }
}
