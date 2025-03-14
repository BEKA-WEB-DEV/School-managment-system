import pool from '../config/db.js';

export const checkSystemInstalled = async () => {
  try {
    // Check if users table exists
    const [result] = await pool.query(`
      SELECT COUNT(*) AS table_count
      FROM information_schema.tables
      WHERE table_schema = DATABASE() 
      AND table_name = 'users'
    `);
    
    return result[0].table_count > 0;
  } catch (error) {
    console.error('Installation check failed:', error);
    return false;
  }
};