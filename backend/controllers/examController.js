import pool from '../config/db.js';
import { generateExamId } from '../utils/idGenerator.js';

export const createExam = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { exam_datetime, duration, grade_level, section } = req.body;

    // Resolve IDs
    const grade_level_id = await resolveGradeLevelId(grade_level);
    const section_id = await resolveSectionId(section);

    // Generate exam ID
    const exam_id = generateExamId();

    // Insert exam
    await connection.query('INSERT INTO exams SET ?', {
      exam_id,
      exam_datetime,
      duration,
      grade_level_id,
      section_id,
      employee_id: req.user.id, // From JWT
      school_year_id: 1 // Default
    });

    await connection.commit();
    res.status(201).json({ exam_id });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: 'Exam scheduling failed' });
  } finally {
    connection.release();
  }
};