import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import { STRIPE_SECRET } from '../config/constants.js';

const stripe = new Stripe(STRIPE_SECRET);

export default class PaymentService {
  static async createPaymentIntent(amount, currency = 'ETB') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        metadata: { integration_check: 'accept_a_payment' }
      });
      return paymentIntent;
    } catch (err) {
      throw new Error(`Stripe error: ${err.message}`);
    }
  }

  static async confirmPayment(paymentId, studentId) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error('Payment record not found');
    
    const intent = await stripe.paymentIntents.retrieve(payment.stripe_id);
    if (intent.status === 'succeeded') {
      await Payment.updateStatus(paymentId, 'completed');
      return true;
    }
    return false;
  }
}