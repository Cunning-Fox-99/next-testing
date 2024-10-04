export interface ChatI {
    _id: string;
    chatWith: {
        profileImage: string;
        _id: string,
        email: string,
        username?: string
    },
    participants: {
        _id: string; // Добавлено для идентификации пользователя
        username?: string;
        email: string;
    }[];
    messages: {
        _id: string; // ID сообщения
        sender: string; // ID отправителя
        content?: string; // Содержимое сообщения (текст или URL для изображения)
        images?: string[]; // Массив картинок
        type: 'text' | 'image'; // Тип сообщения (текст или изображение)
        timestamp: Date; // Время отправки сообщения
    }[];
    lastMessage?: {
        content: string;
        images: string[]
        sender: string
    };
    notReadedMessages?: { [userId: string]: number }; // Непрочитанные сообщения для каждого пользователя
}
