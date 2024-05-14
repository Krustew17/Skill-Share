import { UserService } from '../services/user.service';

import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('fetch')
  getUsers() {
    return { message: 'Returned all users' };
  }

  @Post('create')
  createUser(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.userService.Createuser(username, password);
  }

  @Get('getuser')
  getUser(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.userService.Getuser(username, password);
  }
}
