import mongoose, { Document, Schema } from 'mongoose';
import { ProjectStatus, ParticipantStatus } from '@/types/project.type';

// Обновите интерфейс IProject, чтобы он наследовался от Document
export interface IProject extends Document {
    title: string;
    eventDate: string;
    description: string;
    tags: string[];
    status: ProjectStatus;
    participantStatus: ParticipantStatus;
    visibility: boolean;
    owner: mongoose.Schema.Types.ObjectId; // Владелец проекта
    team: mongoose.Schema.Types.ObjectId[]; // Команда
}

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
});

// Модель будет использовать интерфейс IProject, который теперь включает Document
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
