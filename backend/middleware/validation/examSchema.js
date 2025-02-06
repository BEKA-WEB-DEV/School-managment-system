import Joi from 'joi';

export const examSchema = Joi.object({
  exam_datetime: Joi.date().iso().required(),
  duration: Joi.number().integer().positive().required(),
  grade_level: Joi.string()
    .valid('1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade')
    .required(),
  section: Joi.string().required(),
  exam_type: Joi.string()
    .valid('Test', 'Quiz', 'Midterm', 'Final', 'Assessment')
    .required(),
  semester: Joi.string()
    .valid('1st Semester', '2nd Semester', '3rd Semester', '4th Semester')
    .required()
});