import Joi from 'joi';

export const employeeSchema =(req, res, next) => {
  const schema = Joi.object({
    employee_id: Joi.string().pattern(/^EMP-[A-Z0-9]{8}$/).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('Admin', 'Registrar', 'Academic', 'Teacher').required(),
    level: Joi.string().valid('5', '4', '3', '2').required(),
    details: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      gender: Joi.string().valid('Male', 'Female').required(),
      date_of_birth: Joi.date().iso().required(),
      current_salary: Joi.number().positive().required()
    }).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};