import pool from '../config/db.js';

export default class Admin {
  // Create admin (linked to employee)
  static async create(adminData) {
    const [result] = await pool.query('INSERT INTO admins SET ?', {
      admin_id: adminData.admin_id,
      employee_id: adminData.employee_id,
      username: adminData.username,
      password: adminData.hashedPassword,
      level: adminData.level
    });
    return result.insertId;
  }

  // Find admin by username
  static async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    return rows[0];
  }
}