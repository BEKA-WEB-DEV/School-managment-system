import pool from '../../config/db.js';
import { DatabaseError, ValidationError, ForbiddenError } from '../../middleware/errorHandler.js';
import { validateDateRange } from '../../utils/dateUtils.js';

export const recordAttendance = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { class_id, date, records } = req.body;
    const teacher_id = req.user.teacher_id;

    await connection.beginTransaction();

    // Verify teacher is assigned to the class
    const [classInfo] = await connection.execute(
      'SELECT teacher_id FROM classes WHERE class_id = ?',
      [class_id]
    );
    
    if (!classInfo.length || classInfo[0].teacher_id !== teacher_id) {
      throw new ForbiddenError('Not authorized for this class');
    }

    // Validate all students are enrolled
    const studentIds = records.map(r => r.student_id);
    const [enrollments] = await connection.execute(
      `SELECT student_id FROM enrollments 
       WHERE class_id = ? AND student_id IN (?)`,
      [class_id, studentIds]
    );

    const invalidStudents = studentIds.filter(id => 
      !enrollments.some(e => e.student_id === id)
    );
    
    if (invalidStudents.length > 0) {
      throw new ValidationError(`Invalid students: ${invalidStudents.join(', ')}`);
    }

    // Insert attendance records
    const insertPromises = records.map(record => 
      connection.execute(
        `INSERT INTO attendance 
         (student_id, class_id, date, status, recorded_by)
         VALUES (?, ?, ?, ?, ?)`,
        [record.student_id, class_id, date, record.status, teacher_id]
      )
    );

    await Promise.all(insertPromises);
    await connection.commit();

    res.status(201).json({
      message: `${records.length} attendance records created`,
      class_id,
      date
    });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Attendance recording failed', err));
  } finally {
    connection.release();
  }
};

export const updateAttendance = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { attendance_id } = req.params;
    const { status } = req.body;
    const teacher_id = req.user.teacher_id;

    await connection.beginTransaction();

    // Verify ownership and valid status
    const [attendance] = await connection.execute(
      `SELECT class_id FROM attendance 
       WHERE attendance_id = ? AND recorded_by = ?`,
      [attendance_id, teacher_id]
    );

    if (!attendance.length) {
      throw new ForbiddenError('Attendance record not found or unauthorized');
    }

    await connection.execute(
      'UPDATE attendance SET status = ? WHERE attendance_id = ?',
      [status, attendance_id]
    );

    await connection.commit();
    res.json({ message: 'Attendance updated successfully' });

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Failed to update attendance', err));
  } finally {
    connection.release();
  }
};

export const getAttendanceByClass = async (req, res, next) => {
  try {
    const { class_id } = req.params;
    const { startDate, endDate } = req.query;
    const teacher_id = req.user.teacher_id;

    // Validate date range
    const dateError = validateDateRange(startDate, endDate);
    if (dateError) throw new ValidationError(dateError);

    // Verify class ownership
    const [classInfo] = await pool.execute(
      'SELECT teacher_id FROM classes WHERE class_id = ?',
      [class_id]
    );

    if (!classInfo.length || classInfo[0].teacher_id !== teacher_id) {
      throw new ForbiddenError('Not authorized for this class');
    }

    let query = `SELECT a.*, s.first_name, s.last_name 
                FROM attendance a
                JOIN students s ON a.student_id = s.student_id
                WHERE a.class_id = ?`;
    
    const params = [class_id];
    
    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    const [attendance] = await pool.execute(query, params);

    res.json({
      class_id,
      count: attendance.length,
      records: attendance
    });

  } catch (err) {
    next(new DatabaseError('Failed to fetch attendance', err));
  }
};

export const getStudentAttendance = async (req, res, next) => {
  try {
    const { student_id } = req.params;
    const { startDate, endDate } = req.query;

    // For parents: Verify student relationship
    if (req.user.role === 'parent') {
      const [student] = await pool.execute(
        'SELECT parent_id FROM students WHERE student_id = ?',
        [student_id]
      );
      
      if (!student.length || student[0].parent_id !== req.user.parent_id) {
        throw new ForbiddenError('Not authorized');
      }
    }

    // For students: Verify access to own records
    if (req.user.role === 'student' && req.user.student_id !== student_id) {
      throw new ForbiddenError('Not authorized');
    }

    // Validate date range
    const dateError = validateDateRange(startDate, endDate);
    if (dateError) throw new ValidationError(dateError);

    let query = `SELECT a.*, c.class_name 
                FROM attendance a
                JOIN classes c ON a.class_id = c.class_id
                WHERE a.student_id = ?`;
    
    const params = [student_id];
    
    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    const [attendance] = await pool.execute(query, params);

    res.json({
      student_id,
      total: attendance.length,
      records: attendance
    });

  } catch (err) {
    next(new DatabaseError('Failed to fetch student attendance', err));
  }
};
