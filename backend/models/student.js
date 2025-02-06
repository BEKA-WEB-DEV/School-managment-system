import pool from '../config/db.js';

export default class Student {
  // Get student by ID with full details
  static async findById(student_id) {
    const [rows] = await pool.query(`
      SELECT s.*, si.* 
      FROM students s
      JOIN students_info si ON s.student_id = si.student_id
      WHERE s.student_id = ?
    `, [student_id]);
    return rows[0];
  }

  // Create new student (with transaction)
  static async create(studentData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into students_info
      await connection.query(
        'INSERT INTO students_info SET ?', 
        studentData.details
      );

      // Insert into students
      await connection.query('INSERT INTO students SET ?', {
        student_id: studentData.student_id,
        student_password: studentData.hashedPassword,
        grade_level_id: await this._resolveGradeLevelId(studentData.grade_level),
        section_id: await this._resolveSectionId(studentData.section),
        school_year_id: 1, // Default
        student_status: 'Active'
      });

      await connection.commit();
      return studentData.student_id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Helper: Convert grade level name to ID
  static async _resolveGradeLevelId(gradeLevel) {
    const [rows] = await pool.query(
      'SELECT grade_level_id FROM grade_level WHERE grade_level = ?',
      [gradeLevel]
    );
    return rows[0]?.grade_level_id;
  }
}