import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export const login = async (req, res) => {
  const { userType, identifier, password } = req.body;

  try {
    // Determine table and credentials column
    const { table, idColumn } = (() => {
      switch (userType) {
        case 'student': return { table: 'students', idColumn: 'student_id' };
        case 'employee': return { table: 'employees', idColumn: 'employee_id' };
        case 'admin': return { table: 'admins', idColumn: 'username' };
        case 'parent': return { table: 'parents', idColumn: 'parent_id' };
        default: throw new Error('Invalid user type');
      }
    })();

    // Fetch user
    const [users] = await pool.query(
      `SELECT * FROM ${table} WHERE ${idColumn} = ?`,
      [identifier]
    );
    const user = users[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Verify password (column: student_password, employee_password, etc.)
    const passwordColumn = `${table.slice(0, -1)}_password`;
    const validPassword = await bcrypt.compare(password, user[passwordColumn]);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT token (expires in 1 hour)
    const accessToken = jwt.sign(
      { id: user[idColumn], type: userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken, user: { id: user[idColumn], type: userType } });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
};