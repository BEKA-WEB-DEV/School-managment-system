CREATE TABLE IF NOT EXISTS students (
    student_id VARVARCHAR(10) NOT NULL,
    student_password VARVARCHAR(255) NOT NULL,
    grade_level VARVARCHAR(50) NOT NULL,
    section VARVARCHAR(50) NOT NULL,
    school_year VARVARCHAR(50) NOT NULL,
    student_status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

    FOREIGN KEY (student_id) REFERENCES students_info(student_id),
    FOREIGN KEY (grade_level) REFERENCES grade_level(grade_level),
    FOREIGN KEY (section) REFERENCES sections(section),
    FOREIGN KEY (school_year) REFERENCES school_year(school_year)
    
);