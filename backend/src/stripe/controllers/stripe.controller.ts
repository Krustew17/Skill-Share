import { StripeService } from '../services/stripe.service';
import { CreatePaymentDto } from '../dto/create.payment.dto';

import { Body, Controller, Post } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    const { amount, currency } = createPaymentDto;
    return this.stripeService.createPaymentIntent(amount, currency);
  }

  @Post('confirm-payment-intent')
  async confirmPaymentIntent(
    @Body()
    confirmPaymentDto: {
      paymentIntentId: string;
      paymentMethodId: string;
    },
  ) {
    const { paymentIntentId, paymentMethodId } = confirmPaymentDto;
    return this.stripeService.confirmPaymentIntent(
      paymentIntentId,
      paymentMethodId,
    );
  }

  @Post('create-payment-method')
  async createPaymentMethod(
    @Body()
    createPaymentMethodDto: {
      number: string;
      exp_month: number;
      exp_year: number;
      cvc: string;
    },
  ) {
    return this.stripeService.createPaymentMethod(createPaymentMethodDto);
  }
}
