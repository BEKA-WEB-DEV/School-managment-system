import pool from '../config/db.js';

export default class Exam {
  static async create(examData) {
    const [result] = await pool.execute(
      `INSERT INTO exams SET ?`,
      [examData]
    );
    return this.findById(examData.exam_id);
  }

  static async findById(exam_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM exams WHERE exam_id = ?',
      [exam_id]
    );
    return rows[0];
  }

  static async getResults(exam_id) {
    const [rows] = await pool.execute(
      `SELECT er.*, s.first_name, s.last_name
       FROM exam_results er
       JOIN students s ON er.student_id = s.student_id
       WHERE er.exam_id = ?`,
      [exam_id]
    );
    return rows;
  }
}