import express from 'express';
import {
  registerTeacher,
  listTeachers,
  getTeacherDetails,
  updateTeacherProfile,
  deleteTeacher
} from '../../controllers/registrar/teachers.controller.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { validate } from '../../middleware/validator.js';
import { validateTeacher } from '../../middleware/validator.js';

const router = express.Router();

// Apply authentication and role check to all routes
router.use(authenticate, restrictTo('registrar', 'admin'));

// Teacher Registration Routes
router.route('/')
  .post(validate(validateTeacher), registerTeacher) // Create teacher
  .get(listTeachers); // List teachers

router.route('/:teacherId')
  .get(getTeacherDetails) // Get teacher details
  .patch(validate(validateTeacher), updateTeacherProfile) // Update teacher
  .delete(deleteTeacher); // Delete teacher

export default router;



// import express from 'express';
// import { authenticate, restrictTo } from '../../middleware/auth.js';
// import {
//   registerTeacher,
//   updateTeacherProfile
// } from '../../controllers/registrar/teachers.controller.js';

// const router = express.Router();

// router.use(authenticate, restrictTo('registrar'));

// router.route('/')
//   .post(registerTeacher);

// router.route('/:teacherId')
//   .patch(updateTeacherProfile);

// export default router;