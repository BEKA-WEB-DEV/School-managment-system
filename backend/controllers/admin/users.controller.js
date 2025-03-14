import pool from '../../config/db.js';
// import bcrypt from 'bcryptjs';
import { generateUserId } from '../../utils/idGenerator.js';
import { ROLES } from '../../config/constants.js';
import { DatabaseError, ValidationError } from '../../middleware/errorHandler.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      `SELECT user_id, email, role  
       FROM users
       ORDER BY user_id`
    );
    res.json(users);
  } catch (err) {
    next(new DatabaseError('Failed to fetch users', err));
  }
};

export const createUser = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { email, role, password } = req.body;

    // Validate input
    if (!email || !role || !password) {
      throw new ValidationError('Missing required fields');
    }

    // Generate user ID
    const user_id = generateUserId(role);
    console.log('Generated user ID:', user_id);

    // Check for existing email
    const [existing] = await connection.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      throw new ValidationError('Email already registered');
    }

    // Insert new user
    const [result] = await connection.execute(
      `INSERT INTO users (user_id, email, role, password_hash)
       VALUES (?, ?, ?, ?)`,
      [user_id, email, role, password]
    );

    await connection.commit();

    res.status(201).json({
      user_id,
      email,
      role,
      message: 'User created successfully'
    });

  } catch (err) {
    await connection.rollback();
    console.error('User creation error:', err.message);
    next(new DatabaseError('User creation failed: ' + err.message, err));
  } finally {
    connection.release();
  }
};

export const updateUserRole = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    if (!Object.values(ROLES).includes(newRole)) {
      throw new ValidationError('Invalid role');
    }

    if (userId === req.user.id) {
      throw new ValidationError('Cannot modify your own role');
    }

    await connection.beginTransaction();

    const [result] = await connection.execute(
      'UPDATE users SET role = ? WHERE user_id = ?',
      [newRole, userId]
    );

    if (result.affectedRows === 0) {
      throw new ValidationError('User not found');
    }

    await connection.commit();
    res.json({ message: 'Role updated successfully' });

  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};

export const deleteUser = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      throw new ValidationError('Cannot delete your own account');
    }

    await connection.beginTransaction();

    const [result] = await connection.execute(
      'DELETE FROM users WHERE user_id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      throw new ValidationError('User not found');
    }

    await connection.commit();
    res.status(204).end();

  } catch (err) {
    await connection.rollback();
    next(new DatabaseError('Failed to delete user', err));
  } finally {
    connection.release();
  }
};