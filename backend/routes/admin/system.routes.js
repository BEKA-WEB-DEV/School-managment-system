// import express from 'express';
// import { authenticate, restrictTo } from '../../middleware/auth.js';
// import {
//   configureAcademicYear,
//   manageSystemRoles
// } from '../../controllers/admin/system.controller.js';

// const router = express.Router();

// router.use(authenticate, restrictTo('admin'));

// router.post('/academic-year', configureAcademicYear);
// router.patch('/roles', manageSystemRoles);

// export default router;

// routes/admin/system.routes.js
// import express from 'express';
// import { configureAcademicYear } from '../../controllers/admin/system.controller.js';

// const router = express.Router();
// router.post('/academic-year', configureAcademicYear);
// export default router;

import { Router } from 'express';
import SystemController from '../../controllers/admin/system.controller.js';
import { authenticate, restrictTo } from '../../middleware/auth.js';

const router = Router();

// Public routes
router.get('/health', SystemController.getHealth);
router.post('/install', SystemController.handleInstall);

// Admin protected routes
router.post('/academic-year', 
  authenticate,
  restrictTo('admin'),
  SystemController.configureAcademicYear
);

export default router;