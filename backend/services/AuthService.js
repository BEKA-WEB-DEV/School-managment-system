// import User from '../models/User.js';
// import { generateToken } from '../config/jwt.js';

// export default class AuthService {
//   static async login(email, password) {
//     const isValid = await User.verifyPassword(email, password);
//     if (!isValid) throw new Error('Invalid credentials');

//     const user = await User.findByEmail(email);
//     if (!user) throw new Error('User not found');

//     await User.updateLastLogin(user.user_id);

//     return {
//       token: generateToken({
//         id: user.user_id,
//         role: user.role,
//         email: user.email
//       }),
//       user: {
//         user_id: user.user_id,
//         role: user.role,
//         email: user.email
//       }
//     };
//   }
// }

// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';
// import { generateToken } from '../config/jwt.js';
// import { InvalidCredentialsError } from '../middleware/errorHandler.js';

// export default class AuthService {
//   static async login(email, password) {
//     const user = await User.findByEmail(email);
    
//     if (!user || !(await bcrypt.compare(password, user.password_hash))) {
//       throw new InvalidCredentialsError();
//     }

//     const token = generateToken({
//       id: user.user_id,
//       role: user.role,
//       email: user.email
//     });

//     return {
//       user: {
//         id: user.user_id,
//         role: user.role,
//         email: user.email
//       },
//       token
//     };
//   }
// }

// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';
// import { generateToken } from '../config/jwt.js';
// import { DatabaseError, ValidationError } from '../middleware/errorHandler.js';

// export default class AuthService {
//   static async loginUser(email, password) {
//     try {
//       const user = await User.findByEmail(email);
//       if (!user) throw new ValidationError('Invalid credentials');

//       const validPassword = await bcrypt.compare(password, user.password_hash);
//       if (!validPassword) throw new ValidationError('Invalid credentials');

//       const token = generateToken(user);
//       return { user: this.sanitizeUser(user), token };
//     } catch (err) {
//       throw new DatabaseError('Authentication failed', err);
//     }
//   }

//   static sanitizeUser(user) {
//     const { password_hash, ...sanitized } = user;
//     return sanitized;
//   }
// }
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { JWT_CONFIG } from '../config/constants.js';
import { DatabaseError } from '../middleware/errorHandler.js';

export default class AuthService {
  static generateToken(user) {
    return jwt.sign(
      { id: user.user_id, role: user.role },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET);
      const [user] = await pool.execute(
        'SELECT user_id, role, email FROM users WHERE user_id = ?',
        [decoded.id]
      );
      return user[0];
    } catch (err) {
      throw new DatabaseError('Token verification failed', err);
    }
  }

  static async authenticateUser(email, password) {
    try {
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if (!users.length) return null;
      const user = users[0];
      
      // Add bcrypt password comparison
      // const validPassword = await bcrypt.compare(password, user.password_hash);
      // if (!validPassword) return null;

      return user;
    } catch (err) {
      throw new DatabaseError('Authentication failed', err);
    }
  }
}
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import pool from '../config/db.js';
// import { JWT_CONFIG } from '../config/constants.js';

// export default class AuthService {
//   static async login(email, password) {
//     try {
//       const [users] = await pool.execute(
//         'SELECT user_id, email, password_hash, role FROM users WHERE email = ?',
//         [email]
//       );

//       if (users.length === 0) {
//         throw new Error('Invalid credentials');
//       }

//       const user = users[0];
//       const passwordMatch = await bcrypt.compare(password, user.password_hash);

//       if (!passwordMatch) {
//         throw new Error('Invalid credentials');
//       }

//       const token = jwt.sign(
//         { id: user.user_id, role: user.role, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: JWT_CONFIG.EXPIRES_IN }
//       );

//       return {
//         user_id: user.user_id,
//         role: user.role,
//         token
//       };
//     } catch (err) {
//       throw new Error('Login failed: ' + err.message);
//     }
//   }

//   static async verifyToken(token) {
//     try {
//       return jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       throw new Error('Invalid or expired token');
//     }
//   }
// }