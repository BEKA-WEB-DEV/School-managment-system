import pool from '../config/db.js';

export const validateDateRange = (startDate, endDate) => {
  if ((startDate && !endDate) || (!startDate && endDate)) {
    return 'Both start and end dates are required';
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return 'End date must be after start date';
  }
  
  return null;
};

export const formatAcademicYear = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // January = 1
  
  // Academic year runs September (9) to August (8)
  return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

export const getCurrentTerm = () => {
  const month = new Date().getMonth() + 1;
  
  if (month >= 9 || month < 2) return 'First Term';
  if (month >= 2 && month < 5) return 'Second Term';
  return 'Third Term';
};

export const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
};

export const formatDateForDB = (date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const getAcademicYearDates = async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT start_date, end_date FROM academic_years WHERE is_active = true'
    );
    return rows[0] || null;
  } catch (err) {
    throw new Error('Failed to fetch academic year dates');
  }
};

export const isWithinAcademicYear = async (date) => {
  try {
    const academicYear = await getAcademicYearDates();
    if (!academicYear) return false;

    const checkDate = new Date(date);
    const startDate = new Date(academicYear.start_date);
    const endDate = new Date(academicYear.end_date);

    return checkDate >= startDate && checkDate <= endDate;
  } catch (err) {
    throw new Error('Academic year validation failed');
  }
};

export const getSchoolDays = async (startDate, endDate) => {
  try {
    const [days] = await pool.execute(
      `SELECT date FROM school_calendar 
       WHERE date BETWEEN ? AND ?
       AND is_holiday = false
       ORDER BY date`,
      [startDate, endDate]
    );
    return days.map(d => d.date);
  } catch (err) {
    throw new Error('Failed to fetch school days');
  }
};