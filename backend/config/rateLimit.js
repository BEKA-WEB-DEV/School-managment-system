import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Allow 10 requests per hour
  message: 'Too many login attempts, try again later',
  skip: req => process.env.NODE_ENV === 'development' // Disable in dev
});

// Strict limiter for sensitive endpoints
export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests/hour for payment/auth endpoints
  message: 'Too many attempts from this IP, please try again later.'
});

// config/rateLimit.js
export const examRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many exam-related requests'
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 (prod) vs 1000 (dev) requests
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});