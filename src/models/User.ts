import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  images: [{ type: String }],
  profileImage: {type: String},
  username: {type: String},
  about: { type: String },
  workHours: { type: String },
  profession: { type: String },
  daysOff: [{ type: String }],
  phone: { type: String }
});

const User = models.User || model('User', UserSchema);

export default User;
