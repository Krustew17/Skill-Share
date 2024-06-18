import { registerUserDto } from '../dto/register.dto';
import { loginPayloadDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { changePasswordBodyDto } from '../dto/changePassword.dto';
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

  @Post('refresh-token')
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  logoutUser(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logoutUser(req, res);
  }

  @Delete('delete')
  deleteUser(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.deleteUser(req, res);
  }

  @Post('request-password-reset')
  async sendPasswordResetEmail(@Body('email') email: string) {
    return this.authService.sendPasswordResetEmail(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('password') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword, confirmPassword);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request, @Res() res: Response) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const loginResult = await this.authService.googleLogin(req);
    if (loginResult) {
      res.redirect(`${process.env.DOMAIN}?token=` + loginResult.access_token);
    }
  }

  @Post('password/change')
  async changePassword(
    @Req() req: Request,
    @Body()
    body: changePasswordBodyDto,
  ) {
    return this.authService.changePassword(body, req);
  }
}
