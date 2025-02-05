const validateStudent = (req, res, next) => {
  const requiredFields = [
    "student_id",
    "first_name",
    "last_name",
    "gender",
    "date_of_birth",
    "grade_level",
    "section",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing ${field}` });
    }
  }

  if (req.body.student_id && !/^STD\d{7}$/.test(req.body.student_id)) {
    return res.status(400).json({ error: "Invalid student ID format" });
  }

  if (req.body.date_of_birth && isNaN(Date.parse(req.body.date_of_birth))) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  next();
};

const validateAttendance = (req, res, next) => {
  const { userType, records } = req.body;

  if (!["student", "employee"].includes(userType)) {
    return res.status(400).json({ error: "Invalid user type" });
  }

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: "Invalid attendance records" });
  }

  for (const record of records) {
    if (!record.user_id || !record.date || !record.status) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  }

  next();
};

// middleware/validationMiddleware.js
const validateLogin = (req, res, next) => {
  const { userType, identifier, password } = req.body;
  if (!userType || !identifier || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
};

const validateReset = (req, res, next) => {
  const { userType, identifier } = req.body;
  if (!userType || !identifier) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
};

const validateCertificate = (req, res, next) => {
  const requiredFields = [
    "student_id",
    "exam_id",
    "grade_level",
    "subject_name",
    "section_name",
    "exam_type",
    "score",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing ${field}` });
    }
  }

  if (isNaN(req.body.score) || req.body.score < 0 || req.body.score > 100) {
    return res.status(400).json({ error: "Invalid score" });
  }

  next();
};

const validateEmployee = (req, res, next) => {
  const requiredFields = [
    "employee_id",
    "first_name",
    "last_name",
    "gender",
    "date_of_birth",
    "current_salary",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing ${field}` });
    }
  }

  if (!/^EMP\d{6}$/.test(req.body.employee_id)) {
    return res.status(400).json({ error: "Invalid employee ID format" });
  }

  next();
};

// middleware/validationMiddleware.js
const validateExam = (req, res, next) => {
  const requiredFields = [
    "employee_id",
    "grade_level",
    "subject_name",
    "section_name",
    "exam_type",
    "exam_datetime",
    "duration",
    "school_year_id",
    "semester",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing ${field}` });
    }
  }

  if (req.body.duration < 15 || req.body.duration > 180) {
    return res
      .status(400)
      .json({ error: "Duration must be between 15-180 minutes" });
  }

  if (isNaN(Date.parse(req.body.exam_datetime))) {
    return res.status(400).json({ error: "Invalid datetime format" });
  }

  next();
};

// middleware/validationMiddleware.js
const validateParent = (req, res, next) => {
  const requiredFields = [
    "father_first_name",
    "father_last_name",
    "mother_first_name",
    "mother_last_name",
    "email",
    "phone",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing ${field}` });
    }
  }

  if (!/^PAR\d{7}$/.test(req.params.id)) {
    return res.status(400).json({ error: "Invalid parent ID format" });
  }

  if (req.body.phone && !/^\d{10,15}$/.test(req.body.phone)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  next();
};

const validatePayment = (req, res, next) => {
  const requiredFields = [
    "student_id",
    "amount",
    "due_date",
    "payment_purpose",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing ${field}` });
    }
  }

  if (isNaN(req.body.amount) || req.body.amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (isNaN(Date.parse(req.body.due_date))) {
    return res.status(400).json({ error: "Invalid due date format" });
  }

  next();
};

// middleware/validationMiddleware.js
const validatePromotion = (req, res, next) => {
  const requiredFields = [
    "student_id",
    "current_grade",
    "requested_grade",
    "reason",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing ${field}` });
    }
  }

  const validGrades = [
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
  ];

  if (
    !validGrades.includes(req.body.current_grade) ||
    !validGrades.includes(req.body.requested_grade)
  ) {
    return res.status(400).json({ error: "Invalid grade level" });
  }

  next();
};

const validateResult = (req, res, next) => {
  const requiredFields = ["student_id", "exam_id", "score"];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Missing ${field}` });
    }
  }

  if (isNaN(req.body.score) || req.body.score < 0 || req.body.score > 100) {
    return res.status(400).json({ error: "Invalid score (0-100 only)" });
  }

  next();
};

module.exports = {
  validateStudent,
  validateAttendance,
  validateLogin,
  validateReset,
  validateCertificate,
  validateEmployee,
  validateExam,
  validateParent,
  validatePayment,
  validatePromotion,
  validateResult,
};
