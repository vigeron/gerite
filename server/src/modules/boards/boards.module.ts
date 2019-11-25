import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardSchema } from './schemas/schema';
import { ListSchema } from '../lists/scheme/schema';
import { CardSchema } from '../cards/scheme/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Board', schema: BoardSchema }]),
    MongooseModule.forFeature([{ name: 'List', schema: ListSchema }]),
    MongooseModule.forFeature([{ name: 'Card', schema: CardSchema }]),
  ],
  providers: [BoardsService],
  controllers: [BoardsController],
  exports: [BoardsService],
})
export class BoardsModule {}
