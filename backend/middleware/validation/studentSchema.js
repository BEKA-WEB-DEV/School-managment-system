import Joi from 'joi';

export const studentCreateSchema = Joi.object({
  student_id: Joi.string().pattern(/^STU\d+$/).required(),
  grade_level: Joi.string().valid(
    '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade' // All valid grades
  ).required(),
  section: Joi.string().required(),
  status: Joi.string().valid('Active', 'Inactive').default('Active'),
  details: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    date_of_birth: Joi.date().iso().required(),
    gender: Joi.string().valid('Male', 'Female').required()
  }).required()
});

export const validateStudent = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: error.details.map(d => d.message) 
    });
  }
  next();
};