import express from 'express';
import { authenticate, restrictTo } from '../../middleware/auth.js';
import {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser
} from '../../controllers/admin/users.controller.js';

const router = express.Router();

router.use(authenticate, restrictTo('admin'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);



router.route('/:userId')
  .patch(updateUserRole)
  .delete(deleteUser);

export default router;