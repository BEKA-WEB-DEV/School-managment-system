import Joi from 'joi';

// Schema for creating a parent account
export const createParentSchema = (req, res, next) => {
const schema = Joi.object({
  father_first_name: Joi.string().max(255).required().messages({
    'any.required': 'Father\'s first name is required',
    'string.empty': 'Father\'s first name cannot be empty'
  }),
  father_last_name: Joi.string().max(255).required(),
  mother_first_name: Joi.string().max(255).required(),
  mother_last_name: Joi.string().max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  password: Joi.string().min(8).required(),
  relationship: Joi.string().valid('Parent', 'Guardian').required()
});
const { error } = schema.validate(req.body);
if (error) return res.status(400).json({ error: error.details[0].message });
next();
};

// Schema for linking student to parent
export const linkStudentSchema = (req, res, next) => {
const schema = Joi.object({
  student_id: Joi.string()
    .pattern(/^STU-[A-Z0-9]{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid student ID format. Expected format: STU-XXXXXXX'
    }),
  password: Joi.string().min(8).required() // Parent password verification
});
const { error } = schema.validate(req.body);
if (error) return res.status(400).json({ error: error.details[0].message });
next();
};

// Schema for updating parent contact info
export const updateContactSchema = (req, res, next) => {
const schema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/)
}).or('email', 'phone').messages({
  'object.missing': 'Must provide either email or phone to update'
});
const { error } = schema.validate(req.body);
if (error) return res.status(400).json({ error: error.details[0].message });
next();
};

// Schema for parent-initiated payments
export const parentPaymentSchema = (req, res, next) => {
const schema = Joi.object({
  student_id: Joi.string()
    .pattern(/^STU-[A-Z0-9]{8}$/)
    .required(),
  amount: Joi.number().positive().precision(2).required(),
  payment_purpose: Joi.string().valid('1st Semester', '2nd Semester', '3rd Semester', '4th Semester', 'Tuition', 'Books', 'Uniform', 'Other').required()
});
const { error } = schema.validate(req.body);
if (error) return res.status(400).json({ error: error.details[0].message });
next();
};