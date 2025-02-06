import bcrypt from 'bcrypt';
const saltRounds = 10;

// Hash password
export const hashPassword = async (plaintext) => {
  return await bcrypt.hash(plaintext, saltRounds);
};

// Compare password
export const comparePassword = async (plaintext, hash) => {
  return await bcrypt.compare(plaintext, hash);
};

// Generate temporary password
export const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return Array.from({ length: 12 }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};