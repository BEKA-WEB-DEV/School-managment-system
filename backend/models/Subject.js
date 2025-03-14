import pool from '../config/db.js';

export default class Subject {
  static async create(subjectData) {
    const [result] = await pool.execute(
      `INSERT INTO subjects SET ?`,
      [subjectData]
    );
    return this.findById(subjectData.subject_id);
  }

  static async findById(subject_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM subjects WHERE subject_id = ?',
      [subject_id]
    );
    return rows[0];
  }
}