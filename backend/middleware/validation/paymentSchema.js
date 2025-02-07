import Joi from 'joi';

export const validatePayment = (req, res, next) => {
  const schema = Joi.object({
    student_id: Joi.string().pattern(/^STU-[A-Z0-9]{8}$/).required(),
    amount: Joi.number().positive().precision(2).required(),
    payment_purpose: Joi.string().valid('1st Semester', '2nd Semester', '3rd Semester', '4th Semester', 'Tuition', 'Books', 'Uniform', 'Other').required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};