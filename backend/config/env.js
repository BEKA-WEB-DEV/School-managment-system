import { cleanEnv, str, num } from 'envalid';
import dotenv from 'dotenv';
dotenv.config(); // Load .env file




export const env =  cleanEnv(process.env, {
  DB_HOST: str({ default: 'localhost' }),
  DB_USER: str({ default: 'school-db' }),
  DB_PASSWORD: str({default: 'school' }),
  DB_NAME: str({ default: 'school_db' }),
  JWT_SECRET: str({ default: '5ac80d525eda082ecf232e27a1ea4f228cc99a7160c281e7aa2f224639e65b49' }),
  JWT_REFRESH_SECRET: str({ default: '5ac80d525eda082ecf232e27a1ea4f228cc99a7160c281e7aa2f224639e65b49' }),
  PORT: num({ default: 3000 })
});



// # # Application
// # NODE_ENV=development
// # PORT=3000
// # CORS_ORIGINS=http://localhost:3000

// # # Database
// # DB_HOST=localhost
// # DB_PORT=3306
// # DB_NAME=school-db
// # DB_USER=root
// # DB_PASSWORD=school

// # # Security
// # JWT_SECRET=your_jwt_secret_here
// # JWT_REFRESH_SECRET=your_refresh_secret_here
// # JWT_EXPIRES_IN=15m
// # JWT_REFRESH_EXPIRES_IN=1d

// # # Rate Limiting
// # RATE_LIMIT_WINDOW_MS=900000
// # RATE_LIMIT_MAX=100