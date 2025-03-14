import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class InstallService {
  static async executeInstallQueries() {
    const connection = await pool.getConnection();
    const sqlPath = path.join(__dirname, '../init.sql'); // Correctly join path

    try {
      const sqlFile = fs.readFileSync(sqlPath, 'utf8');
      
      await connection.beginTransaction();
      
      // Split SQL file into individual queries
      const queries = sqlFile
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);

      for (const query of queries) {
        await connection.execute(query);
        logger.info(`Executed query: ${query.substring(0, 50)}...`);
      }

      await connection.commit();
      return { success: true, message: 'Database setup completed' };
    } catch (err) {
      await connection.rollback();
      logger.error('Installation failed:', err);
      throw new Error('Database installation failed');
    } finally {
      connection.release();
    }
  }
}
