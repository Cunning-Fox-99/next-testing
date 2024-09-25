import connectDB from "@/config/database";
import Chat from "@/models/Chat";
import { getUserIdFromRequest } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB(); // Подключение к базе данных

        const { id } = params;

        // Получаем userId из токена
        const userIdResult = getUserIdFromRequest(request);

        // Проверка авторизации пользователя
        if (!userIdResult.authorized) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { userId } = userIdResult;

        // Проверяем, что ID чата существует
        if (!id) {
            return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
        }

        // Находим чат по ID
        const chat = await Chat.findById(id)
            .populate('participants', 'username email')
            .exec();

        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        // Проверяем, что пользователь является участником чата
        const isParticipant = chat.participants.some((participant: any) =>
            participant._id.toString() === userId!.toString()
        );

        if (!isParticipant) {
            return NextResponse.json({ error: "User is not a participant of this chat" }, { status: 403 });
        }

        // Обрабатываем отправку сообщения
        const body = await request.json();
        const { message } = body; // Извлекаем сообщение

        if (!message || !message.trim()) {
            return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
        }

        // Создаем новое сообщение с указанием отправителя
        const newMessage = {
            sender: userId, // Указываем отправителя
            content: message,
            timestamp: new Date(),
            readBy: [userId], // Добавляем себя в массив прочитавших
        };

        // Добавляем сообщение в чат
        chat.messages.push(newMessage);

        // Обновляем поле notReadedMessages для всех участников, кроме отправителя
        chat.participants.forEach((participant: any) => {
            const participantId = participant._id.toString();
            if (participantId !== userId!.toString()) {
                chat.notReadedMessages.set(
                    participantId,
                    (chat.notReadedMessages.get(participantId) || 0) + 1
                );
            }
        });

        await chat.save();

        return NextResponse.json({ chat }, { status: 200 });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
