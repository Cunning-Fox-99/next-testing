import { Schema, model, models, Document } from 'mongoose';
import { NotificationType } from '@/types/notification.type';

// Интерфейс для TypeScript
interface INotification extends Document {
    recipient: Schema.Types.ObjectId;     // ID пользователя, который получает уведомление
    project?: Schema.Types.ObjectId;      // ID проекта, с которым связано уведомление
    team?: Schema.Types.ObjectId;         // ID команды, с которой связано уведомление
    type: NotificationType;               // Тип уведомления
    message: string;                      // Текст уведомления
    read: boolean;                        // Прочитано или нет
    createdAt: Date;                      // Время создания уведомления
}

// Схема для Mongoose
const NotificationSchema = new Schema<INotification>({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    type: {
        type: String,
        enum: Object.values(NotificationType),
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Проверяем, существует ли модель перед ее созданием
const Notification = models.Notification || model<INotification>('Notification', NotificationSchema);

export default Notification;
