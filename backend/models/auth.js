import pool from '../config/db.js';

export default class Auth {
  // Unified login for all user types
  static async findUser(userType, identifier) {
    const tables = {
      student: { table: 'students', idColumn: 'student_id' },
      employee: { table: 'employees', idColumn: 'employee_id' },
      admin: { table: 'admins', idColumn: 'username' },
      parent: { table: 'parents', idColumn: 'parent_id' }
    };

    const { table, idColumn } = tables[userType];
    const [rows] = await pool.query(
      `SELECT * FROM ${table} WHERE ${idColumn} = ?`,
      [identifier]
    );
    return rows[0];
  }
}