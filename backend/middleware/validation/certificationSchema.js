import Joi from 'joi';

export const certificationSchema = Joi.object({
  student_id: Joi.string().pattern(/^STU-[A-Z0-9]{8}$/).required(),
  cert_type: Joi.string().valid('1st Semester', '2nd Semester', '3rd Semester', '4th Semester', 'Total').required(),
  expiry_date: Joi.date().iso().greater('now').required()
});