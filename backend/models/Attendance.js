import pool from '../config/db.js';

export default class Attendance {
  static async recordAttendance(record) {
    const [result] = await pool.execute(
      `INSERT INTO attendance SET ?`,
      [record]
    );
    return this.findById(result.insertId);
  }

  static async findById(attendance_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM attendance WHERE attendance_id = ?',
      [attendance_id]
    );
    return rows[0];
  }

  static async updateAttendance(attendance_id, newStatus) {
    await pool.execute(
      `UPDATE attendance SET status = ?
       WHERE attendance_id = ?`,
      [newStatus, attendance_id]
    );
  }

  static async getAttendanceByClass(class_id) {
    const [rows] = await pool.execute(
      `SELECT * FROM attendance
       WHERE class_id = ?`,
      [class_id]
    );
    return rows;
  }
}