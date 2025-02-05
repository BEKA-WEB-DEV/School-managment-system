CREATE TABLE IF NOT EXISTS exams (
    exam_id VARVARCHAR(10) NOT NULL PRIMARY KEY,
    grade_level VARVARCHAR(50) NOT NULL,
    subject_name VARVARCHAR(10) NOT NULL,
    section_name VARVARCHAR(50) NOT NULL,
    exam_type ENUM('Test', 'Quiz', 'Midterm', 'Final', 'Assessment') NOT NULL,
    exam_datetime DATETIME NOT NULL, -- Combines date + time
    employee_id INT(10) NOT NULL, -- Teacher creating the exam
    school_year_id INT(10) NOT NULL,
    semester ENUM('1st Semester', '2nd Semester', '3rd Semester', '4th Semester') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES teachers(employee_id),
    FOREIGN KEY (school_year_id) REFERENCES school_year(school_year_id),
    FOREIGN KEY (grade_level) REFERENCES grade_level(grade_level),
    FOREIGN KEY (section_name) REFERENCES sections(section_name),
    FOREIGN KEY (subject_name) REFERENCES subjects(subject_name)
);

-- Add index for faster queries by exam_id
CREATE INDEX idx_exam_id ON exams(exam_id);

-- Add index for faster queries by grade_level  
CREATE INDEX idx_grade_level ON exams(grade_level);

-- Add index for faster queries by subject
CREATE INDEX idx_subject ON exams(subject);

-- Add index for faster queries by class
CREATE INDEX idx_class ON exams(class);

-- Add index for faster queries by section
CREATE INDEX idx_section ON exams(section);

-- Add index for faster queries by exam_type
CREATE INDEX idx_exam_type ON exams(exam_type);

-- Add index for faster queries bt semester
CREATE INDEX idx_semester ON exams(semester);