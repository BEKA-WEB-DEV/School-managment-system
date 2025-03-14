export const ROLES = {
  ADMIN: 'admin',
  ACADEMIC: 'academic',
  REGISTRAR: 'registrar',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated'
};

export const EXAM_TYPES = {
  MIDTERM: 'midterm',
  FINAL: 'final',
  QUIZ: 'quiz'
};

export const PAYMENT_PURPOSES = {
  TUITION: 'tuition',
  UNIFORM: 'uniform',
  ACTIVITIES: 'activities',
  OTHER: 'other'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female'
};

export const SUBJECT_DEPARTMENTS = {
  MATH: 'Math',
  SCIENCE: 'Science',
  ARTS: 'Arts',
  LANGUAGES: 'Languages',
  ENGLISH: 'English',
  CIVICS: 'Civics'
};

export const PARENT_RELATIONSHIP = {
  PARENT: 'Parent',
  GUARDIAN: 'Guardian'
};

export const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 
  'AB+', 'AB-', 'O+', 'O-', 
  'Unknown'
];

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100
};

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || '574cf9cf8d3cdfd71e3613cd613ac59604e00c4694f42ee47736b27743a7446a',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  COOKIE_NAME: 'school_jwt',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  }
};