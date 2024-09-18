import mongoose, { Schema, model, models } from 'mongoose';

const ChatSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        messages: [
            {
                sender: { type: Schema.Types.ObjectId, ref: 'User' },
                content: { type: String },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Chat = models.Chat || model('Chat', ChatSchema);
export default Chat;
