import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { generateEmployeeId } from '../utils/idGenerator.js';
import { hashPassword } from '../utils/passwordUtils.js';

// Create new employee (Admin only)
export const createEmployee = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { 
      role = 'Teacher', 
      level = '2', 
      password, 
      ...employeeInfo 
    } = req.body;

    // Generate employee ID
    const employee_id = generateEmployeeId();

    // Insert into employees table
    await connection.query(
      `INSERT INTO employees 
      (employee_id, role, level, employee_password)
      VALUES (?, ?, ?, ?)`,
      [
        employee_id,
        role,
        level,
        await bcrypt.hash(password, 10)
      ]
    );

    // Insert into employees_info
    await connection.query(
      `INSERT INTO employees_info 
      (employee_id, first_name, last_name, gender, date_of_birth, address, religion, current_salary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_id,
        employeeInfo.first_name,
        employeeInfo.last_name,
        employeeInfo.gender,
        employeeInfo.date_of_birth,
        employeeInfo.address,
        employeeInfo.religion,
        employeeInfo.current_salary
      ]
    );

    // Insert into employees_password_and_autorized_leave
    await connection.query(
      `INSERT INTO employees_password_and_autorized_leave 
      (employee_id, employee_password, autorized_leave)
      VALUES (?, ?, ?)`,
      [
        employee_password: await hashPassword('TempPassword123!'),
        employeeInfo.autorized_leave || '0'
      ]
    );

    await connection.commit();
    res.status(201).json({ employee_id });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: 'Employee creation failed' });
  } finally {
    connection.release();
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const [employees] = await pool.query(`
      SELECT e.employee_id, e.role, e.level, e.status,
        ei.first_name, ei.last_name, ei.current_salary
      FROM employees e
      JOIN employees_info ei ON e.employee_id = ei.employee_id
    `);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};