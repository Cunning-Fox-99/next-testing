export interface ChatI {
    _id: string;
    participants: {
        _id: string; // Добавлено для идентификации пользователя
        username: string;
        email: string;
    }[];
    messages: {
        _id: string; // ID сообщения
        sender: string; // ID отправителя
        content: string; // Содержимое сообщения (текст или URL для изображения)
        type: 'text' | 'image'; // Тип сообщения (текст или изображение)
        timestamp: Date; // Время отправки сообщения
    }[];
    notReadedMessages?: { [userId: string]: number }; // Непрочитанные сообщения для каждого пользователя
}
