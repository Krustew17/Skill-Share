import { Request, Response } from 'express';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAllUsers(@Req() req: Request) {
    const user = req['user'];
    return this.userService.getAllUsers();
  }
  @Get('getUser')
  getUser(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.userService.Getuser(username, password);
  }

  @Get('get-user-by-token')
  getUserByToken(token: string) {
    return this.userService.getUserByToken(token);
  }

  @Get('me')
  getMe(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    return this.userService.getMe(token);
  }
}
