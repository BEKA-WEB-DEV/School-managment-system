import pool from '../config/db.js';

export default class Subject {
  // Create new subject
  static async create(subjectData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Resolve grade_level_id if grade_level name is provided
      let grade_level_id = subjectData.grade_level_id;
      if (subjectData.grade_level) {
        grade_level_id = await this._resolveGradeLevelId(subjectData.grade_level);
      }

      // Insert subject
      await connection.query(
        'INSERT INTO subjects (subject_id, subject_name, grade_level_id, subject_status) VALUES (?, ?, ?, ?)',
        [
          subjectData.subject_id,
          subjectData.subject_name,
          grade_level_id,
          subjectData.subject_status || 'Active'
        ]
      );

      await connection.commit();
      return subjectData.subject_id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all subjects
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM subjects');
    return rows;
  }

  // Get subject by ID
  static async findById(subject_id) {
    const [rows] = await pool.query(
      'SELECT * FROM subjects WHERE subject_id = ?',
      [subject_id]
    );
    return rows[0];
  }

  // Get subjects by grade level (name or ID)
  static async findByGradeLevel(gradeLevel) {
    const grade_level_id = await this._resolveGradeLevelId(gradeLevel);
    const [rows] = await pool.query(
      'SELECT * FROM subjects WHERE grade_level_id = ?',
      [grade_level_id]
    );
    return rows;
  }

  // Helper: Convert grade level name to ID
  static async _resolveGradeLevelId(gradeLevel) {
    const [rows] = await pool.query(
      'SELECT grade_level_id FROM grade_level WHERE grade_level = ?',
      [gradeLevel]
    );
    return rows[0]?.grade_level_id;
  }

  // Update subject details
  static async update(subject_id, updates) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (updates.grade_level) {
        updates.grade_level_id = await this._resolveGradeLevelId(updates.grade_level);
        delete updates.grade_level;
      }

      const query = 'UPDATE subjects SET ? WHERE subject_id = ?';
      const [result] = await connection.query(query, [updates, subject_id]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete subject
  static async delete(subject_id) {
    const [result] = await pool.query(
      'DELETE FROM subjects WHERE subject_id = ?',
      [subject_id]
    );
    return result.affectedRows > 0;
  }
}