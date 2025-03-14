import nodemailer from 'nodemailer';
import { SMTP_CONFIG } from '../config/constants.js';

const transporter = nodemailer.createTransport(SMTP_CONFIG);

export default class NotificationService {
  static async sendExamResultNotification(studentEmail, examDetails) {
    await transporter.sendMail({
      to: studentEmail,
      subject: 'New Exam Result Published',
      html: `<p>Your ${examDetails.exam_type} result for ${examDetails.subject} is available!</p>`
    });
  }

  static async sendPaymentConfirmation(parentEmail, paymentDetails) {
    await transporter.sendMail({
      to: parentEmail,
      subject: 'Payment Received',
      html: `<p>Payment of ${paymentDetails.amount} for ${paymentDetails.purpose} was successful.</p>`
    });
  }
}