CREATE TABLE IF NOT EXISTS students_info (
    student_id VARCHAR(10) NOT NULL PRIMARY KEY,
    first_name VARVARCHAR(255) NOT NULL,
    middle_name VARVARCHAR(255),
    last_name VARVARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARVARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown') NOT NULL,
    address VARVARCHAR(255) NOT NULL,
    religion status ENUM('Muslim', 'Christian', 'Jewish', 'Others') NOT NULL,
    status ENUM('is registered', 'not registered') DEFAULT 'active', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add index for faster queries by student_id
CREATE INDEX idx_student_id ON students(student_id);

-- Add index for faster queries by grade_level \
CREATE INDEX idx_grade_level ON students(grade_level);

-- Add index for faster queries by section
CREATE INDEX idx_section ON students(section);

-- Add index for faster queries by school_year
CREATE INDEX idx_school_year ON students(school_year);

-- Add index for faster queries by status
CREATE INDEX idx_status ON students(status);

-- Add index for faster queries by class
CREATE INDEX idx_class ON students(class);

-- Add index for faster queries by gender
CREATE INDEX idx_gender ON students(gender);