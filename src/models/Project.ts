import mongoose, { Document, Schema } from 'mongoose';
import { ProjectStatus, ParticipantStatus } from '@/types/project.type';
import { UserType } from '@/types/user.type'; // Импортируем интерфейс UserType

// Интерфейс для заявки на участие в проекте
export interface IParticipationRequest {
    user: mongoose.Schema.Types.ObjectId;  // Идентификатор пользователя, подавшего заявку
    status: 'pending' | 'approved' | 'rejected'; // Статус заявки
    submittedAt: Date;  // Дата подачи заявки
    name: string;       // Имя заявителя
    about?: string;     // Информация о заявителе
    contact: string;    // Контактные данные заявителя
}

// Интерфейс для участника проекта
export interface IParticipant extends UserType {
    // Здесь можно добавить дополнительные поля, если это необходимо
}

// Обновите интерфейс IProject, чтобы включить новые поля для заявок
interface IProject extends Document {
    title: string;
    eventDate: string;
    description: string;
    tags: string[];
    status: ProjectStatus;
    participantStatus: ParticipantStatus;
    visibility: boolean;
    owner: mongoose.Schema.Types.ObjectId; // Владелец проекта
    team: mongoose.Schema.Types.ObjectId[]; // Команда
    participants: IParticipant[]; // Обновлено для хранения полных объектов участников
    participationRequests: IParticipationRequest[];  // Заявки на участие
}

const ParticipationRequestSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
    name: { type: String, required: true },    // Имя заявителя
    about: { type: String },                   // Информация о заявителе
    contact: { type: String, required: true }  // Контактные данные заявителя
});

const ProjectSchema: Schema = new Schema({
    title: { type: String, required: true },
    eventDate: { type: Date, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.DRAFT },
    participantStatus: { type: String, enum: Object.values(ParticipantStatus), default: ParticipantStatus.CLOSED },
    visibility: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participants: [Schema.Types.Mixed], // Используем смешанный тип, чтобы хранить объекты UserType
    participationRequests: [ParticipationRequestSchema],  // Поле для заявок
    images: [{ type: String }]
});

// Модель будет использовать интерфейс IProject, который теперь включает Document и заявки
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
