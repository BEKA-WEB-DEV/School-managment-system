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

// Custom validation middleware
export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));
  
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = errors.array().map(err => ({
    field: err.path,
    message: err.msg
  }));

  res.status(400).json({ errors: extractedErrors });
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
export const validateStudentRegistration = [
  body('user_id').notEmpty().withMessage('User ID is required'),
  body('parent_id').notEmpty().withMessage('Parent ID is required'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['Male', 'Female']).withMessage('Invalid gender'),
  body('date_of_birth').isISO8601().withMessage('Invalid date format (YYYY-MM-DD)'),
  body('address').notEmpty().withMessage('Address is required')
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

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

// Teacher validation
export const validateTeacher = [
  body('employment_type')
    .isIn(['full-time', 'part-time', 'contract'])
    .withMessage('Invalid employment type'),
  body('specialization')
    .isLength({ min: 3 })
    .withMessage('Specialization must be at least 3 characters')
];

// parent validation
export const validateParent = [
  body('father_first_name').notEmpty().withMessage('Father first name is required'),
  body('father_last_name').notEmpty().withMessage('Father last name is required'),
  body('mother_first_name').notEmpty().withMessage('Mother first name is required'),
  body('mother_last_name').notEmpty().withMessage('Mother last name is required'),
  body('relationship').isIn(['Parent', 'Guardian']),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('address').optional().isString(),
  param('parentId').isString().isLength({ min: 10, max: 20 })
];

export default {
  validate,
  validateUser,
  validateStudentRegistration,
  validateExam,
  validatePayment,
  validateClass,
  validatePagination,
  validateIdParam,
  validateLogin,
  validateUserCreation,
  loginValidation,
  validateTeacher,
  validateParent
};

// import { body, param, query, validationResult } from 'express-validator';
// import {
//   ROLES,
//   STUDENT_STATUS,
//   EXAM_TYPES,
//   PAYMENT_PURPOSES,
//   GENDER,
//   SUBJECT_DEPARTMENTS,
//   PARENT_RELATIONSHIP,
//   PAGINATION
// } from '../config/constants.js';

// export const validate = (validations) => async (req, res, next) => {
//   await Promise.all(validations.map(validation => validation.run(req)));
  
//   const errors = validationResult(req);
//   if (errors.isEmpty()) return next();

//   const extractedErrors = errors.array().map(err => ({
//     field: err.path,
//     message: err.msg
//   }));

//   return res.status(422).json({ errors: extractedErrors });
// };

// // User Validation
// export const validateUser = [
//   body('role')
//     .isIn(Object.values(ROLES))
//     .withMessage('Invalid role'),
//   body('email')
//     .isEmail().normalizeEmail()
//     .withMessage('Invalid email address'),
//   body('password')
//     .isLength({ min: 8 })
//     .withMessage('Password must be at least 8 characters')
//     .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
//     .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
//     .matches(/\d/).withMessage('Password must contain at least one number')
// ];

// // Student Validation
// export const validateStudent = [
//   body('first_name')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('First name must be between 2-50 characters'),
//   body('last_name')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Last name must be between 2-50 characters'),
//   body('gender')
//     .isIn(Object.values(GENDER))
//     .withMessage('Invalid gender'),
//   body('date_of_birth')
//     .isDate({ format: 'YYYY-MM-DD' })
//     .withMessage('Invalid date format (YYYY-MM-DD)')
//     .custom((value) => {
//       const dob = new Date(value);
//       const minAgeDate = new Date();
//       minAgeDate.setFullYear(minAgeDate.getFullYear() - 5);
//       return dob <= minAgeDate;
//     })
//     .withMessage('Student must be at least 5 years old'),
//   body('status')
//     .optional()
//     .isIn(Object.values(STUDENT_STATUS))
//     .withMessage('Invalid student status')
// ];

// // Payment Validation
// export const validatePayment = [
//   body('amount')
//     .isFloat({ min: 0 })
//     .withMessage('Amount must be a positive number'),
//   body('purpose')
//     .isIn(Object.values(PAYMENT_PURPOSES))
//     .withMessage('Invalid payment purpose'),
//   body('student_id')
//     .isString().isLength({ min: 10, max: 20 })
//     .withMessage('Invalid student ID format')
// ];

// // Exam Validation
// export const validateExam = [
//   body('exam_type')
//     .isIn(Object.values(EXAM_TYPES))
//     .withMessage('Invalid exam type'),
//   body('max_score')
//     .isFloat({ min: 0, max: 100 })
//     .withMessage('Max score must be between 0-100'),
//   body('exam_date')
//     .isDate({ format: 'YYYY-MM-DD' })
//     .withMessage('Invalid exam date format')
// ];

// // Class Validation
// export const validateClass = [
//   body('class_name')
//     .isLength({ min: 5, max: 100 })
//     .withMessage('Class name must be between 5-100 characters'),
//   body('subject_id')
//     .isString().isLength({ min: 5 })
//     .withMessage('Invalid subject ID format'),
//   body('schedule')
//     .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Weekend'])
//     .withMessage('Invalid schedule day')
// ];

// // Parent Validation
// export const validateParent = [
//   body('father_first_name')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Father\'s first name must be between 2-50 characters'),
//   body('father_last_name')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Father\'s last name must be between 2-50 characters'),
//   body('mother_first_name')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Mother\'s first name must be between 2-50 characters'),
//   body('mother_last_name')
//     .isLength({ min: 2, max: 50 })
//     .withMessage('Mother\'s last name must be between 2-50 characters'),
//   body('relationship')
//     .isIn(Object.values(PARENT_RELATIONSHIP))
//     .withMessage('Invalid relationship type')
// ];

// // Query Validation
// export const validatePagination = [
//   query('page')
//     .optional()
//     .isInt({ min: 1 })
//     .withMessage('Page must be a positive integer'),
//   query('limit')
//     .optional()
//     .isInt({ min: 1, max: PAGINATION.MAX_LIMIT })
//     .withMessage(`Limit must be between 1-${PAGINATION.MAX_LIMIT}`)
// ];

// // ID Parameter Validation
// export const validateIdParam = [
//   param('id')
//     .isString().isLength({ min: 10, max: 30 })
//     .withMessage('Invalid ID format')
// ];

// // Date Range Validation
// export const validateDateRange = [
//   query('startDate')
//     .optional()
//     .isDate({ format: 'YYYY-MM-DD' })
//     .withMessage('Invalid start date format'),
//   query('endDate')
//     .optional()
//     .isDate({ format: 'YYYY-MM-DD' })
//     .withMessage('Invalid end date format')
//     .custom((value, { req }) => {
//       if (req.query.startDate && new Date(value) < new Date(req.query.startDate)) {
//         throw new Error('End date must be after start date');
//       }
//       return true;
//     })
// ];

// // Login Validation
// export const validateLogin = [
//   body('email')
//     .isEmail().normalizeEmail()
//     .withMessage('Invalid email address'),
//   body('password')
//     .isLength({ min: 8 })
//     .withMessage('Password must be at least 8 characters')
// ];

// export default {
//   validate,
//   validateUser,
//   validateStudent,
//   validatePayment,
//   validateExam,
//   validateClass,
//   validateParent,
//   validatePagination,
//   validateIdParam,
//   validateDateRange,
//   validateLogin
// };