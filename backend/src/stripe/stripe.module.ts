import { MiddlewareConsumer, Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { StripeController } from './controllers/stripe.controller';
import { User } from '../users/users.entity';
import { EmailService } from '../auth/services/email.service';
import { JwtMiddleware } from '../users/middlewares/middlewares.middleware';

import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import AuthModule from '../auth/auth.module';
dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [StripeService, JwtService, EmailService],
  controllers: [StripeController],
})
export class StripeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        'stripe/create-payment-intent',
        'stripe/confirm-payment-intent',
      );
  }
}
