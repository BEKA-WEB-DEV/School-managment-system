import express from 'express';
import {
    registerStudent,
    listStudents,
    getStudentDetails,
    updateStudentRecord,
    deleteStudent
  } from '../../controllers/registrar/students.controller.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import { ROLES } from '../../config/constants.js';

const router = express.Router();

// Allow admin and registrar access
router.use(authenticate, restrictTo(ROLES.ADMIN, ROLES.REGISTRAR));

// Routes remain the same
router.route('/')
  .get(listStudents)
  .post(registerStudent);

router.route('/:studentId')
  .get(getStudentDetails)
  .patch(updateStudentRecord)
  .delete(deleteStudent);

export default router;

// import express from 'express';
// import {
//   registerStudent,
//   listStudents,
//   getStudentDetails,
//   updateStudentRecord,
//   deleteStudent
// } from '../../controllers/registrar/students.controller.js';
// import { authenticate, restrictTo } from '../../middleware/auth.js';
// import { validate } from '../../middleware/validator.js';
// import { validateStudent } from '../../middleware/validator.js';

// const router = express.Router();

// // Apply authentication and role check to all routes
// router.use(authenticate, restrictTo('registrar, admin'));

// // Student Registration Routes
// router.route('/')
//   .post(validate(validateStudent), registerStudent) // Create student
//   .get(listStudents); // List students with filters

// router.route('/:studentId')
//   .get(getStudentDetails) // Get student details
//   .patch(validate(validateStudent), updateStudentRecord) // Update student
//   .delete(deleteStudent); // Delete student

// export default router;


// // import express from 'express';
// // import { 
// //   registerStudent,
// //   updateStudentRecord,
// //   getStudentDetails,
// //   deleteStudent,
// //   listStudents
// // } from '../../controllers/registrar/students.controller.js';
// // import { authenticate, restrictTo } from '../../middleware/auth.js';
// // import  {validate}  from '../../middleware/validator.js';
// // import { validateStudent } from '../../middleware/validator.js';

// // const router = express.Router();

// // // Apply authentication and role check to all routes
// // router.use(authenticate, restrictTo('registrar'));

// // // Create new student
// // router.post(
// //   '/',
// //   validate(validateStudent),
// //   registerStudent
// // );

// // // Get all students (with optional filters)
// // router.get(
// //   '/',
// //   listStudents
// // );

// // // Get single student details
// // router.get(
// //   '/:studentId',
// //   getStudentDetails
// // );

// // // Update student record
// // router.patch(
// //   '/:studentId',
// //   validate(validateStudent),
// //   updateStudentRecord
// // );

// // // Delete student (archive)
// // router.delete(
// //   '/:studentId',
// //   deleteStudent
// // );

// // export default router;