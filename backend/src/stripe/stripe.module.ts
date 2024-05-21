import { MiddlewareConsumer, Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { StripeController } from './controllers/stripe.controller';
import { User } from 'src/users/users.entity';
import { EmailService } from 'src/auth/services/email.service';
import { JwtMiddleware } from 'src/users/middlewares/middlewares.middleware';

import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([User])],
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
