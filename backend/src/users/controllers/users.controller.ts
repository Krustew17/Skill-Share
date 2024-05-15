import { Request, Response } from 'express';
import { loginPayloadDto } from '../dto/login.dto';
import { registerUserDto } from '../dto/register.dto';
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
}
