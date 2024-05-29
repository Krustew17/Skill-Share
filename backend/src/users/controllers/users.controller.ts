import { UserService } from '../services/user.service';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh-guard';

import { Request } from 'express';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

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
  @UseGuards(JwtRefreshGuard)
  getMe(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    return this.userService.getMe(token);
  }

  @Post('profile/update')
  @UseGuards(JwtRefreshGuard)
  updateProfile(
    @Req() req: Request,
    @Body()
    data: {
      username: string;
      firstName: string;
      lastName: string;
      country: string;
    },
  ) {
    return this.userService.updateUser(data, req);
  }
}
