CREATE TABLE IF NOT EXISTS certficates (
    certficate_id VARVARCHAR(10) NOT NULL PRIMARY KEY,
    student_id VARVARCHAR(10) NOT NULL,
    first_name VARVARCHAR(255) NOT NULL,
    middle_name VARVARCHAR(255),
    last_name VARVARCHAR(255) NOT NULL,
    exam_id VARVARCHAR(10) NOT NULL,
    grade_level VARVARCHAR(10) NOT NULL,
    subject_name VARVARCHAR(10) NOT NULL,
    section_name VARVARCHAR(50) NOT NULL,
    exam_type ENUM('Test', 'Quiz', 'Midterm', 'Final', 'Assessment') NOT NULL,
    score DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students_info(student_id),
    FOREIGN KEY (first_name) REFERENCES students_info(first_name),
    FOREIGN KEY (middle_name) REFERENCES students_info(middle_name),
    FOREIGN KEY (last_name) REFERENCES students_info (last_name),
    FOREIGN KEY (section_name) REFERENCES sections(section_name),
    FOREIGN KEY (subject_name) REFERENCES subjects(subject_name),
    FOREIGN KEY (grade_level) REFERENCES grade_level(grade_level),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
    
);