import pool from '../config/db.js';

export default class Class {
  static async create(classData) {
    const [result] = await pool.execute(
      `INSERT INTO classes SET ?`,
      [classData]
    );
    return this.findById(classData.class_id);
  }

  static async findById(class_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM classes WHERE class_id = ?',
      [class_id]
    );
    return rows[0];
  }

  static async addStudentToClass(class_id, student_id) {
    await pool.execute(
      `INSERT INTO enrollments (class_id, student_id) 
       VALUES (?, ?)`,
      [class_id, student_id]
    );
  }

  static async getStudents(class_id) {
    const [rows] = await pool.execute(
      `SELECT s.* FROM enrollments e
       JOIN students s ON e.student_id = s.student_id
       WHERE e.class_id = ?`,
      [class_id]
    );
    return rows;
  }
}