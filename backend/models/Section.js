import pool from '../config/db.js';

export default class Section {
  // Create new section
  static async create(section_id, section_name) {
    const [result] = await pool.query(
      'INSERT INTO section (section_id, section_name) VALUES (?, ?)',
      [section_id, section_name]
    );
    return section_id;
  }

  // Get all sections
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM section');
    return rows;
  }

  // Get section by ID
  static async findById(section_id) {
    const [rows] = await pool.query(
      'SELECT * FROM section WHERE section_id = ?',
      [section_id]
    );
    return rows[0];
  }

  // Update section name
  static async update(section_id, section_name) {
    const [result] = await pool.query(
      'UPDATE section SET section_name = ? WHERE section_id = ?',
      [section_name, section_id]
    );
    return result.affectedRows > 0;
  }

  // Delete section
  static async delete(section_id) {
    const [result] = await pool.query(
      'DELETE FROM section WHERE section_id = ?',
      [section_id]
    );
    return result.affectedRows > 0;
  }
}