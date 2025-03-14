import { body, param, query, validationResult } from 'express-validator';
import {
  ROLES,
  STUDENT_STATUS,
  EXAM_TYPES,
  PAYMENT_PURPOSES,
  GENDER,
  SUBJECT_DEPARTMENTS,
  PARENT_RELATIONSHIP,
  PAGINATION
} from '../config/constants.js';

export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));
  
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = errors.array().map(err => ({
    field: err.path,
    message: err.msg
  }));

  return res.status(422).json({ errors: extractedErrors });
};

// User Validation
export const validateUser = [
  body('role')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role'),
  body('email')
    .isEmail().normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
];

// Student Validation
export const validateStudent = [
  body('gender')
    .isIn(Object.values(GENDER))
    .withMessage('Invalid gender'),
  body('date_of_birth')
    .isDate({ format: 'YYYY-MM-DD' })
    .custom((value) => {
      const dob = new Date(value);
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 5);
      return dob <= minAgeDate;
    })
    .withMessage('Student must be at least 5 years old'),
  body('status')
    .optional()
    .isIn(Object.values(STUDENT_STATUS))
    .withMessage('Invalid student status'),
  body('parent_id')
    .isString().isLength({ min: 10, max: 20 })
    .withMessage('Invalid parent ID format')
];

// Exam Validation
export const validateExam = [
  body('exam_type')
    .isIn(Object.values(EXAM_TYPES))
    .withMessage('Invalid exam type'),
  body('max_score')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Max score must be between 0-100')
];

// Payment Validation
export const validatePayment = [
  body('purpose')
    .isIn(Object.values(PAYMENT_PURPOSES))
    .withMessage('Invalid payment purpose'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number')
];

// Class Validation
export const validateClass = [
  body('schedule')
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Weekend'])
    .withMessage('Invalid schedule day'),
  body('subject_id')
    .isString().isLength({ min: 5 })
    .withMessage('Invalid subject ID')
];

// Query Validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: PAGINATION.MAX_LIMIT })
    .withMessage(`Limit must be between 1-${PAGINATION.MAX_LIMIT}`)
];

// ID Parameter Validation
export const validateIdParam = [
  param('id')
    .isString().isLength({ min: 10, max: 30 })
    .withMessage('Invalid ID format')
];

export const validateLogin = [
  body('email')
    .isEmail().normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
];

export const validateUserCreation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(Object.values(ROLES))
];

export default {
  validate,
  validateUser,
  validateStudent,
  validateExam,
  validatePayment,
  validateClass,
  validatePagination,
  validateIdParam,
  validateDateRange,
  validateLogin,
  validateUserCreation
  
};
