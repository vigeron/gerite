import { Injectable, HttpException } from '@nestjs/common';
import { Board } from './schemas/schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { List } from '../lists/scheme/schema';
import { Card } from '../cards/scheme/schema';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<Board>,
    @InjectModel('List') private readonly listModel: Model<List>,
    @InjectModel('Card') private readonly cardModel: Model<Card>,
  ) {}

  /**
   * Get all user boards
   * @param createdBy string user ID
   */
  async findAll(createdBy: string): Promise<Board[]> {
    return await this.boardModel.find({ createdBy }).exec();
  }

  async create(boardDto: import('./dto/board.dto').BoardDto) {
    const result = await this.boardModel.find({ createdBy: boardDto.createdBy, slug: boardDto.slug });
    if (result.length === 0) {
      return await this.boardModel(boardDto).save();
    } else {
      throw new HttpException('duplicate-board', 400);
    }
  }

  async destroy(boardId, createdBy) {
    const board = await this.boardModel.findOne({_id: boardId } );
    if(`${board.createdBy}` !== createdBy) {
      console.log('No permission', typeof `${board.createdBy}`, typeof createdBy);
    }
    const lists = await this.listModel.find({ boardId }).sort('order').exec();
    for (const item of lists) {
      await this.cardModel.deleteMany({ listId: item._id });
    }
    await this.listModel.deleteMany({ boardId, createdBy });
    return await this.boardModel.deleteOne({ _id: boardId, createdBy});
  }

}
