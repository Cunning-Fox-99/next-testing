import { UserType } from './user.type';

export enum ProjectStatus {
    DRAFT = 'draft',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CLOSED = 'closed',
}

export enum ParticipantStatus {
    REGISTRATION = 'registration',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CLOSED = 'closed',
}

export interface IProject {
    _id: string;
    title: string;
    eventDate: string;
    description: string;
    participants: UserType[];
    team: UserType[];
    tags: string[];
    status: ProjectStatus; // Используем enum для статуса проекта
    participantStatus: ParticipantStatus; // Используем enum для статуса участников
    visibility: boolean;
    owner: UserType; // Владелец проекта
}

export type IProjectOptional = Partial<IProject>;