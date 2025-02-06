import pool from '../config/db.js';
import { generatePaymentId } from '../utils/idGenerator.js';

export const createPayment = async (req, res) => {
  const { student_id, amount, payment_purpose } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Validate student existence
    const [student] = await connection.query(
      'SELECT student_id FROM students WHERE student_id = ?',
      [student_id]
    );
    if (!student.length) throw new Error('Student not found');

    // Create payment
    const payment_id = generatePaymentId();
    await connection.query('INSERT INTO payments SET ?', {
      payment_id,
      student_id,
      amount,
      payment_purpose,
      date: new Date().toISOString()
    });

    await connection.commit();
    res.status(201).json({ payment_id });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: 'Payment creation failed' });
  } finally {
    connection.release();
  }
};