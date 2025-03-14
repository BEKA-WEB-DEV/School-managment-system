// import { verifyToken } from '../config/jwt.js';
// import pool from '../config/db.js';
// import { ForbiddenError, UnauthorizedError } from './errorHandler.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (!token) throw new UnauthorizedError('Authentication required');

//     const decoded = verifyToken(token);
    
//     // Verify user exists in database
//     const [user] = await pool.execute(
//       'SELECT user_id, role, email FROM users WHERE user_id = ?',
//       [decoded.id]
//     );

//     if (!user[0]) throw new UnauthorizedError('Invalid token');
    
//     req.user = {
//       id: user[0].user_id,
//       role: user[0].role,
//       email: user[0].email
//     };

//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// import AuthService from '../services/AuthService.js';
// import { ForbiddenError, UnauthorizedError } from './errorHandler.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (!token) throw new UnauthorizedError('Authentication required');

//     const decoded = await AuthService.verifyToken(token);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     next(new UnauthorizedError(err.message));
//   }
// };

// // Role-based access middleware



// export const restrictTo = (...allowedRoles) => (req, res, next) => {
//   if (!allowedRoles.includes(req.user.role)) {
//     return next(new ForbiddenError('Access denied'));
//   }
//   next();
// };
// import AuthService from '../services/AuthService.js';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants.js';
import { ForbiddenError, UnauthorizedError } from './errorHandler.js';

export const authenticate = async (req, res, next) => {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET);
    
    // Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (err) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (req.user.role === 'admin') 
    return next();
  
  if (!roles.includes(req.user.role)) {
    return next(new ForbiddenError('Insufficient permissions'));
  }
  next();
};


export const parentChildAccess = async (req, res, next) => {
  try {
    const studentId = req.params.student_id;
    const [student] = await pool.execute(
      'SELECT parent_id FROM students WHERE student_id = ?',
      [studentId]
    );
    
    if (!student[0] || student[0].parent_id !== req.user.parent_id) {
      throw new ForbiddenError('Access to child data denied');
    }
    next();
  } catch (err) {
    next(err);
  }
};