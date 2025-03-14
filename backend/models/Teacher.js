import pool from '../config/db.js';
export default class Teacher {
  static async create(teacherData) {
    const [result] = await pool.execute(
      `INSERT INTO teachers SET ?`,
      [teacherData]
    );
    return this.findById(teacherData.teacher_id);
  }

  static async findAll() {
    const [teachers] = await pool.execute(`
      SELECT t.*, u.email 
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
    `);
    return teachers;
  }

  static async findById(teacher_id) {
    const [teachers] = await pool.execute(
      'SELECT * FROM teachers WHERE teacher_id = ?',
      [teacher_id]
    );
    return teachers[0];
  }

  static async getClasses(teacher_id) {
    const [rows] = await pool.execute(
      `SELECT c.*, s.subject_name 
       FROM classes c
       JOIN subjects s ON c.subject_id = s.subject_id
       WHERE c.teacher_id = ?`,
      [teacher_id]
    );
    return rows;
  }
}