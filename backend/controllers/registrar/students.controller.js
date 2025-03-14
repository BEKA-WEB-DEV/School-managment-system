import pool from '../../config/db.js';
import { DatabaseError, ValidationError } from '../../middleware/errorHandler.js';
import { STUDENT_STATUS } from '../../config/constants.js';

export const registerStudent = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { user_id, parent_id, ...studentData } = req.body;

    // Debug: Log the received request body
    console.log('Received request body:', req.body);

    if (!user_id || !parent_id) {
      throw new ValidationError('Missing required fields: user_id and parent_id');
    }

    await connection.beginTransaction();

    // Verify user exists and has student role
    const [user] = await connection.execute(
      `SELECT role FROM users 
       WHERE user_id = ? AND role = 'student'`,
      [user_id]
    );
    
    // Verify parent exists
    const [parent] = await connection.execute(
      'SELECT parent_id FROM parents WHERE parent_id = ?',
      [parent_id]
    );

    if (!user.length) {
      throw new ValidationError('User not found or invalid role');
    }
    if (!parent.length) {
      throw new ValidationError('Parent not found');
    }

    // Generate student ID
    const student_id = `STU-${Date.now()}`;

    // Insert student
    const [result] = await connection.execute(
      `INSERT INTO students (
        student_id, user_id, parent_id, 
        first_name, last_name, gender, 
        date_of_birth, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        user_id,
        parent_id,
        studentData.first_name,
        studentData.last_name,
        studentData.gender,
        studentData.date_of_birth,
        studentData.address
      ]
    );

    await connection.commit();

    res.status(201).json({
      student_id,
      user_id,
      parent_id,
      ...studentData,
      status: 'active'
    });

  } catch (err) {
    await connection.rollback();
    console.error('Registration error:', err.message, err.stack);
    next(new DatabaseError('Student registration failed: ' + err.message, err));
  } finally {
    connection.release();
  }
};

export const listStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT s.*, u.email, p.phone AS parent_phone 
                FROM students s
                JOIN users u ON s.user_id = u.user_id
                JOIN parents p ON s.parent_id = p.parent_id`;
    
    const params = [];
    
    if (status) {
      query += ' WHERE s.status = ?';
      params.push(status);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [students] = await pool.execute(query, params);

    // Get total count for pagination
    const countQuery = status ? 
      'SELECT COUNT(*) AS total FROM students WHERE status = ?' : 
      'SELECT COUNT(*) AS total FROM students';
    
    const [total] = await pool.execute(countQuery, status ? [status] : []);

    res.json({
      data: students,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total[0].total
      }
    });

  } catch (err) {
    next(new DatabaseError('Failed to fetch students', err));
  }
};

export const getStudentDetails = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const [student] = await pool.execute(
      `SELECT s.*, u.email, 
       CONCAT(p.father_first_name, ' ', p.father_last_name) AS father_name,
       CONCAT(p.mother_first_name, ' ', p.mother_last_name) AS mother_name
       FROM students s
       JOIN users u ON s.user_id = u.user_id
       JOIN parents p ON s.parent_id = p.parent_id
       WHERE s.student_id = ?`,
      [studentId]
    );

    if (student.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student[0]);
  } catch (err) {
    next(new DatabaseError('Failed to fetch student details', err));
  }
};

export const updateStudentRecord = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { studentId } = req.params;
    const updates = req.body;

    await connection.beginTransaction();

    // Validate allowed fields
    const allowedFields = ['first_name', 'last_name', 'gender', 'date_of_birth', 'address', 'status'];
    const invalidFields = Object.keys(updates).filter(f => !allowedFields.includes(f));

    if (invalidFields.length > 0) {
      throw new ValidationError(`Invalid fields: ${invalidFields.join(', ')}`);
    }

    // Validate status value
    if (updates.status && !Object.values(STUDENT_STATUS).includes(updates.status)) {
      throw new ValidationError('Invalid student status');
    }

    const [result] = await connection.execute(
      'UPDATE students SET ? WHERE student_id = ?',
      [updates, studentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await connection.commit();
    
    // Return updated student
    const [updatedStudent] = await pool.execute(
      'SELECT * FROM students WHERE student_id = ?',
      [studentId]
    );

    res.json(updatedStudent[0]);

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Failed to update student', err));
  } finally {
    connection.release();
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Soft delete (update status to inactive)
    const [result] = await pool.execute(
      'UPDATE students SET status = "inactive" WHERE student_id = ?',
      [studentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(204).end();
  } catch (err) {
    next(new DatabaseError('Failed to delete student', err));
  }
};