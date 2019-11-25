import { Controller, Request, Get, UseGuards, Post, Body, HttpCode, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    ) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/register')
  async register(@Body() req, @Res() res) {
    const result = await this.authService.register(req);
    res.status(result.statusCode).send(result);
  }

  @Post('auth/login')
  async login(@Body() req, @Res() res) {
    const result = await this.authService.login(req);
    res.status(result.statusCode).send(result);
  }
 }
