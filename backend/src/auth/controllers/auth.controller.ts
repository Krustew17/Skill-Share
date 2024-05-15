import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { registerUserDto } from '../dto/register.dto';
import { loginPayloadDto } from '../dto/login.dto';
import { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() userData: registerUserDto) {
    return this.authService.createUser(userData);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyUser(token);
  }
  @Post('login')
  loginUser(
    @Body() AuthPayload: loginPayloadDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginUser(AuthPayload, req, res);
  }
}
