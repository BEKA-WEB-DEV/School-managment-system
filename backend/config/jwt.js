// import jwt from 'jsonwebtoken';
// import { config } from 'dotenv';

// config();

// export const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user.user_id,
//       role: user.role
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
//   );
// };

// export const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (err) {
//     return null;
//   }
// };

// // Optional: Token decoding without verification
// export const decodeToken = (token) => {
//   return jwt.decode(token);
// };

import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants.js';
import { config } from 'dotenv';

config();

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.SECRET);
};