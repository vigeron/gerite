import { Controller, Post, Body, UseGuards, Get, Req, Delete, Put } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AuthGuard } from '@nestjs/passport';
import { Board } from './schemas/schema';
import slugify from 'slugify';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req): Promise<Board[]> {
    return await this.boardsService.findAll(req.user.userId);
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() request) {
    const boardDto = request.body;
    boardDto.createdBy = request.user.userId;
    boardDto.slug = slugify(boardDto.name.toLowerCase());
    return await this.boardsService.create(boardDto);
  }

  @Put(':boardId')
  @UseGuards(AuthGuard('jwt'))
  async updateName(@Req() request) {
    return await this.boardsService.updateName(request.params.boardId,request.body.name, request.user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() request) {
    return await this.boardsService.destroy(request.params.id, request.user.userId);
  }

}
