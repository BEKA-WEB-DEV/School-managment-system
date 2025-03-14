import express from 'express';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import {
  submitExamResults,
  updateExamResult
} from '../../controllers/teacher/exam.controller.js';

const router = express.Router();

router.use(authenticate, restrictTo('teacher'));

router.route('exams/results')
  .post(submitExamResults)
  .patch(updateExamResult);

export default router;