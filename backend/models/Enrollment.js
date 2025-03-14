import pool from '../config/db.js';
export default class Enrollment {
  static async enrollStudent(class_id, student_id) {
    await pool.execute(
      `INSERT INTO enrollments (class_id, student_id)
       VALUES (?, ?)`,
      [class_id, student_id]
    );
  }

  static async updateEnrollmentStatus(enrollment_id, status) {
    await pool.execute(
      `UPDATE enrollments SET status = ?
       WHERE enrollment_id = ?`,
      [status, enrollment_id]
    );
  }

  static async getEnrollmentsByClass(class_id) {
    const [rows] = await pool.execute(
      `SELECT * FROM enrollments
       WHERE class_id = ?`,
      [class_id]
    );
    return rows;
  }
}