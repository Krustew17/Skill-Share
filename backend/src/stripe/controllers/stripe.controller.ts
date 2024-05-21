import { StripeService } from '../services/stripe.service';
import { CreatePaymentDto } from '../dto/create.payment.dto';

import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { RawBodyRequest } from '../types/raw-body-request.interface';
import Stripe from 'stripe';
import { Request, Response } from 'express';

@Controller('stripe')
export class StripeController {
  private stripe: Stripe;
  constructor(private readonly stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    return this.stripeService.createPaymentIntent(createPaymentDto.amount);
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
  @Post('webhook/events')
  async handleStripeWebhook(@Req() req: RawBodyRequest, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        webhookSecret,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('successful payment');
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent failed!`);
        break;
    }

    res.status(HttpStatus.OK).send('Received');
  }
}

// @Post('create-payment-method')
// async createPaymentMethod(
//   @Body()
//   createPaymentMethodDto: {
//     number: string;
//     exp_month: number;
//     exp_year: number;
//     cvc: string;
//   },
// ) {
//   return this.stripeService.createPaymentMethod(createPaymentMethodDto);
// }

// @Post('create-checkout-session')
// async createCheckoutSession(@Res() res: Response) {
//   const session = await this.stripeService.createCheckoutSession();
//   res.json({ id: session.id });
// }
