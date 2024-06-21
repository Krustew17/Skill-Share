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
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendVerificationEmail(username: string, email: string, token: string) {
    const url = `${HOST}/verify-email?token=${token}`;
    if (email.includes('gmail.com')) {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        html: `Hello ${username}, click <a href="${url}">here</a> to verify your email.`,
      });
    } else {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        html: `Hello ${username}, click <a href="${url}">here</a> to verify your email.`,
      });
    }
  }

  async sendPasswordResetEmail(username: string, email: string, token: string) {
    const url = `${HOST}/reset-password?resetToken=${token}`;
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password',
      html: `Hey ${username}, click <a href="${url}">here</a> to reset your password.`,
    });
  }

  async sendPremiumEmail(email: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Premium Account',
        html: `Your account has been upgraded to premium. Enjoy!`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  async sendHireReceipt(email: string, amount: number, id: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Receipt ${id}`,
      html: `You have successfully hired talent for ${amount}$. Thank you for using Skill Share! The talent has been notified and will contact you soon.`,
    });
  }
}
