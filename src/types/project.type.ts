import { UserType } from './user.type';
import {IParticipant} from "@/models/Project";

export enum ProjectStatus {
    DRAFT = 'draft',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CLOSED = 'closed',
}

export enum ParticipantStatus {
    REGISTRATION = 'registration',
    CLOSED = 'closed',
}

// Тип для заявки на участие
export interface ParticipationRequest {
    _id: string,
    user: UserType;  // Пользователь, подавший заявку
    status: 'pending' | 'approved' | 'rejected';  // Статус заявки
    submittedAt: string;  // Дата подачи заявки
}

export interface IProject {
    _id: string;
    title: string;
    eventDate: string;
    description: string;
    participants: IParticipant[];  // Участники проекта
    team: UserType[];  // Команда проекта
    tags: string[];
    status: ProjectStatus;  // Статус проекта
    participantStatus: ParticipantStatus;  // Статус участников
    visibility: boolean;
    owner: UserType;  // Владелец проекта
    participationRequests: ParticipationRequest[];
}

// Опциональные типы для обновлений или частичных данных проекта
export type IProjectOptional = Partial<IProject>;
