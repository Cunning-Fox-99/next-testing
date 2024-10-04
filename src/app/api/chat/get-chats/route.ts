import connectDB from "@/config/database";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB(); // Подключение к базе данных

        const userIdResult = getUserIdFromRequest(request);

        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;

        // Находим чаты с участием пользователя и подгружаем последние сообщения
        const userChats = await Chat.find({
            participants: userId
        })
            .populate('participants', 'username profileImage email') // Подгружаем информацию о пользователях
            .sort({ updatedAt: -1 }) // Сортируем чаты по дате последнего обновления
            .lean(); // Преобразуем результат в обычные объекты

        if (!userChats || userChats.length === 0) {
            return NextResponse.json({ chats: [] }, { status: 200 });
        }

        // Возвращаем чаты с полем lastMessage
        const chatsWithLastMessage = userChats.map(chat => ({
            ...chat,
            lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null,
            chatWith: chat.participants.find((participant:any) => participant._id.toString() !== userId)
        }));

        return NextResponse.json({ chats: chatsWithLastMessage }, { status: 200 });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
    }
}
