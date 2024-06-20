import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { raw } from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from 'express';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = parseInt(process.env.PORT) || 3000;
  app.use(
    '/stripe/webhook/events',
    raw({ type: 'application/json' }),
    (req: Request, res: Response, next: () => void) => {
      (req as any).rawBody = req.body;
      next();
    },
  );
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.DOMAIN,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const config = new DocumentBuilder()
    .setTitle('SkillShare API')
    .setDescription('SkillShare Backend API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api');

  await app.listen(port);
  const frontendBuildPath = join(__dirname, '..', '../frontend/build');
  const uploadsPath = join(__dirname, '..', '../uploads');

  console.log(`Serving frontend from: ${frontendBuildPath}`);
  console.log(`Serving uploads from: ${uploadsPath}`);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
