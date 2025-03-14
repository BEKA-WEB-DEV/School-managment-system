import pool from '../config/db.js';

export default class Payment {
  static async create(paymentData) {
    const [result] = await pool.execute(
      `INSERT INTO payments SET ?`,
      [paymentData]
    );
    return this.findById(paymentData.payment_id);
  }

  static async findById(payment_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM payments WHERE payment_id = ?',
      [payment_id]
    );
    return rows[0];
  }

  static async updateStatus(payment_id, newStatus) {
    await pool.execute(
      `UPDATE payments SET status = ?
       WHERE payment_id = ?`,
      [newStatus, payment_id]
    );
  }

  static async getPaymentsByParent(parent_id) {
    const [rows] = await pool.execute(
      `SELECT * FROM payments
       WHERE parent_id = ?`,
      [parent_id]
    );
    return rows;
  }
}