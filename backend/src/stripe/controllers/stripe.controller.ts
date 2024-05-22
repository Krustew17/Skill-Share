import { StripeService } from '../services/stripe.service';
import { RawBodyRequest } from '../types/raw-body-request.interface';
import { User } from 'src/users/users.entity';
import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Response, Request } from 'express';
import { Repository } from 'typeorm';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  private stripe: Stripe;
  constructor(private readonly stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() product: { name: string; price: number; email: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const lineItems = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price,
      },
      quantity: 1,
    };
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItems],
      mode: 'payment',
      customer_email: product.email,
      success_url: `http://127.0.0.1:5173?successful_payment=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://127.0.0.1:5173?successful_payment=false&session_id={CHECKOUT_SESSION_ID}`,
    });
    return res.json({ session: session });
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

    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        this.handleCheckoutSessionCompleted(checkoutSession);
        break;
    }

    res.status(HttpStatus.OK).send('Received');
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    if (
      session.customer_email &&
      session.status === 'complete' &&
      session.payment_status === 'paid'
    ) {
      await this.stripeService.updateUserToPremium(session.customer_email);
    }
  }
}
