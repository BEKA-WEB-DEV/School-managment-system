import Joi from 'joi';

export const paymentSchema = Joi.object({
  student_id: Joi.string().pattern(/^STU-[A-Z0-9]{8}$/).required(),
  amount: Joi.number().positive().precision(2).required(),
  payment_purpose: Joi.string().max(100).required()
});