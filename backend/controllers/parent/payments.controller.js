import pool from '../../config/db.js';
import { DatabaseError, ValidationError, ForbiddenError } from '../../middleware/errorHandler.js';
import { PAYMENT_PURPOSES, PAYMENT_STATUS } from '../../config/constants.js';
import { generateReceiptPDF } from '../../utils/pdfGenerator.js';

export const createPayment = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { student_id, amount, purpose } = req.body;
    const parent_id = req.user.parent_id;

    await connection.beginTransaction();

    // Validate parent-student relationship
    const [student] = await connection.execute(
      `SELECT student_id FROM students 
       WHERE student_id = ? AND parent_id = ?`,
      [student_id, parent_id]
    );

    if (!student.length) {
      throw new ForbiddenError('Student not associated with parent');
    }

    // Validate payment details
    if (!Object.values(PAYMENT_PURPOSES).includes(purpose)) {
      throw new ValidationError('Invalid payment purpose');
    }

    if (amount <= 0) {
      throw new ValidationError('Amount must be positive');
    }

    // Generate payment ID and receipt
    const payment_id = `PAY_${Date.now()}`;
    const receipt_url = await generateReceiptPDF({
      payment_id,
      parent_id,
      student_id,
      amount,
      purpose
    });

    await connection.execute(
      `INSERT INTO payments 
       (payment_id, parent_id, student_id, amount, purpose, status, receipt_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [payment_id, parent_id, student_id, amount, purpose, 'pending', receipt_url]
    );

    await connection.commit();

    res.status(201).json({
      payment_id,
      amount,
      purpose,
      status: 'pending',
      receipt_url
    });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Payment processing failed', err));
  } finally {
    connection.release();
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const { parent_id } = req.user;
    const { student_id, status, startDate, endDate, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT p.*, s.first_name, s.last_name 
                FROM payments p
                JOIN students s ON p.student_id = s.student_id
                WHERE p.parent_id = ?`;
    
    const params = [parent_id];

    if (student_id) {
      query += ' AND p.student_id = ?';
      params.push(student_id);
    }

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    if (startDate && endDate) {
      query += ' AND p.payment_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY p.payment_date DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [payments] = await pool.execute(query, params);

    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) AS total FROM')
                            .replace(/ORDER BY.*/, '');
    const [total] = await pool.execute(countQuery, params.slice(0, -2));

    res.json({
      data: payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total[0].total
      }
    });

  } catch (err) {
    next(new DatabaseError('Failed to retrieve payment history', err));
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { payment_id } = req.params;
    const { status } = req.body;

    await connection.beginTransaction();

    // Validate status transition
    const [current] = await connection.execute(
      'SELECT status FROM payments WHERE payment_id = ?',
      [payment_id]
    );

    if (!current.length) {
      throw new ValidationError('Payment not found');
    }

    const validTransitions = {
      pending: ['completed', 'failed'],
      completed: ['refunded'],
      failed: ['pending'],
      refunded: []
    };

    if (!validTransitions[current[0].status].includes(status)) {
      throw new ValidationError(`Invalid status transition from ${current[0].status}`);
    }

    await connection.execute(
      'UPDATE payments SET status = ? WHERE payment_id = ?',
      [status, payment_id]
    );

    await connection.commit();
    res.json({ payment_id, status });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Payment status update failed', err));
  } finally {
    connection.release();
  }
};

export const getPaymentDetails = async (req, res, next) => {
  try {
    const { payment_id } = req.params;
    const user = req.user;

    let query = `SELECT p.*, s.first_name AS student_name, 
                CONCAT(pr.father_first_name, ' ', pr.father_last_name) AS parent_name
                FROM payments p
                JOIN students s ON p.student_id = s.student_id
                JOIN parents pr ON p.parent_id = pr.parent_id
                WHERE p.payment_id = ?`;

    const params = [payment_id];

    // Restrict access for parents
    if (user.role === 'parent') {
      query += ' AND p.parent_id = ?';
      params.push(user.parent_id);
    }

    const [payment] = await pool.execute(query, params);

    if (!payment.length) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment[0]);

  } catch (err) {
    next(new DatabaseError('Failed to fetch payment details', err));
  }
};