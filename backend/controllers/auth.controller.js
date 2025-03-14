// import { generateToken } from '../config/jwt.js';
// import User from '../models/User.js';

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
    
//     // 1. Check if user exists
//     const user = await User.findByEmail(email);
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email' });
//     }

//     // 2. Verify password
//     const isValidPassword = await User.comparePassword(password, user.password_hash);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     // 3. Generate JWT
//     const token = generateToken({
//       id: user.user_id,
//       role: user.role,
//       email: user.email
//     });

//     // 4. Set cookie
//     res.cookie('jwt', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 3600000 // 1 hour
//     });

//     res.status(200).json({
//       id: user.user_id,
//       role: user.role,
//       email: user.email
//     });

//   } catch (err) {
//     next(err);
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie('jwt', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   });
//   res.status(200).json({ message: 'Logged out successfully' });
// };

// import AuthService from '../services/AuthService.js';

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const { user, token } = await AuthService.login(email, password);
    
//     res.cookie(
//       process.env.JWT_COOKIE_NAME, 
//       token, 
//       process.env.JWT_COOKIE_OPTIONS
//     ).json({
//       status: 'success',
//       user
//     });
    
//   } catch (err) {
//     next(err);
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie(process.env.JWT_COOKIE_NAME).json({
//     status: 'success',
//     message: 'Logged out successfully'
//   });
// };

// import AuthService from '../services/AuthService.js';

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const { user, token } = await AuthService.loginUser(email, password);

//     res.cookie('jwt', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 3600000 // 1 hour
//     });

//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie('jwt');
//   res.json({ message: 'Logged out successfully' });
// };
import AuthService from '../services/AuthService.js';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants.js';
// import { DatabaseError } from '../middleware/errorHandler.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Authenticate user (replace with your actual authentication logic)
  const user = await AuthService.authenticateUser(email, password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.user_id, role: user.role, email: user.email },
    JWT_CONFIG.SECRET,
    { expiresIn: JWT_CONFIG.EXPIRES_IN }
  );

  // Set token in HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000 // 1 hour
  });

  res.json({
    user_id: user.user_id,
    role: user.role,
    email: user.email,
    message: 'Login successful'
  });
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out successfully' });
};
// import AuthService from '../services/AuthService.js';
// import { DatabaseError, ValidationError } from '../middleware/errorHandler.js';

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       throw new ValidationError('Email and password are required');
//     }

//     const { user_id, role, token } = await AuthService.login(email, password);

//     res.cookie('jwt', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 3600000 // 1 hour
//     });

//     res.json({
//       user_id,
//       role,
//       message: 'Login successful'
//     });

//   } catch (err) {
//     next(new DatabaseError(err.message));
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie('jwt');
//   res.json({ message: 'Logout successful' });
// };

// export const getCurrentUser = async (req, res) => {
//   res.json({
//     user_id: req.user.id,
//     role: req.user.role,
//     email: req.user.email
//   });
// };