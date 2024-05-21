import { MiddlewareConsumer, Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { StripeController } from './controllers/stripe.controller';

import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleware } from 'src/users/middlewares/middlewares.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { EmailService } from 'src/auth/services/email.service';
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
