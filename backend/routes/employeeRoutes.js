import express from 'express';
import { 
  getEmployees, 
  createEmployee 
} from '../controllers/employeeController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { employeeSchema } from '../middleware/validation/employeeSchema.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET /employees (Admin only)
router.get(
  '/',
  authenticate(),
  authorizeRoles('admin'),
  getEmployees
);

// POST /employees (Admin only)
router.post(
  '/',
  authenticate(),
  authorizeRoles('admin'),
  rateLimiter,
  employeeSchema,
  createEmployee
);

export default router;