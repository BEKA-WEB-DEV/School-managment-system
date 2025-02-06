import pool from '../config/db.js';

export default class Employee {
  // Create employee across 3 tables
  static async create(employeeData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into employees
      await connection.query('INSERT INTO employees SET ?', {
        employee_id: employeeData.employee_id,
        role: employeeData.role,
        level: employeeData.level,
        employee_password: employeeData.hashedPassword
      });

      // Insert into employees_info
      await connection.query('INSERT INTO employees_info SET ?', {
        employee_id: employeeData.employee_id,
        ...employeeData.details
      });

      // Insert into password/leave table
      await connection.query(
        `INSERT INTO employees_password_and_autorized_leave 
        (employee_id, employee_password, autorized_leave)
        VALUES (?, ?, ?)`,
        [employeeData.employee_id, employeeData.hashedPassword, employeeData.autorized_leave]
      );

      await connection.commit();
      return employeeData.employee_id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all employees with info
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT e.*, ei.* 
      FROM employees e
      JOIN employees_info ei ON e.employee_id = ei.employee_id
    `);
    return rows;
  }
}