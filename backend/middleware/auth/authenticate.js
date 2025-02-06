import { verifyToken } from '../utils/jwtUtils.js';
import pool from '../../config/db.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = verifyToken(token);
    
    // Verify user exists in the database
    const [user] = await pool.query(
      `SELECT * FROM ${decoded.type}s WHERE ${decoded.type}_id = ?`,
      [decoded.id]
    );
    if (!user[0]) throw new Error('User not found');

    req.user = { id: decoded.id, type: decoded.type };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};