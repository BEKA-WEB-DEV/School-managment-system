CREATE TABLE IF NOT EXISTS admins (
    admin_id VARCHAR(10) AUTO_INCREMENT PRIMARY KEY,
    employee_id INT(10) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    level ENUM('6', '5', '4') DEFAULT '4', -- 6=Super Admin, 5=Admin, 4=Registrar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
CREATE TABLE IF NOT EXISTS employees (
    employee_id VARCHAR(10) NOT NULL PRIMARY KEY,
    employee_password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Registrar', 'Academic', 'Teacher') DEFAULT 'Teacher',
    level ENUM('5', '4', '3', '2') DEFAULT '2', -- 5=Admin, 4=Registrar, 3=Academic, 2=Teacher
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    admin_id VARCHAR(10) PRIMARY KEY,
    employee_id VARCHAR(10) NOT NULL,
    employee_password VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    level ENUM('6', '5', '4') DEFAULT '4', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS employees_info (
    employee_id VARCHAR(10) NOT NULL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown') NOT NULL,
    address VARCHAR(255) NOT NULL,
    religion ENUM('Muslim', 'Christian', 'Jewish', 'Others') NOT NULL,
    initial_salary DECIMAL(10, 2) NOT NULL,
    current_salary DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS employees_password_and_autorized_leave (
    employee_id VARCHAR(10) NOT NULL,
    employee_password VARCHAR(255) NOT NULL,
    autorized_leave ENUM('4', '3', '2', '1', '0') DEFAULT '0',
    employee_status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS students_info (
    student_id VARCHAR(10) NOT NULL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown') NOT NULL,
    address VARCHAR(255) NOT NULL,
    religion_status ENUM('Muslim', 'Christian', 'Jewish', 'Others') NOT NULL,
    status ENUM('is registered', 'not registered') DEFAULT 'is registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(10) NOT NULL,
    student_password VARCHAR(255) NOT NULL,
    grade_level_id VARCHAR(10) NOT NULL,
    section_id INT(10) NOT NULL,
    school_year_id INT(10) NOT NULL,
    student_status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id),
    FOREIGN KEY (student_id) REFERENCES students_info(student_id),
    FOREIGN KEY (grade_level_id) REFERENCES grade_level(grade_level_id),
    FOREIGN KEY (section_id) REFERENCES section(section_id),
    FOREIGN KEY (school_year_id) REFERENCES school_year(school_year_id)
);

CREATE TABLE IF NOT EXISTS student_attendance (
    student_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Excused', 'Late') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, date),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE IF NOT EXISTS parents_info (
    parent_id VARCHAR(10) NOT NULL PRIMARY KEY,
    father_first_name VARCHAR(255) NOT NULL,
    father_middle_name VARCHAR(255),
    father_last_name VARCHAR(255) NOT NULL,
    mother_first_name VARCHAR(255) NOT NULL,
    mother_middle_name VARCHAR(255),
    mother_last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship ENUM('Parent', 'Guardian') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parents (
    parent_id VARCHAR(10) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    parent_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents_info(parent_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE IF NOT EXISTS parent_student_association (
    student_id VARCHAR(10) NOT NULL,
    parent_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (student_id, parent_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents_info(parent_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS section (
    section_id INT(10) NOT NULL PRIMARY KEY,
    section_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT(10) NOT NULL PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL,
    grade_level_id VARCHAR(10),
    subject_status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (grade_level_id) REFERENCES grade_level(grade_level_id)
);

CREATE TABLE IF NOT EXISTS grade_level (
    grade_level_id VARCHAR(10) NOT NULL PRIMARY KEY,
    grade_level ENUM('1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade') NOT NULL,
    grade_level_status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
    exam_id VARCHAR(10) NOT NULL PRIMARY KEY,
    grade_level_id VARCHAR(10) NOT NULL,
    subject_id INT(10) NOT NULL,
    section_id INT(10) NOT NULL,
    exam_type ENUM('Test', 'Quiz', 'Midterm', 'Final', 'Assessment') NOT NULL,
    exam_datetime DATETIME NOT NULL,
    employee_id VARCHAR(10) NOT NULL,
    school_year_id INT(10) NOT NULL,
    semester ENUM('1st Semester', '2nd Semester', '3rd Semester', '4th Semester') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (school_year_id) REFERENCES school_year(school_year_id),
    FOREIGN KEY (grade_level_id) REFERENCES grade_level(grade_level_id),
    FOREIGN KEY (section_id) REFERENCES section(section_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

CREATE TABLE IF NOT EXISTS results (
    result_id VARCHAR(10) NOT NULL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    exam_id VARCHAR(10) NOT NULL,
    grade_level_id VARCHAR(10) NOT NULL,
    subject_id INT(10) NOT NULL,
    class VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    exam_type ENUM('Test', 'Quiz', 'Midterm', 'Final', 'Assessment') NOT NULL,
    score DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
);

CREATE TABLE IF NOT EXISTS school_year (
    school_year_id INT(10) NOT NULL PRIMARY KEY,
    school_year VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE certifications (
  cert_id VARCHAR(20) PRIMARY KEY,
  student_id VARCHAR(10) NOT NULL,
  cert_type ENUM('1st Semester', '2nd Semester', '3rd Semester', '4th Semester', 'Total') NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  status ENUM('Pending', 'Approved', 'Expired') DEFAULT 'Pending',
  approved_by VARCHAR(10),
  approval_date DATE,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (approved_by) REFERENCES approval_logs(admin_id)
);

CREATE TABLE certification_metadata (
  cert_type ENUM('1st Semester', '2nd Semester', '3rd Semester', '4th Semester', 'Total') PRIMARY KEY,
  template_path VARCHAR(255) NOT NULL, -- e.g., PDF template storage path
  validity_period INT -- Expiry duration in days
);

CREATE TABLE approval_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  cert_id VARCHAR(20) NOT NULL,
  action ENUM('Requested', 'Approved', 'Rejected') NOT NULL,
  admin_id VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cert_id) REFERENCES certifications(cert_id),
  FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);