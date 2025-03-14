import pool from '../config/db.js';
import bcrypt from 'bcrypt';

// Role to prefix mapping
const ROLE_PREFIX = {
  admin: 'ADM',
  academic: 'ACA',
  registrar: 'REG',
  teacher: 'TEH',
  student: 'STU',
  parent: 'PAR'
};

export default class User {
  static async create({ email, password, role }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Validate role and generate a unique user_id using the role prefix and current timestamp
      const prefix = ROLE_PREFIX[role];
      if (!prefix) {
        throw new Error(`Invalid role provided: ${role}`);
      }
      const user_id = `${prefix}${Date.now()}`;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert the new user into the database
      const [userResult] = await connection.execute(
        'INSERT INTO users (user_id, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [user_id, email, hashedPassword, role]
      );

      await connection.commit();
      return { user_id, email, role };

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async findById(user_id) {
    const [rows] = await pool.execute(
      'SELECT user_id, email, role, created_at FROM users WHERE user_id = ?',
      [user_id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }
  
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async update(user_id, updates) {
    const allowedFields = ['email', 'password_hash', 'role'];
    const validUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
  
    const setClause = Object.keys(validUpdates)
      .map(field => `${field} = ?`)
      .join(', ');
    
    // Get corresponding values for the fields to be updated
    const values = Object.values(validUpdates);
    
    await pool.execute(
      `UPDATE users SET ${setClause} WHERE user_id = ?`,
      [...values, user_id]
    );
  }

  static async delete(user_id) {
    await pool.execute(
      'DELETE FROM users WHERE user_id = ?',
      [user_id]
    );
  }

  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return false;
    return bcrypt.compare(password, user.password_hash);
  }

  static async updateLastLogin(userId) {
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE user_id = ?',
      [userId]
    );
  }
}





// import pool from '../config/db.js';
// import bcrypt from 'bcrypt';

// export default class User {
//   // static async create({ email, password, role }) {
//   //   const hashedPassword = await bcrypt.hash(password, 12);
//   //   const [result] = await pool.execute(
//   //     'INSERT INTO users (user_id, email, password_hash, role) VALUES (?, ?, ?, ?)',
//   //     [`USR_${Date.now()}`, email, hashedPassword, role]
//   //   );
//   //   return { id: result.insertId, email, role };
//   // }
//   static async create({ email, password, role }) {
//     const connection = await pool.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Validate role and generate a unique user_id using the role prefix and current timestamp
//       const prefix = ROLE_PREFIX[role];
//       if (!prefix) {
//         throw new Error(`Invalid role provided: ${role}`);
//       }
//       const user_id = `${prefix}${Date.now()}`;

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 12);

//       // Insert the new user into the database
//       const [userResult] = await connection.execute(
//         'INSERT INTO users (user_id, email, password_hash, role) VALUES (?, ?, ?, ?)',
//         [user_id, email, hashedPassword, role]
//       );

//       await connection.commit();
//       return { user_id, email, role };

//     } catch (err) {
//       await connection.rollback();
//       throw err;
//     } finally {
//       connection.release();
//     }
//   }

//   static async findById(user_id) {
//     const [rows] = await pool.execute(
//       'SELECT user_id, email, role, created_at FROM users WHERE user_id = ?',
//       [user_id]
//     );
//     return rows[0];
//   }

//   static async findByEmail(email) {
//     const [rows] = await pool.execute(
//       'SELECT * FROM users WHERE email = ?',
//       [email]
//     );
//     return rows[0];
//   }
  
//   static async comparePassword(candidatePassword, hashedPassword) {
//     return await bcrypt.compare(candidatePassword, hashedPassword);
//   }

//   static async update(user_id, updates) {
//     const allowedFields = ['email', 'password_hash', 'role'];
//     const validUpdates = Object.keys(updates)
//       .filter(key => allowedFields.includes(key))
//       .reduce((obj, key) => {
//         obj[key] = updates[key];
//         return obj;
//       }, {});
  
//     const setClause = Object.keys(validUpdates).map(field => `${field} = ?`).join(', ');
    
//     await pool.execute(
//       `UPDATE users SET ${setClause} WHERE user_id = ?`,
//       [...values, user_id]
//     );
//   }

//   static async delete(user_id) {
//     await pool.execute(
//       'DELETE FROM users WHERE user_id = ?',
//       [user_id]
//     );
//   }
//   static async verifyPassword(email, password) {
//     const user = await this.findByEmail(email);
//     if (!user) return false;
//     return bcrypt.compare(password, user.password_hash);
//   }

//   static async updateLastLogin(userId) {
//     await pool.execute(
//       'UPDATE users SET last_login = NOW() WHERE user_id = ?',
//       [userId]
//     );
//   }
// }