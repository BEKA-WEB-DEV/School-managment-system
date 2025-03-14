import express from 'express';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import {
  recordAttendance,
  updateAttendance
} from '../../controllers/teacher/attendance.controller.js';

const router = express.Router();

router.use(authenticate, restrictTo('teacher'));

router.route('/:classId')
  .post(recordAttendance)
  .patch(updateAttendance);

export default router;