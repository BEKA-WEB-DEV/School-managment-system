import pool from '../../config/db.js';
import { 
  DatabaseError, 
  ValidationError,
  // ForbiddenError 
} from '../../middleware/errorHandler.js';
import { formatAcademicYear, getCurrentTerm } from '../../utils/dateUtils.js';

const currentAcademicYear = formatAcademicYear(new Date());
const term = getCurrentTerm();

export const createClass = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { class_name, teacher_id, subject_id, schedule } = req.body;
    // Use the pre-formatted academic year
    const academic_year = currentAcademicYear;

    await connection.beginTransaction();

    // Validate required fields
    if (!class_name || !teacher_id || !subject_id || !schedule) {
      throw new ValidationError('Missing required fields');
    }

    // Check teacher and subject existence
    const [teacher] = await connection.execute(
      'SELECT teacher_id FROM teachers WHERE teacher_id = ?',
      [teacher_id]
    );
    
    const [subject] = await connection.execute(
      'SELECT subject_id FROM subjects WHERE subject_id = ?',
      [subject_id]
    );

    if (!teacher.length || !subject.length) {
      throw new ValidationError('Invalid teacher or subject ID');
    }

    // Generate class ID: CLS_{academic_year}_{timestamp}
    const class_id = `CLS_${academic_year}_${Date.now()}`;

    await connection.execute(
      `INSERT INTO classes 
       (class_id, class_name, teacher_id, subject_id, schedule, academic_year)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [class_id, class_name, teacher_id, subject_id, schedule, academic_year]
    );

    await connection.commit();

    res.status(201).json({
      class_id,
      class_name,
      teacher_id,
      schedule
    });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Class creation failed', err));
  } finally {
    connection.release();
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const { class_id } = req.params;
    const updates = req.body;

    // Validate allowed fields
    const allowedFields = ['class_name', 'schedule', 'academic_year'];
    const invalidFields = Object.keys(updates).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new ValidationError(`Invalid fields: ${invalidFields.join(', ')}`);
    }

    const [result] = await pool.execute(
      'UPDATE classes SET ? WHERE class_id = ?',
      [updates, class_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({ message: 'Class updated successfully' });

  } catch (err) {
    next(new DatabaseError('Failed to update class', err));
  }
};

export const assignTeacher = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { class_id } = req.params;
    const { teacher_id } = req.body;

    await connection.beginTransaction();

    // Verify teacher exists
    const [teacher] = await connection.execute(
      'SELECT teacher_id FROM teachers WHERE teacher_id = ?',
      [teacher_id]
    );

    if (!teacher.length) {
      throw new ValidationError('Teacher not found');
    }

    // Update class teacher
    const [result] = await connection.execute(
      'UPDATE classes SET teacher_id = ? WHERE class_id = ?',
      [teacher_id, class_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    await connection.commit();
    res.json({ message: 'Teacher assigned successfully' });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Failed to assign teacher', err));
  } finally {
    connection.release();
  }
};

export const getClassDetails = async (req, res, next) => {
  try {
    const { class_id } = req.params;

    const [classInfo] = await pool.execute(
      `SELECT c.*, t.first_name AS teacher_name, s.subject_name 
       FROM classes c
       JOIN teachers t ON c.teacher_id = t.teacher_id
       JOIN subjects s ON c.subject_id = s.subject_id
       WHERE c.class_id = ?`,
      [class_id]
    );

    if (!classInfo.length) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const [students] = await pool.execute(
      `SELECT s.student_id, s.first_name, s.last_name 
       FROM enrollments e
       JOIN students s ON e.student_id = s.student_id
       WHERE e.class_id = ?`,
      [class_id]
    );

    res.json({
      ...classInfo[0],
      students
    });

  } catch (err) {
    next(new DatabaseError('Failed to fetch class details', err));
  }
};

// Middleware to prevent reassigning teacher with existing exams
export const preventTeacherReassignment = async (req, res, next) => {
  const { teacher_id } = req.body;
  const { class_id } = req.params;
  
  const [existingExams] = await pool.execute(
    'SELECT exam_id FROM exams WHERE class_id = ?',
    [class_id]
  );
  
  if (existingExams.length > 0) {
    return res.status(400).json({
      error: 'Cannot reassign teacher with existing exams'
    });
  }
  
  next();
};
