import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const HOST = 'http://127.0.0.1:3000';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'skillsharehub17@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${HOST}/users/verify-email?token=${token}`;
    if (email.includes('gmail.com')) {
      await this.transporter.sendMail({
        from: '"SkillShare" <skillsharehub17@gmail.com>',
        to: email,
        subject: 'Verify your email',
        html: `Click <a href="${url}">here</a> to verify your email.`,
      });
    } else {
      await this.transporter.sendMail({
        from: '"SkillShare" <skillsharehub17@gmail.com>',
        to: email,
        subject: 'Verify your email',
        html: `Click the url below to verify your email:\n
      ${url}`,
      });
    }
  }
}
