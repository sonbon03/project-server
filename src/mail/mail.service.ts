import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 8000,
      secure: false,
      auth: {
        user: 'trinhson.mirailabs@gmail.com', // Thay thế bằng email của bạn
        pass: 'gzng rbod mrhh anyy', // Thay thế bằng mật khẩu của bạn
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:8000/api/users/verify?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: 'trinhson.mirailabs@gmail.com', // Thay thế bằng thông tin người gửi
        to: to,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${url}`,
        html: `<a href="${url}">Verify your email</a>`,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  }
}
