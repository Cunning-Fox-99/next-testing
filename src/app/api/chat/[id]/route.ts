import connectDB from "@/config/database";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB(); // Подключение к базе данных

        // Получаем userId из токена
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;
        const { id } = params; // ID чата

        // Находим конкретный чат по его ID и проверяем, что пользователь участвует в этом чате
        const chat = await Chat.findOne({
            _id: id,
            participants: userId, // Проверяем, что пользователь является участником чата
        }).populate('participants', 'username profileImage email'); // Подгружаем данные участников

        if (!chat) {
            return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
        }

        // Определяем собеседника, исключая текущего пользователя
        const chatWith = chat.participants.find((participant: { _id: { equals: (arg0: string | undefined) => any; }; }) => !participant._id.equals(userId));

        // Возвращаем чат с полем собеседника
        const chatWithField = {
            ...chat.toObject(),
            chatWith, // Добавляем поле с собеседником
        };

        return NextResponse.json({ chat: chatWithField }, { status: 200 });
    } catch (error) {
        console.error("Error fetching chat:", error);
        return NextResponse.json({ error: "Failed to fetch chat" }, { status: 500 });
    }
}
