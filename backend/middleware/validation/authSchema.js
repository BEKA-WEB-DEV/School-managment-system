import Joi from 'joi';

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    userType: Joi.string().valid('student', 'employee', 'admin', 'parent').required(),
    identifier: Joi.string().required(),
    password: Joi.string().min(8).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

// Optional: Schema for password reset requests
export const validatePasswordReset = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).required()
});