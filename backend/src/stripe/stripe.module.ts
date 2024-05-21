import { MiddlewareConsumer, Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { StripeController } from './controllers/stripe.controller';

import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { RawBodyMiddleware } from './middlewares/webhook/webhook.middleware';
dotenv.config();

@Module({
  imports: [],
  providers: [StripeService, JwtService],
  controllers: [StripeController],
})
export class StripeModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RawBodyMiddleware).forRoutes('stripe/webhooks');
  // }
}
