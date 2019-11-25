import {Document, Schema } from 'mongoose';
import { CardDto } from '../dto/card.dto';

export interface Card extends CardDto, Document {}

export const CardSchema = new Schema({
  text: { type: String, required: true },
  boardId: { type: Schema.Types.ObjectId, required: true, ref: 'boards' },
  listId: { type: Schema.Types.ObjectId, required: true, ref: 'lists' },
  order: { type: Number, required: true, default: 0 },
  archived: { type: Boolean, required: true, default: false  },
  createdBy: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'users' },
  members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  createdAt: { type: Date, default: Date.now },
});
