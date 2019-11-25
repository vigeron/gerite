import { Controller, UseGuards, Get, Req, Post, HttpCode, Delete, Put } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from '@nestjs/passport';
import { Card } from './scheme/schema';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':boardId/:listId')
  async findAll(@Req() req): Promise<Card[]> {
    return await this.cardsService.findAll(req.params.boardId, req.params.listId, req.user.userId);
  }

  @Post('ordering')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async updateOrder(@Req() req) {
    return await this.cardsService.updateOrdering(req.body, req.user);
  }

  @Post('move')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async move(@Req() req) {
    const cardDto = req.body;
    cardDto.createdBy = req.user.userId;
    return await this.cardsService.move(cardDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req) {
    const cardDto = req.body;
    cardDto.createdBy = req.user.userId;
    return await this.cardsService.create(cardDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() req) {
    const cardDto = req.body;
    cardDto.createdBy = req.user.userId;
    return await this.cardsService.update(req.params.id, cardDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() req) {
    return await this.cardsService.destroy(req.params.id, req.user.userId);
  }

}
