import { JwtMiddleware } from '../users/middlewares/middlewares.middleware';
import { AuthController } from '../auth/controllers/auth.controller';
import { User } from '../users/users.entity';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { GoogleStrategy } from './strategies/google.strategy';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { UserProfile } from '../users/user.profile.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, GoogleStrategy],
  exports: [AuthService, EmailService, JwtModule],
})
export default class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('auth/delete', 'auth/password/change');
  }
}
