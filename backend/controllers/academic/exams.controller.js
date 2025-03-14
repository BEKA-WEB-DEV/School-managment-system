import pool from '../../config/db.js';
import { EXAM_TYPES } from '../../config/constants.js';
import { DatabaseError, ValidationError, ForbiddenError } from '../../middleware/errorHandler.js';

export const scheduleExam = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { class_id, exam_type, exam_date, max_score } = req.body;
    
    await connection.beginTransaction();

    // Validate exam type
    if (!Object.values(EXAM_TYPES).includes(exam_type)) {
      throw new ValidationError('Invalid exam type');
    }

    // Verify class exists
    const [classExists] = await connection.execute(
      'SELECT class_id FROM classes WHERE class_id = ?',
      [class_id]
    );
    if (!classExists.length) {
      throw new ValidationError('Class not found');
    }

    // Generate exam ID: EXAM_{type}_{timestamp}_{classid}
    const exam_id = `EXAM_${exam_type}_${Date.now()}_${class_id}`;

    await connection.execute(
      `INSERT INTO exams (exam_id, class_id, exam_type, exam_date, max_score, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [exam_id, class_id, exam_type, exam_date, max_score, req.user.id]
    );

    await connection.commit();
    
    res.status(201).json({
      exam_id,
      class_id,
      exam_type,
      exam_date,
      max_score
    });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Failed to schedule exam', err));
  } finally {
    connection.release();
  }
};

export const publishExamResults = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {

    // Insert results in batches of 100
    const batchSize = 100;
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      await connection.query(
    `INSERT INTO exam_results (...) VALUES ${batch.map(() => '(?,?,?,?)').join(',')}`,
    batch.flatMap(r => [exam_id, r.student_id, r.score, r.remarks])
      );
    }

    const { exam_id, results } = req.body;
    
    await connection.beginTransaction();

    // Get exam details
    const [exam] = await connection.execute(
      `SELECT class_id FROM exams WHERE exam_id = ?`,
      [exam_id]
    );
    if (!exam.length) {
      throw new ValidationError('Exam not found');
    }
    const class_id = exam[0].class_id;

    // Validate all students are enrolled
    const studentIds = results.map(r => r.student_id);
    const [enrollments] = await connection.execute(
      `SELECT student_id FROM enrollments 
       WHERE class_id = ? AND student_id IN (?)`,
      [class_id, studentIds]
    );
    
    if (enrollments.length !== studentIds.length) {
      const invalidStudents = studentIds.filter(id => 
        !enrollments.some(e => e.student_id === id)
      );
      throw new ValidationError(`Invalid students: ${invalidStudents.join(', ')}`);
    }

    // Insert/update results
    for (const result of results) {
      await connection.execute(
        `INSERT INTO exam_results (exam_id, student_id, score, remarks)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           score = VALUES(score),
           remarks = VALUES(remarks)`,
        [exam_id, result.student_id, result.score, result.remarks || null]
      );
    }

    await connection.commit();
    res.json({ 
      message: `${results.length} results published successfully`,
      exam_id,
      class_id
    });

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

    // Get basic exam info
    const [exam] = await pool.execute(
      `SELECT e.*, c.class_name, s.subject_name 
       FROM exams e
       JOIN classes c ON e.class_id = c.class_id
       JOIN subjects s ON c.subject_id = s.subject_id
       WHERE e.exam_id = ?`,
      [exam_id]
    );
    
    if (!exam.length) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Get results with student names
    const [results] = await pool.execute(
      `SELECT er.*, s.first_name, s.last_name 
       FROM exam_results er
       JOIN students s ON er.student_id = s.student_id
       WHERE er.exam_id = ?`,
      [exam_id]
    );

    // Calculate statistics
    const total = results.reduce((sum, res) => sum + res.score, 0);
    const average = results.length ? total / results.length : 0;

    res.json({
      ...exam[0],
      results,
      average_score: average.toFixed(2),
      total_students: results.length
    });

  } catch (err) {
    next(new DatabaseError('Failed to fetch exam details', err));
  }
};

export const submitExamResult = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { exam_id, student_id, score } = req.body;
    
    await connection.beginTransaction();

    // Verify teacher access
    const [classInfo] = await connection.execute(
      `SELECT c.teacher_id 
       FROM exams e
       JOIN classes c ON e.class_id = c.class_id
       WHERE e.exam_id = ?`,
      [exam_id]
    );
    
    if (!classInfo.length || classInfo[0].teacher_id !== req.user.teacher_id) {
      throw new ForbiddenError('Not authorized for this exam');
    }

    // Validate student enrollment
    const [enrollment] = await connection.execute(
      `SELECT student_id FROM enrollments 
       WHERE class_id = ? AND student_id = ?`,
      [classInfo[0].class_id, student_id]
    );
    
    if (!enrollment.length) {
      throw new ValidationError('Student not enrolled in this class');
    }

    // Update score
    await connection.execute(
      `INSERT INTO exam_results (exam_id, student_id, score)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE score = VALUES(score)`,
      [exam_id, student_id, score]
    );

    await connection.commit();
    res.json({ 
      message: 'Score submitted successfully',
      exam_id,
      student_id,
      score
    });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Failed to submit result', err));
  } finally {
    connection.release();
  }
};