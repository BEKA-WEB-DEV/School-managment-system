import pool from '../config/db.js';

export default class Payment {
  // Create payment record
  static async create(paymentData) {
    const [result] = await pool.query('INSERT INTO payments SET ?', {
      payment_id: paymentData.payment_id,
      student_id: paymentData.student_id,
      amount: paymentData.amount,
      payment_purpose: paymentData.purpose,
      date: new Date()
    });
    return result.insertId;
  }

  // Get payments by student
  static async findByStudent(student_id) {
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE student_id = ?',
      [student_id]
    );
    return rows;
  }
}