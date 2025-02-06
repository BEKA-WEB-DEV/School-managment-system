import pool from '../config/db.js';

export default class Parent {
  // Create parent with student association
  static async create(parentData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into parents_info
      await connection.query('INSERT INTO parents_info SET ?', parentData.info);

      // Insert into parents
      await connection.query('INSERT INTO parents SET ?', {
        parent_id: parentData.parent_id,
        student_id: parentData.student_id,
        parent_password: parentData.hashedPassword
      });

      // Create association
      await connection.query(
        'INSERT INTO parent_student_association SET ?',
        { parent_id: parentData.parent_id, student_id: parentData.student_id }
      );

      await connection.commit();
      return parentData.parent_id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get parent details with linked students
  static async findById(parent_id) {
    const [rows] = await pool.query(`
      SELECT p.*, psi.* 
      FROM parents_info p
      LEFT JOIN parent_student_association psi ON p.parent_id = psi.parent_id
      WHERE p.parent_id = ?
    `, [parent_id]);
    return rows;
  }
}