import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import * as dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.DOMAIN;

@Injectable()
export class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendVerificationEmail(email: string, token: string) {
    const url = `${HOST}/verify-email?token=${token}`;
    if (email.includes('gmail.com')) {
      await this.transporter.sendMail({
        from: 'mailtrap@demomailtrap.com',
        to: email,
        subject: 'Verify your email',
        html: `Click <a href="${url}">here</a> to verify your email.`,
      });
    } else {
      await this.transporter.sendMail({
        from: '"mailtrap@demomailtrap.com',
        to: email,
        subject: 'Verify your email',
        html: `Click the url below to verify your email:\n
      ${url}`,
      });
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${HOST}/auth/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: '"mailtrap@demomailtrap.com',
      to: email,
      subject: 'Reset your password',
      html: `Click <a href="${url}">here</a> to reset your password.`,
    });
  }

  async sendPremiumEmail(email: string) {
    await this.transporter.sendMail({
      from: '"mailtrap@demomailtrap.com',
      to: email,
      subject: 'Premium Account',
      html: `Your account has been upgraded to premium. Enjoy!`,
    });
  }
}
