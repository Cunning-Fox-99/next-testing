import { Schema } from 'mongoose';

export interface INotification {
    _id: string;
    recipient: Schema.Types.ObjectId;    // ID пользователя, который получает уведомление
    project?: Schema.Types.ObjectId;     // ID проекта, с которым связано уведомление (если применимо)
    team?: Schema.Types.ObjectId;        // ID команды, с которой связано уведомление (если применимо)
    type: NotificationType;              // Тип уведомления
    message: string;                     // Текст уведомления
    read: boolean;                       // Статус прочтения
    createdAt: Date;                     // Дата создания
}

export enum NotificationType {
    PROJECT_INVITATION = 'PROJECT_INVITATION',
    TEAM_INVITATION = 'TEAM_INVITATION',
    PROJECT_APPLICATION = 'PROJECT_APPLICATION',
    GENERAL_MESSAGE = 'GENERAL_MESSAGE',
}
