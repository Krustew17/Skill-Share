import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { json, raw, urlencoded } from 'body-parser';
import { RawBody } from '@nestjs/common';

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

  app.enableCors();
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
