// import AcademicYear from '../../models/AcademicYear.js';
// import { DatabaseError, ValidationError } from '../../middleware/errorHandler.js';

// // export const configureAcademicYear = async (req, res, next) => {
// //   try {
// //     const { year, start_date, end_date } = req.body;

// //     if (new Date(start_date) >= new Date(end_date)) {
// //       throw new ValidationError('End date must be after start date');
// //     }

// //     const academicYear = await AcademicYear.create({
// //       year,
// //       start_date,
// //       end_date
// //     });

// //     res.status(201).json(academicYear);
// //   } catch (err) {
// //     next(new DatabaseError('Failed to configure academic year', err));
// //   }
// // };

// export const configureAcademicYear = async (req, res, next) => {
//   try {
//     const { year, start_date, end_date } = req.body;

//     // Validate input dates
//     const startDate = new Date(start_date);
//     const endDate = new Date(end_date);
    
//     if (startDate >= endDate) {
//       throw new ValidationError('End date must be after start date');
//     }

//     const academicYear = await AcademicYear.create({
//       year,
//       start_date: startDate,
//       end_date: endDate
//     });

//     res.status(201).json(academicYear);
//   } catch (err) {
//     next(new DatabaseError('Failed to configure academic year', err));
//   }
// };
// export const manageSystemRoles = async (req, res, next) => {
//   try {
//     const { action, role } = req.body;

//     // Implementation would need ALTER TABLE for ENUM values
//     // This is highly database-specific and potentially dangerous
//     // Example for MySQL:
//     const [currentRoles] = await pool.execute(
//       `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
//        WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'role'`
//     );

//     const enumValues = currentRoles[0].COLUMN_TYPE
//       .replace(/enum\(|\)|'/g, '')
//       .split(',');

//     if (action === 'add' && !enumValues.includes(role)) {
//       enumValues.push(role);
//     } else if (action === 'remove') {
//       enumValues.splice(enumValues.indexOf(role), 1);
//     }

//     await pool.execute(
//       `ALTER TABLE users MODIFY COLUMN role 
//        ENUM(${enumValues.map(v => `'${v}'`).join(',')})`
//     );

//     res.json({ message: 'System roles updated' });
//   } catch (err) {
//     next(new DatabaseError('Failed to update system roles', err));
//   }
// };


import pool from '../../config/db.js';
import { checkSystemInstalled } from '../../utils/system.utils.js';

const SystemController = {
  // Handle system installation
  handleInstall: async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        success: false,
        error: 'Installation disabled in production' 
      });
    }

    try {
      const isInstalled = await checkSystemInstalled();
      if (isInstalled) {
        return res.status(400).json({
          success: false,
          error: 'System already installed'
        });
      }

      // Create tables
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          user_id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'academic', 'registrar', 'teacher', 'student', 'parent') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS academic_years (
          year_id VARCHAR(36) PRIMARY KEY,
          year_name VARCHAR(50) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add more tables as needed...

      return res.status(200).json({
        success: true,
        message: 'Database setup completed'
      });

    } catch (error) {
      console.error('Installation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database installation failed'
      });
    }
  },

  // Get system health status
  getHealth: async (req, res) => {
    try {
      // Test database connection
      await pool.query('SELECT 1');
      
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        version: process.env.npm_package_version
      });

    } catch (error) {
      console.error('Health check failed:', error);
      return res.status(500).json({
        status: 'error',
        database: 'disconnected'
      });
    }
  },

  // Configure academic year (admin only)
  configureAcademicYear: async (req, res) => {
    try {
      const { year, start_date, end_date } = req.body;

      if (new Date(start_date) >= new Date(end_date)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date range'
        });
      }

      await pool.query(
        'INSERT INTO academic_years (year_id, year_name, start_date, end_date) VALUES (UUID(), ?, ?, ?)',
        [year, start_date, end_date]
      );

      return res.status(201).json({
        success: true,
        message: 'Academic year configured'
      });

    } catch (error) {
      console.error('Academic year config error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to configure academic year'
      });
    }
  }
};

export default SystemController;