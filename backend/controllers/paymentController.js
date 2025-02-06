// Get parent's linked students
export const getLinkedStudents = async (req, res) => {
  const parent_id = req.user.id;

  try {
    const [students] = await pool.query(`
      SELECT s.student_id, si.first_name, si.last_name, s.grade_level_id, s.section_id
      FROM parent_student_association psa
      JOIN students s ON psa.student_id = s.student_id
      JOIN students_info si ON s.student_id = si.student_id
      WHERE psa.parent_id = ?
    `, [parent_id]);

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch linked students' });
  }
};

// Parent makes payment
export const makePayment = async (req, res) => {
  const parent_id = req.user.id;
  const { student_id, amount, payment_purpose } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Verify parent-student relationship
    const [association] = await connection.query(
      `SELECT * FROM parent_student_association 
       WHERE parent_id = ? AND student_id = ?`,
      [parent_id, student_id]
    );
    
    if (!association.length) {
      return res.status(403).json({ error: 'Student not linked to parent' });
    }

    // Create payment record
    const payment_id = generatePaymentId();
    await connection.query(
      `INSERT INTO payments 
      (payment_id, student_id, amount, payment_purpose, payer_type, payer_id)
      VALUES (?, ?, ?, ?, 'parent', ?)`,
      [payment_id, student_id, amount, payment_purpose, parent_id]
    );

    await connection.commit();
    res.status(201).json({ payment_id });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: 'Payment failed' });
  } finally {
    connection.release();
  }
};