import logger from '../utils/logger.js';

export class DatabaseError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
    this.originalError = originalError;
    this.isOperational = true;
  }
}

export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
    this.isOperational = true;
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.isOperational = true;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.isOperational = true;
  }
}

export const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error(`${err.name}: ${err.message}`, {
    url: req.originalUrl,
    user: req.user?.id,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Determine response details
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: err.isOperational ? err.message : 'Internal Server Error'
  };

  // Add validation errors if present
  if (err instanceof ValidationError && err.errors.length > 0) {
    response.errors = err.errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
    this.statusCode = 401;
    this.isOperational = true;
  }
}