import Joi from 'joi';

// Student creation validation

// Student ID format: STU-0000-000000
export const validateStudent = (req, res, next) => {
  const schema = Joi.object({
    student_id: Joi.string().pattern(/^STU-\d{4}-[A-Z0-9]{6}$/).required(),
    grade_level: Joi.string().valid(
      '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade' // All grade levels
    ).required(),
    details: Joi.object({
      first_name: Joi.string().max(50).required(),
      last_name: Joi.string().max(50).required(),
      date_of_birth: Joi.date().iso().max('now').required(),
      gender: Joi.string().valid('Male', 'Female').required()
    }).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};