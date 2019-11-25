import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({username}).exec();
    if (!user) {
      return null;
    }
    return user;
  }

  async create(userDto: UserDto): Promise<User> {
    return await this.userModel(userDto).save();
  }
}
