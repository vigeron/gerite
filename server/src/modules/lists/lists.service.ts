import { Injectable, HttpException } from '@nestjs/common';
import { List } from './scheme/schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from '../cards/scheme/schema';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel('List') private readonly listModel: Model<List>,
    @InjectModel('Card') private readonly cardModel: Model<Card>,
  ) {}

  async findAll(boardId: any, createdBy: any): Promise<List[]> {
    return await this.listModel.find({ boardId, createdBy}).sort('order').exec();
  }

  async create(dto: import('./dto/list.dto').ListDto): Promise<List> {
    return await this.listModel(dto).save();
  }

  async destroy(listId: any, createdBy: any) {
    await this.cardModel.deleteMany({ listId, createdBy });
    return await this.listModel.deleteOne({ _id: listId, createdBy});
  }

  async update(boardId: any, listId: any, userId: any, newListName: string) {
    const result = await this.listModel.find({ createdBy: userId, boardId, _id: listId });
    if (result.length > 0) {
      return await this.listModel.updateOne({ _id: listId, createdBy: userId }, { name: newListName });
    } else {
      throw new HttpException('list does not exists', 400);
    }
  }

  async updateOrdering(items: any, user: any) {
    items.forEach(async (i: string, idx: number) => {
      return await this.listModel.updateOne({ _id: i, createdBy: user.userId }, { order: idx });
    });
  }

}
