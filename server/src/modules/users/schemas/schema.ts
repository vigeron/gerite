import {Document, Schema } from 'mongoose';
import { UserDto } from '../dto/user.dto';

export interface User extends UserDto, Document {}

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
