-- 1. Users Table (for authentication and roles)
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(20) UNIQUE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'academic', 'registrar', 'teacher', 'student', 'parent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Parents Table (linked to users)
CREATE TABLE IF NOT EXISTS parents (
    parent_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    father_first_name VARCHAR(255) NOT NULL,
    father_middle_name VARCHAR(255),
    father_last_name VARCHAR(255) NOT NULL,
    mother_first_name VARCHAR(255) NOT NULL,
    mother_middle_name VARCHAR(255),
    mother_last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    relationship ENUM('Parent', 'Guardian') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Teachers Table (linked to users)
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown') NOT NULL,
    address VARCHAR(255) NOT NULL,
    religion ENUM('Muslim', 'Christian', 'Jewish', 'Others') NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    employment_type ENUM('full-time', 'part-time', 'contract') NOT NULL,
    status ENUM('active', 'on-leave', 'retired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Students Table (linked to users and parents)
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) UNIQUE NOT NULL,
    parent_id VARCHAR(20) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(parent_id) ON DELETE CASCADE
);

-- 5. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    subject_id VARCHAR(20) PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL,
    credit_hours TINYINT NOT NULL,
    department ENUM('Math', 'Science', 'Arts', 'Languages', 'English', 'Civics') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Classes Table
CREATE TABLE IF NOT EXISTS classes (
    class_id VARCHAR(20) PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    teacher_id VARCHAR(20) NOT NULL,
    subject_id VARCHAR(20) NOT NULL,
    schedule ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Weekend') NOT NULL,
    academic_year YEAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

-- 7. Enrollments Table (Students <> Classes)
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    class_id VARCHAR(20) NOT NULL,
    enrollment_date DATE NOT NULL,
    status ENUM('enrolled', 'completed', 'dropped') DEFAULT 'enrolled',
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    UNIQUE(student_id, class_id)
);

-- 8. Exams Table
CREATE TABLE IF NOT EXISTS exams (
    exam_id VARCHAR(50) PRIMARY KEY,
    class_id VARCHAR(20) NOT NULL,
    exam_type ENUM('midterm', 'final', 'quiz') NOT NULL,
    exam_date DATE NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    created_by VARCHAR(20) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (created_by) REFERENCES teachers(teacher_id)
);

-- 9. Exam Results Table
CREATE TABLE IF NOT EXISTS exam_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    remarks VARCHAR(255),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    UNIQUE(exam_id, student_id)
);

-- 10. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    class_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'excused') NOT NULL,
    recorded_by VARCHAR(20) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (recorded_by) REFERENCES teachers(teacher_id)
);

-- 11. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(20) PRIMARY KEY,
    parent_id VARCHAR(20) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    purpose ENUM('tuition', 'uniform', 'activities', 'other') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    receipt_url VARCHAR(255),
    FOREIGN KEY (parent_id) REFERENCES parents(parent_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- 12. Indexes for frequently queried columns
CREATE INDEX idx_student_name ON students(first_name, last_name);
CREATE INDEX idx_teacher_subject ON classes(teacher_id, subject_id);
CREATE INDEX idx_enrollment_status ON enrollments(status);


-- ============================================
-- Insert Initial Data for Admin
-- ============================================
-- Insert the admin user into the users table
INSERT INTO users (user_id, email, password_hash, role, created_at, updated_at)
VALUES ('ADMIN001', 'admin@school.com', '$2b$10$S2EF.ttUrbaOwiTozz2PaeN3Lz6r4ehBxKezwHfYqWBXnjxm6VQSq', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



-- -- Users Table (for authentication and roles)
-- CREATE TABLE IF NOT EXISTS users (
--     user_id VARCHAR(20) UNIQUE PRIMARY KEY,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password_hash VARCHAR(255) NOT NULL,
--     role ENUM('admin', 'academic', 'registrar', 'teacher', 'student', 'parent') NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- -- Students Table (linked to users and parents)
-- CREATE TABLE IF NOT EXISTS students (
--     student_id VARCHAR(20) PRIMARY KEY,
--     user_id VARCHAR(20) UNIQUE NOT NULL,
--     parent_id VARCHAR(20) NOT NULL,
--     first_name VARCHAR(255) NOT NULL,
--     middle_name VARCHAR(255),
--     last_name VARCHAR(255) NOT NULL,
--     gender ENUM('Male', 'Female') NOT NULL,
--     date_of_birth DATE NOT NULL,
--     address VARCHAR(255) NOT NULL,
--     status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (parent_id) REFERENCES parents(parent_id) ON DELETE CASCADE
-- );

-- -- Parents Table (linked to users)
-- CREATE TABLE IF NOT EXISTS parents (
--     parent_id VARCHAR(20) PRIMARY KEY,
--     user_id VARCHAR(20) UNIQUE NOT NULL,
--     phone VARCHAR(20) NOT NULL,
--     father_first_name VARCHAR(255) NOT NULL,
--     father_middle_name VARCHAR(255),
--     father_last_name VARCHAR(255) NOT NULL,
--     mother_first_name VARCHAR(255) NOT NULL,
--     mother_middle_name VARCHAR(255),
--     mother_last_name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     relationship ENUM('Parent', 'Guardian') NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
-- );

-- -- Teachers Table (linked to users)
-- CREATE TABLE IF NOT EXISTS teachers (
--     teacher_id VARCHAR(20) PRIMARY KEY,
--     user_id VARCHAR(20) UNIQUE NOT NULL,
--     first_name VARCHAR(255) NOT NULL,
--     middle_name VARCHAR(255),
--     last_name VARCHAR(255) NOT NULL,
--     gender ENUM('Male', 'Female') NOT NULL,
--     date_of_birth DATE NOT NULL,
--     place_of_birth VARCHAR(255) NOT NULL,
--     blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown') NOT NULL,
--     address VARCHAR(255) NOT NULL,
--     religion ENUM('Muslim', 'Christian', 'Jewish', 'Others') NOT NULL,
--     specialization VARCHAR(255) NOT NULL,
--     employment_type ENUM('full-time', 'part-time', 'contract') NOT NULL,
--     status ENUM('active', 'on-leave', 'retired') DEFAULT 'active',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
-- );


-- -- Classes Table
-- CREATE TABLE IF NOT EXISTS classes (
--     class_id VARCHAR(20) PRIMARY KEY,
--     class_name VARCHAR(255) NOT NULL,
--     teacher_id VARCHAR(20) NOT NULL,
--     subject_id VARCHAR(20) NOT NULL,
--     schedule ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Weekend') NOT NULL,
--     academic_year YEAR NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
--     FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
-- );

-- -- Subjects Table
-- CREATE TABLE IF NOT EXISTS subjects (
--     subject_id VARCHAR(20) PRIMARY KEY,
--     subject_name VARCHAR(255) NOT NULL,
--     credit_hours TINYINT NOT NULL,
--     department ENUM('Math', 'Science', 'Arts', 'Languages', 'English', 'Civics') NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Enrollment Table (Students <> Classes)
-- CREATE TABLE IF NOT EXISTS enrollments (
--     enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
--     student_id VARCHAR(20) NOT NULL,
--     class_id VARCHAR(20) NOT NULL,
--     enrollment_date DATE NOT NULL,
--     status ENUM('enrolled', 'completed', 'dropped') DEFAULT 'enrolled',
--     FOREIGN KEY (student_id) REFERENCES students(student_id),
--     FOREIGN KEY (class_id) REFERENCES classes(class_id),
--     UNIQUE(student_id, class_id)
-- );

-- -- Exams Table
-- CREATE TABLE IF NOT EXISTS exams (
--     exam_id VARCHAR(50) PRIMARY KEY,
--     class_id VARCHAR(20) NOT NULL,
--     exam_type ENUM('midterm', 'final', 'quiz') NOT NULL,
--     exam_date DATE NOT NULL,
--     max_score DECIMAL(5,2) NOT NULL,
--     created_by VARCHAR(20) NOT NULL,
--     FOREIGN KEY (class_id) REFERENCES classes(class_id),
--     FOREIGN KEY (created_by) REFERENCES teachers(teacher_id)
-- );


-- -- Exam Scores Table
-- CREATE TABLE IF NOT EXISTS exam_results (
--     result_id INT AUTO_INCREMENT PRIMARY KEY,
--     exam_id VARCHAR(50) NOT NULL,
--     student_id VARCHAR(20) NOT NULL,
--     score DECIMAL(5,2) NOT NULL,
--     remarks VARCHAR(255),
--     FOREIGN KEY (exam_id) REFERENCES exams(exam_id),
--     FOREIGN KEY (student_id) REFERENCES students(student_id),
--     UNIQUE(exam_id, student_id)
-- );


-- -- Attendance Table
-- CREATE TABLE IF NOT EXISTS attendance (
--     attendance_id INT AUTO_INCREMENT PRIMARY KEY,
--     student_id VARCHAR(20) NOT NULL,
--     class_id VARCHAR(20) NOT NULL,
--     date DATE NOT NULL,
--     status ENUM('present', 'absent', 'excused') NOT NULL,
--     recorded_by VARCHAR(20) NOT NULL,
--     FOREIGN KEY (student_id) REFERENCES students(student_id),
--     FOREIGN KEY (class_id) REFERENCES classes(class_id),
--     FOREIGN KEY (recorded_by) REFERENCES teachers(teacher_id)
-- );

-- -- Payments Table
-- CREATE TABLE IF NOT EXISTS payments (
--     payment_id VARCHAR(20) PRIMARY KEY,
--     parent_id VARCHAR(20) NOT NULL,
--     student_id VARCHAR(20) NOT NULL,
--     amount DECIMAL(10,2) NOT NULL,
--     payment_date DATE NOT NULL,
--     purpose ENUM('tuition', 'uniform', 'activities', 'other') NOT NULL,
--     status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
--     receipt_url VARCHAR(255),
--     FOREIGN KEY (parent_id) REFERENCES parents(parent_id),
--     FOREIGN KEY (student_id) REFERENCES students(student_id)
-- );

-- -- Indexes for frequently queried columns
-- CREATE INDEX idx_student_name ON students(first_name, last_name);
-- CREATE INDEX idx_teacher_subject ON classes(teacher_id, subject_id);
-- CREATE INDEX idx_enrollment_status ON enrollments(status);