import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/auth/services/email.service';
import { User } from 'src/users/users.entity';

import { InjectRepository } from '@nestjs/typeorm';

import { Request, Response } from 'express';
import { Repository } from 'typeorm';

import Stripe from 'stripe';

const domain = process.env.DOMAIN;

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }
  async createCheckoutSession(): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Skill Share',
            },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${domain}/success`,
      cancel_url: `${domain}/cancel`,
    });

    return session;
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    customerEmail: string,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      // payment_method_types: ['card'],
      receipt_email: customerEmail,
    });
    return paymentIntent;
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    const confirmedPaymentIntent =
      await this.stripe.paymentIntents.confirm(paymentIntentId);
    return confirmedPaymentIntent;
  }

  handleStripeWebhook(request: Request, response: Response) {
    const sig = request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        request.body,
        sig,
        webhookSecret,
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(paymentIntent);
        // Handle successful payment here
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent failed!`, failedPaymentIntent);
        // Handle failed payment here
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
  }

  async updateUserToPremium(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new Error('User not found');
    }

    user.hasPremium = true;
    await this.emailService.sendPremiumEmail(email);
    return await this.userRepository.save(user);
  }
}
