import {Document, Schema } from 'mongoose';
import { ListDto } from '../dto/list.dto';

export interface List extends ListDto, Document {}

export const ListSchema = new Schema({
  name: { type: String, required: true },
  boardId: { type: Schema.Types.ObjectId, required: true, ref: 'boards' },
  order: { type: Number, required: true, default: 0 },
  done: { type: Boolean,  default: false },
  archived: { type: Boolean, required: true, default: false },
  createdBy: { type: String, required: true, index: true, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
});
