import {Document, Schema } from 'mongoose';
import { BoardDto } from '../dto/board.dto';

export interface Board extends BoardDto, Document {}

export const BoardSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'users' },
  members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  background: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// BoardSchema.index({slug: 1, createdBy: 1}, { unique: true });
