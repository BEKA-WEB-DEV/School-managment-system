import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Verify JWT and attach user to request
export const authenticate = (roles = []) => {
  return async (req, res, next) => {
    // 1. Extract token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Fetch fresh user data from DB
      const [user] = await pool.query(
        `SELECT * FROM ${decoded.type}s 
        WHERE ${decoded.type === 'admin' ? 'username' : `${decoded.type}_id`} = ?`,
        [decoded.id]
      );
      
      if (!user[0]) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 4. Role-based access control
      if (roles.length && !roles.includes(decoded.type)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // 5. Attach user to request
      req.user = { ...decoded, dbData: user[0] };
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};