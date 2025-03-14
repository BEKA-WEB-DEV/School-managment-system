import { ROLES } from '../config/constants.js';
import { ForbiddenError } from '../utils/errorHandler.js';


export const adminAccess = (req, res, next) => {
  if (req.user.role === 'admin') {
    // Grant full access to admins
    return next();
  }
  next();
};

export const restrictTo = (...allowedRoles) => (req, res, next) => {
  try {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Special case: Parents can only access their own children's data
export const parentChildAccess = async (req, res, next) => {
  try {
    const studentId = req.params.student_id;
    const [student] = await pool.execute(
      'SELECT parent_id FROM students WHERE student_id = ?',
      [studentId]
    );
    
    if (student[0].parent_id !== req.user.parent_id) {
      throw new ForbiddenError('Access to child data denied');
    }
    next();
  } catch (err) {
    next(err);
  }
};