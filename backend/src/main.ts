import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { raw } from 'body-parser';
import path, { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as express from 'express';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/stripe/webhook/events',
    raw({ type: 'application/json' }),
    (req: Request, res: Response, next: () => void) => {
      (req as any).rawBody = req.body;
      next();
    },
  );
  // app.enableCors();
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://127.0.0.1:5173',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
