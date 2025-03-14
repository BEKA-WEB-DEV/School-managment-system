import pool from '../config/db.js';

export default class ExamResult {
  static async recordScore(exam_id, student_id, score) {
    await pool.execute(
      `INSERT INTO exam_results (exam_id, student_id, score)
       VALUES (?, ?, ?)`,
      [exam_id, student_id, score]
    );
  }

  static async updateScore(result_id, newScore) {
    await pool.execute(
      `UPDATE exam_results SET score = ?
       WHERE result_id = ?`,
      [newScore, result_id]
    );
  }

  static async getResultsByExam(exam_id) {
    const [rows] = await pool.execute(
      `SELECT * FROM exam_results
       WHERE exam_id = ?`,
      [exam_id]
    );
    return rows;
  }
}