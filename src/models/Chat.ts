import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Отправитель сообщения
    content: { type: String },
    images: [{ type: String }],
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Пользователи, которые прочитали сообщение
});

const ChatSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        messages: [MessageSchema],
        notReadedMessages: { // Счетчик непрочитанных сообщений для каждого участника
            type: Map,
            of: Number,
            default: {},
        }
    },
    { timestamps: true }
);

ChatSchema.virtual('lastMessage').get(function() {
    // Возвращаем последнее сообщение или null, если сообщений нет
    return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
});

// Добавляем опцию, чтобы виртуальные поля преобразовывались в JSON
ChatSchema.set('toObject', { virtuals: true });
ChatSchema.set('toJSON', { virtuals: true });

const Chat = models.Chat || model('Chat', ChatSchema);
export default Chat;
