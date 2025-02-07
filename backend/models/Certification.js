import pool from '../config/db.js'; // Assuming you have a configured pool to interact with the database

// Issue a new certificate (create a new record)
export const issue = async ({ cert_id, student_id, cert_type, expiry_date }) => {
  try {
    // Insert the certificate details into the database
    const result = await pool.query(
      'INSERT INTO certifications (cert_id, student_id, cert_type, expiry_date, status) VALUES (?, ?, ?, ?, ?)',
      [cert_id, student_id, cert_type, expiry_date, 'Pending'] // Default status as 'Pending'
    );

    if (result[0].affectedRows === 0) {
      throw new Error('Certificate issue failed');
    }

    return { cert_id };
  } catch (error) {
    console.error('Error issuing certificate:', error);
    throw new Error('Certificate issue failed');
  }
};

// Approve a certificate (Admin/Registrar role)
export const approve = async (cert_id, user_id) => {
  try {
    // Update the status of the certificate to 'Approved'
    const [result] = await pool.query(
      'UPDATE certifications SET status = ?, approved_by = ?, approved_at = NOW() WHERE cert_id = ?',
      ['Approved', user_id, cert_id]
    );

    if (result.affectedRows === 0) {
      return false; // Certificate not found
    }

    return true; // Successfully approved
  } catch (error) {
    console.error('Error approving certificate:', error);
    throw new Error('Approval failed');
  }
};

// Verify a certificate (Public endpoint)
export const verify = async (cert_id) => {
  try {
    // Fetch certificate details from the database based on cert_id
    const [certificate] = await pool.query(
      'SELECT * FROM certifications WHERE cert_id = ? AND status = ?',
      [cert_id, 'Approved'] // Only return certificates that are approved
    );

    if (certificate.length === 0) {
      return null; // Certificate not found or not approved
    }

    return certificate[0]; // Return the certificate data
  } catch (error) {
    console.error('Error verifying certificate:', error);
    throw new Error('Verification failed');
  }
};
