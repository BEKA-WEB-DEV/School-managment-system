import pool from '../config/db.js';

export default class AcademicYear {
  // static async create({ year, start_date, end_date }) {
  //   const connection = await pool.getConnection();
  //   try {
  //     await connection.beginTransaction();

  //     // Deactivate all previous years
  //     await connection.execute(
  //       'UPDATE academic_years SET is_active = false'
  //     );

  //     // Create new active year
  //     const [result] = await connection.execute(
  //       `INSERT INTO academic_years 
  //       (year, start_date, end_date, is_active)
  //       VALUES (?, ?, ?, true)`,
  //       [year, start_date, end_date]
  //     );

  //     await connection.commit();
  //     return { id: result.insertId, year, start_date, end_date };
  //   } catch (err) {
  //     await connection.rollback();
  //     throw err;
  //   } finally {
  //     connection.release();
  //   }
  // }

  static async create({ year, start_date, end_date }) {
    const [result] = await pool.execute(
      `INSERT INTO academic_years 
      (year, start_date, end_date) 
      VALUES (?, ?, ?)`,
      [year, start_date, end_date]
    );
    
    return {
      id: result.insertId,
      year,
      start_date,
      end_date
    };
  }

  static async findCurrent() {
    const [rows] = await pool.execute(
      'SELECT * FROM academic_years WHERE is_active = true'
    );
    return rows[0];
  }

  static async update(id, updates) {
    const [result] = await pool.execute(
      'UPDATE academic_years SET ? WHERE id = ?',
      [updates, id]
    );
    return result.affectedRows;
  }
}