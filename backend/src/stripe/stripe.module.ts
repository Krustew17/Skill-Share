import { Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { StripeController } from './controllers/stripe.controller';

@Module({
  imports: [],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
