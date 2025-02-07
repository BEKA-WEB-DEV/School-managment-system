import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { generateParentId } from '../utils/idGenerator.js'; // Auto-generate IDs

// Create parent account (with student linking)
export const createParent = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { father_first_name, mother_first_name, email, phone, password, student_id } = req.body;
    
    // 1. Generate unique parent ID (instead of using client-provided)
    const parent_id = generateParentId();

    // 2. Insert into parents_info
    await connection.query(
      `INSERT INTO parents_info 
      (parent_id, father_first_name, mother_first_name, email, phone)
      VALUES (?, ?, ?, ?, ?)`,
      [parent_id, father_first_name, mother_first_name, email, phone]
    );

    // 3. Hash password and insert into parents table
    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.query(
      `INSERT INTO parents 
      (parent_id, student_id, parent_password)
      VALUES (?, ?, ?)`,
      [parent_id, student_id, hashedPassword]
    );

    // 4. Link to student via parent_student_association
    await connection.query(
      `INSERT INTO parent_student_association 
      (student_id, parent_id)
      VALUES (?, ?)`,
      [student_id, parent_id]
    );

    await connection.commit();
    res.status(201).json({ parent_id, message: 'Parent created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ 
      error: 'Parent creation failed',
      details: 'Ensure the student exists and data is valid' // Generic error
    });
  } finally {
    connection.release();
  }
};

// Get parent details
export const getParentDetails = async (req, res) => {
  const { parent_id } = req.params;
  try {
    const [parentInfo] = await pool.query(
      `SELECT * FROM parents_info 
      WHERE parent_id = ?`,
      [parent_id]
    );
    
    if (!parentInfo.length) {
      return res.status(404).json({ error: 'Parent not found' });
    }
    res.json(parentInfo[0]);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch parent details'
    });
  }
};

// Get all students linked to a parent
export const getParentStudents = async (req, res) => {
  const { parent_id } = req.params;
  try {
    const [students] = await pool.query(
      `SELECT s.student_id, si.first_name, si.last_name, s.grade_level_id 
      FROM parent_student_association psa
      JOIN students s ON psa.student_id = s.student_id
      JOIN students_info si ON s.student_id = si.student_id
      WHERE psa.parent_id = ?`,
      [parent_id]
    );
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch linked students'
    });
  }
};

// Link additional student to parent (with password verification)
export const linkStudentToParent = async (req, res) => {
  const { parent_id } = req.params;
  const { student_id, password } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Verify parent credentials
    const [parent] = await connection.query(
      `SELECT parent_password FROM parents 
      WHERE parent_id = ? LIMIT 1`,
      [parent_id]
    );
    if (!parent.length) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    // 2. Validate password
    const validPassword = await bcrypt.compare(password, parent[0].parent_password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // 3. Link new student
    await connection.query(
      `INSERT INTO parent_student_association 
      (student_id, parent_id)
      VALUES (?, ?)`,
      [student_id, parent_id]
    );

    await connection.commit();
    res.json({ message: 'Student linked successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ 
      error: 'Student linking failed',
      details: 'Student may not exist or already linked'
    });
  } finally {
    connection.release();
  }
};

// Update parent contact info
export const updateParentContact = async (req, res) => {
  const { parent_id } = req.params;
  const { email, phone } = req.body;
  
  try {
    const [result] = await pool.query(
      `UPDATE parents_info 
      SET email = ?, phone = ?
      WHERE parent_id = ?`,
      [email, phone, parent_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Parent not found' });
    }
    
    res.json({ message: 'Contact information updated' });
  } catch (error) {
    res.status(400).json({ 
      error: 'Update failed'
    });
  }
};

export const makePayment = async (req, res) => {
  // Payment processing logic
  res.json({ message: 'Payment successful' });


}