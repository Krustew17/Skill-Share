import { Request } from 'express';
import { loginPayloadDto } from '../dto/login.dto';
import { registerUserDto } from '../dto/register.dto';
import { UserService } from '../services/user.service';

import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('fetch')
  async getAllUsers(@Req() req: Request) {
    const user = req['user'];
    return this.userService.getAllUsers();
  }

  @Post('register')
  createUser(@Body() userData: registerUserDto) {
    return this.userService.createUser(userData);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.userService.verifyUser(token);
  }
  @Post('login')
  loginUser(@Body() AuthPayload: loginPayloadDto) {
    return this.userService.loginUser(AuthPayload);
  }

  @Get('getuser')
  getUser(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.userService.Getuser(username, password);
  }
}
