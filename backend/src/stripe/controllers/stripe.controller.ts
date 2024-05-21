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
  constructor(
    private readonly stripeService: StripeService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() data: { amount: number; currency: string; customerEmail: string },
    @Req() req: Request,
  ) {
    try {
      const { amount, currency, customerEmail } = data;
      const customer = await this.stripe.customers.create({
        name: 'test',
        email: customerEmail,
      });
      const ephemeralKey = await this.stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2024-04-10' },
      );

      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount,
        currency,
        customerEmail,
      );
      return {
        client_secret: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
        userId: customer.id,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Post('confirm-payment-intent')
  async confirmPaymentIntent(@Body() data: { paymentIntentId: string }) {
    try {
      const { paymentIntentId } = data;
      const confirmedPaymentIntent =
        await this.stripeService.confirmPaymentIntent(paymentIntentId);
      return confirmedPaymentIntent;
    } catch (error) {
      console.log(error);
    }
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
      success_url: `http://127.0.0.1:5173/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://127.0.0.1:5173/cancel`,
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
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent was successful!`, paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent failed!`);
        break;
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
    if (session.customer_email) {
      await this.stripeService.updateUserToPremium(session.customer_email);
    }
  }
}
