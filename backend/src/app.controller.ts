import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('*')
  serveApp(@Req() req: Request, @Res() res: Response): void {
    res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html'));
  }
}
