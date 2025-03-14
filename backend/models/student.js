import pool from '../config/db.js';

export default class Student {
  static async create(studentData) {
    const [result] = await pool.execute(
      `INSERT INTO students SET ?`,
      [studentData]
    );
    return this.findById(studentData.student_id);
  }

  static async findById(student_id) {
    const [rows] = await pool.execute(
      `SELECT * FROM students WHERE student_id = ?`,
      [student_id]
    );
    return rows[0];
  }

  static async update(student_id, updates) {
    const [result] = await pool.execute(
      `UPDATE students SET ? WHERE student_id = ?`,
      [updates, student_id]
    );
    return this.findById(student_id);
  }

  static async delete(student_id) {
    await pool.execute(
      'DELETE FROM students WHERE student_id = ?',
      [student_id]
    );
  }
}