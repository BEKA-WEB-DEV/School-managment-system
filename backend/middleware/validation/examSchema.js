import Joi from 'joi';

export const examCreateSchema = Joi.object({
  exam_datetime: Joi.date().iso().required(),
  duration: Joi.number().min(10).required(),
  grade_level: Joi.string().required(),
  section: Joi.string().required()
});

export const validateExam = (schema) => (req, res, next) => {
  // Similar validation logic as above
};