import pool from '../config/db.js';

export default class Exam {
  // Schedule new exam
  static async create(examData) {
    const [result] = await pool.query('INSERT INTO exams SET ?', {
      exam_id: examData.exam_id,
      exam_datetime: examData.exam_datetime,
      duration: examData.duration,
      grade_level_id: examData.grade_level_id,
      section_id: examData.section_id,
      employee_id: examData.employee_id,
      school_year_id: 1 // Default
    });
    return result.insertId;
  }

  // Get exams by grade level
  static async findByGradeLevel(grade_level_id) {
    const [rows] = await pool.query(
      'SELECT * FROM exams WHERE grade_level_id = ?',
      [grade_level_id]
    );
    return rows;
  }
}