import pool from '../config/db.js';
import { generateStudentId } from '../utils/idGenerator.js';
import { hashPassword } from '../utils/passwordUtils.js';

export const getStudents = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Fetch paginated students with details
    const [students] = await pool.query(`
      SELECT s.student_id, s.grade_level_id, s.section_id, 
        si.first_name, si.last_name, si.date_of_birth, si.gender
      FROM students s
      JOIN students_info si ON s.student_id = si.student_id
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    // Get total count
    const [total] = await pool.query('SELECT COUNT(*) AS total FROM students');
    res.json({ total: total[0].total, page: parseInt(page), data: students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

export const createStudent = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { details, ...studentData } = req.body;

    const student_id = generateStudentId(); // Auto-generate instead of using client input

    // Insert into students_info
    await connection.query(
      'INSERT INTO students_info SET ?',
      { ...details, student_id }
    );

    // Insert into students table
    await connection.query('INSERT INTO students SET ?', {
      student_id,
      student_password: await hashPassword('TempPassword123!'), // Force password reset
      grade_level_id: await resolveGradeLevelId(studentData.grade_level),
      section_id: await resolveSectionId(studentData.section),
      school_year_id: 1, // Default
      student_status: 'Active'
    });

    await connection.commit();
    res.status(201).json({ student_id });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: 'Student creation failed' });
  } finally {
    connection.release();
  }
};

// Fetch certifications for a student
export const getStudentCertifications = async (req, res) => {
  const { student_id } = req.params;
  try {
    const [certifications] = await pool.query(
      'SELECT * FROM certifications WHERE student_id = ?',
      [student_id]
    );
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

// Helper: Resolve grade_level to ID
const resolveGradeLevelId = async (grade) => {
  const [rows] = await pool.query(
    'SELECT grade_level_id FROM grade_level WHERE grade_level = ?',
    [grade]
  );
  return rows[0]?.grade_level_id;
};