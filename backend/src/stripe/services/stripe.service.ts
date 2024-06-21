import { Injectable } from '@nestjs/common';
import { EmailService } from '../../auth/services/email.service';
import { User } from '../../users/users.entity';

import { InjectRepository } from '@nestjs/typeorm';

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

  async createPaymentIntent(amount: number, talentId: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
    });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
  // async confirmPaymentIntent(paymentIntentId: string) {
  //   const paymentIntent = await this.paymentIntentRepository.findOne({
  //     where: { paymentIntentId },
  //     relations: ['talent'],
  //   });

  //   if (
  //     paymentIntent.clientStatus === 'completed' &&
  //     paymentIntent.talentStatus === 'completed'
  //   ) {
  //     await this.stripe.paymentIntents.confirm(paymentIntentId);
  //     paymentIntent.paymentStatus = 'paid';
  //     await this.paymentIntentRepository.save(paymentIntent);

  //     // Transfer the amount to the talent's Stripe account
  //     await this.stripe.transfers.create({
  //       amount: paymentIntent.amount * 100, // Stripe expects the amount in cents
  //       currency: 'usd',
  //       destination: paymentIntent.talent.stripeAccountId, // Assuming the Talent entity has a stripeAccountId field
  //     });
  //   }

  //   return paymentIntent;
  // }
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
