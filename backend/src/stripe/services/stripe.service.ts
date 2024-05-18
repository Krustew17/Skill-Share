import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
    });
    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  }

  async createPaymentMethod(cardDetails: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  }) {
    return await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardDetails.number,
        exp_month: cardDetails.exp_month,
        exp_year: cardDetails.exp_year,
        cvc: cardDetails.cvc,
      },
    });
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    return await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
  }
}
