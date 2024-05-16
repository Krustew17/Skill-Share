import { JwtMiddleware } from 'src/users/middlewares/middlewares.middleware';
import { AuthController } from '../auth/controllers/auth.controller';
import { User } from 'src/users/users.entity';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { Job } from 'src/jobs/jobs.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Job]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService, EmailService, JwtModule],
})
export default class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('auth/delete');
  }
}
