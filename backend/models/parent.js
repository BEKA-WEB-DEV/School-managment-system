import pool from '../config/db.js';

export default class Parent {
  static async create(parentData) {
    const [result] = await pool.execute(
      `INSERT INTO parents SET ?`,
      [parentData]
    );
    return this.findById(parentData.parent_id);
  }

  static async findById(parent_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM parents WHERE parent_id = ?',
      [parent_id]
    );
    return rows[0];
  }

  static async getChildren(parent_id) {
    const [rows] = await pool.execute(
      `SELECT s.*, u.email 
       FROM students s
       JOIN users u ON s.user_id = u.user_id
       WHERE s.parent_id = ?`,
      [parent_id]
    );
    return rows;
  }
}