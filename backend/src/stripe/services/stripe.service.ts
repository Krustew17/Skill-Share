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
      success_url: `${domain}/order/successful-payment`,
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

  async updateUserToPremium(email: string) {
    console.log(email);
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new Error('User not found');
    }

    user.hasPremium = true;
    await this.emailService.sendPremiumEmail(email);
    return await this.userRepository.save(user);
  }
}
