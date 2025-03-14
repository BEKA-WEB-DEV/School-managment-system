import express from 'express';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import {
  getStudentSchedule
} from '../../controllers/student/schedule.controller.js';

const router = express.Router();

router.use(authenticate, restrictTo('student'));

router.get('/', getStudentSchedule);

export default router;