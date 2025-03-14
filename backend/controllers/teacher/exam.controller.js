import pool from '../../config/db.js';
import { EXAM_TYPES } from '../../config/constants.js';
import { DatabaseError, ValidationError } from '../../middleware/errorHandler.js';

export const scheduleExam = async (req, res, next) => {
  try {
    const { class_id, exam_type, exam_date, max_score } = req.body;
    const academic_year = new Date().getFullYear();

    // Validate exam type
    if (!Object.values(EXAM_TYPES).includes(exam_type)) {
      throw new ValidationError('Invalid exam type');
    }

    // Check class existence
    const [classExists] = await pool.execute(
      'SELECT class_id FROM classes WHERE class_id = ?',
      [class_id]
    );
    
    if (classExists.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Generate exam ID: EXAM_{type}_{class}_{timestamp}
    const exam_id = `EXAM_${exam_type}_${class_id}_${Date.now()}`;

    await pool.execute(
      `INSERT INTO exams (exam_id, class_id, exam_type, exam_date, max_score, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [exam_id, class_id, exam_type, exam_date, max_score, req.user.id]
    );

    res.status(201).json({
      exam_id,
      message: 'Exam scheduled successfully'
    });

  } catch (err) {
    next(new DatabaseError('Failed to schedule exam', err));
  }
};

export const publishExamResults = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { exam_id, results } = req.body;

    await connection.beginTransaction();

    // Validate all results first
    for (const result of results) {
      const [studentExists] = await connection.execute(
        'SELECT student_id FROM enrollments WHERE student_id = ? AND class_id = ?',
        [result.student_id, exam_id.split('_')[2]] // Extract class_id from exam_id
      );
      
      if (studentExists.length === 0) {
        throw new ValidationError(`Student ${result.student_id} not enrolled in this class`);
      }
    }

    // Insert results
    for (const result of results) {
      await connection.execute(
        `INSERT INTO exam_results (exam_id, student_id, score, remarks)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE score = VALUES(score), remarks = VALUES(remarks)`,
        [exam_id, result.student_id, result.score, result.remarks || null]
      );
    }

    await connection.commit();
    res.json({ message: `${results.length} results published successfully` });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Failed to publish results', err));
  } finally {
    connection.release();
  }
};

export const getExamDetails = async (req, res, next) => {
  try {
    const { exam_id } = req.params;

    const [exam] = await pool.execute(
      `SELECT e.*, c.class_name, s.subject_name 
       FROM exams e
       JOIN classes c ON e.class_id = c.class_id
       JOIN subjects s ON c.subject_id = s.subject_id
       WHERE exam_id = ?`,
      [exam_id]
    );

    if (exam.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const [results] = await pool.execute(
      `SELECT er.*, s.first_name, s.last_name 
       FROM exam_results er
       JOIN students s ON er.student_id = s.student_id
       WHERE exam_id = ?`,
      [exam_id]
    );

    res.json({
      ...exam[0],
      results,
      average_score: results.reduce((acc, curr) => acc + curr.score, 0) / results.length
    });

  } catch (err) {
    next(new DatabaseError('Failed to fetch exam details', err));
  }
};

export const submitExamResults = async (req, res, next) => {
  try {
    const { exam_id, student_id, score } = req.body;

    // Verify teacher has access to this exam's class
    const [classInfo] = await pool.execute(
      `SELECT c.teacher_id 
       FROM exams e
       JOIN classes c ON e.class_id = c.class_id
       WHERE exam_id = ?`,
      [exam_id]
    );

    if (classInfo[0].teacher_id !== req.user.teacher_id) {
      return res.status(403).json({ error: 'Not authorized for this class' });
    }

    await pool.execute(
      `INSERT INTO exam_results (exam_id, student_id, score)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE score = VALUES(score)`,
      [exam_id, student_id, score]
    );

    res.json({ message: 'Score submitted successfully' });

  } catch (err) {
    next(new DatabaseError('Failed to submit exam result', err));
  }
};

export const updateExamResult = async (req, res, next) => {
  try {
    const { exam_id, student_id, score } = req.body;

    // Verify teacher has access to this exam's class
    const [classInfo] = await pool.execute(
      `SELECT c.teacher_id 
       FROM exams e
       JOIN classes c ON e.class_id = c.class_id
       WHERE exam_id = ?`,
      [exam_id]
    );    

    if (classInfo[0].teacher_id !== req.user.teacher_id) {
      return res.status(403).json({ error: 'Not authorized for this class' });
    }

    await pool.execute(
      `UPDATE exam_results
       SET score = ?
       WHERE exam_id = ? AND student_id = ?`,
      [score, exam_id, student_id]
    );

    res.json({ message: 'Score updated successfully' });

  } catch (err) {
    next(new DatabaseError('Failed to update exam result', err));
  }
};
    