import pool from '../config/db.js';

// Auto-commit/rollback transactions for routes
export const withTransaction = (handler) => {
  return async (req, res, next) => {
    const conn = await pool.getConnection();
    req.db = conn; // Attach connection to request
    try {
      await conn.beginTransaction();
      await handler(req, res, next);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      next(error);
    } finally {
      conn.release();
    }
  };
};