const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// require("dotenv").config();

const Login = {
  // Admin Login (assuming admins table exists)
  adminLogin: async (username, password) => {
    const [rows] = await db.promise().query(
      `SELECT admin_id, username, password, role 
       FROM admins 
       WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      throw new Error("Admin not found");
    }

    const admin = rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: admin.admin_id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      admin_id: admin.admin_id,
      username: admin.username,
      role: admin.role,
      token,
    };
  },

  // Student Login
  studentLogin: async (studentId, password) => {
    const [rows] = await db.promise().query(
      `SELECT student_id, first_name, last_name, password 
       FROM students 
       WHERE student_id = ?`,
      [studentId]
    );

    if (rows.length === 0) {
      throw new Error("Student not found");
    }

    const student = rows[0];
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: student.student_id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      student_id: student.student_id,
      name: `${student.first_name} ${student.last_name}`,
      role: "student",
      token,
    };
  },

  // Employee Login
  employeeLogin: async (employeeId, password) => {
    const [rows] = await db.promise().query(
      `SELECT employee_id, first_name, last_name, password, role 
       FROM employees 
       WHERE employee_id = ?`,
      [employeeId]
    );

    if (rows.length === 0) {
      throw new Error("Employee not found");
    }

    const employee = rows[0];
    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: employee.employee_id, role: employee.role.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      employee_id: employee.employee_id,
      name: `${employee.first_name} ${employee.last_name}`,
      role: employee.role.toLowerCase(),
      token,
    };
  },

  // Parent Login
  parentLogin: async (parentId, password) => {
    const [rows] = await db.promise().query(
      `SELECT parent_id, first_name, last_name, email, password 
       FROM parents 
       WHERE parent_id = ?`,
      [parentId]
    );

    if (rows.length === 0) {
      throw new Error("Parent not found");
    }

    const parent = rows[0];
    const validPassword = await bcrypt.compare(password, parent.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: parent.parent_id, role: "parent" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      parent_id: parent.parent_id,
      name: `${parent.first_name} ${parent.last_name}`,
      email: parent.email,
      role: "parent",
      token,
    };
  },
};

module.exports = Login;
