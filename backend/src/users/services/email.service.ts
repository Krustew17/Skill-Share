import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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
        pass: 'kbau ibeu snrr anhx',
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://127.0.0.1:3000/users/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: '"SkillShare" <skillsharehub17@gmail.com>',
      to: email,
      subject: 'Verify your email',
      html: `Click <a href="${url}">here</a> to verify your email.`,
    });
  }
}
