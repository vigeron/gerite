import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import uuidv1 = require('uuid/v1');

@Injectable()
export class AuthService {
  constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService,
    ) {}

  async validateLogin(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUsername(username);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    return this.validateLogin(user.username, user.password).then((userData) => {
       if (!userData) {
        return { statusCode: 400, message: 'Wrong username or password' };
       }
       const accessToken = this.jwtService.sign(this.createPayload(userData));
       return {
         expires_in: 3600,
         access_token: accessToken,
         username: userData.username,
         avatar: userData.avatarUrl,
         statusCode: 200,
       }
    });
  }

  async register(user: any) {
    if (!user.username || !user.password || !user.email) {
      return { statusCode: 400, message: 'Wrong username or password' };
    }
    let userData: any;
    userData = await this.usersService.findUsername(user.username);
    if (userData) {
      return { statusCode: 400, message: 'This username aleady exists' };
    }
    await this.usersService.create(user);
    userData = await this.usersService.findUsername(user.username);
    if (!userData) {
      return { statusCode: 500, message: 'Oops...something went wrong!' };
    }
    const accessToken = this.jwtService.sign(this.createPayload(userData));
    return {
        expires_in: 3600,
        access_token: accessToken,
        username: userData.username,
        avatar: userData.avatarUrl,
        statusCode: 201,
    };
  }

  createPayload(user: any) {
      const payload = { username: user.username, sub: user._id };
      return payload;
  }
}
