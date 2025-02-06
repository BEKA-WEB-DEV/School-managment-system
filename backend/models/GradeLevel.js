import pool from '../config/db.js';

export default class GradeLevel {
  // Get all active grade levels
  static async findAllActive() {
    const [rows] = await pool.query(
      'SELECT * FROM grade_level WHERE grade_level_status = "Active"'
    );
    return rows;
  }

  // Convert grade name to ID
  static async resolveId(gradeLevel) {
    const [rows] = await pool.query(
      'SELECT grade_level_id FROM grade_level WHERE grade_level = ?',
      [gradeLevel]
    );
    return rows[0]?.grade_level_id;
  }
}