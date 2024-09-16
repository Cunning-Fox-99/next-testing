// models/Team.ts
import mongoose, { Schema, model, models } from 'mongoose';

const TeamSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    portfolio: [{ type: String }], // Ссылки на изображения
    workHours: { type: String },
    workDays: [{ type: String }] // Например, ['Monday', 'Tuesday', 'Wednesday']
}, { timestamps: true });

const Team = models.Team || model('Team', TeamSchema);

export default Team;
