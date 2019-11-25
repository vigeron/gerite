import { Controller, UseGuards, Get, Req, Param, Post, HttpCode, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { List } from './scheme/schema';
import { ListsService } from './lists.service';
import { identifier } from '@babel/types';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findAll(@Req() req): Promise<List[]> {
    return await this.listsService.findAll(req.params.id, req.user.userId);
  }

  @Post('ordering')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async updateOrder(@Req() req) {
    return await this.listsService.updateOrdering(req.body, req.user);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req) {
    const listDto = req.body;
    listDto.createdBy = req.user.userId;
    return await this.listsService.create(listDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() req) {
    return await this.listsService.destroy(req.params.id, req.user.userId);
  }
}
