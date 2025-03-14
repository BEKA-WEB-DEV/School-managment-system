import express from 'express';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import {
  getExamResults
} from '../../controllers/student/results.controller.js';

const router = express.Router();

router.use(authenticate, restrictTo('student'));

router.get('/', getExamResults);

export default router;