import { Injectable } from '@nestjs/common';
import { Card } from './scheme/schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CardsService {
  constructor(@InjectModel('Card') private readonly cardModel: Model<Card>) {}

  async findAll(boardId: any, listId: any, createdBy: any): Promise<Card[]> {
    return await this.cardModel.find({ boardId, listId, createdBy}).sort('order').exec();
  }

  async create(dto: import('./dto/card.dto').CardDto): Promise<Card> {
    return await this.cardModel(dto).save();
  }

  async update(id: any, dto: import('./dto/card.dto').CardDto): Promise<Card> {
    return await this.cardModel.updateOne(
      { _id: id, boardId: dto.boardId, listId: dto.listId, createdBy: dto.createdBy },
      { text: dto.text },
    );
  }

  async move(dto: any): Promise<Card> {
    return await this.cardModel.updateOne(
      { _id: dto.id, boardId: dto.boardId, listId: dto.removedListId, createdBy: dto.createdBy },
      { listId: dto.addedListId },
    );

  }

  async destroy(_id: any, createdBy: any) {
    return await this.cardModel.deleteOne({ _id, createdBy});
  }

  async updateOrdering(items: any, user: any) {
    items.forEach(async (i: string, idx: number) => {
      return await this.cardModel.updateOne({ _id: i, createdBy: user.userId }, { order: idx });
    });
  }
}
