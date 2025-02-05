CREATE TABLE IF NOT EXISTS results (
    result_id VARCHAR(10) NOT NULL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    exam_id VARCHAR(10) NOT NULL,
    grade_level VARVARCHAR(50) NOT NULL,
    subject_id VARCHAR(10) NOT NULL,
    class VARVARCHAR(50) NOT NULL,
    section VARVARCHAR(50) NOT NULL,
    exam_type ENUM('Test', 'Quiz', 'Midterm', 'Final', 'Assessment') NOT NULL,
    score DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
);

-- Add index for faster queries by student_id
CREATE INDEX idx_student_id ON results(student_id);

-- Add index for faster queries by exam_id
CREATE INDEX idx_exam_id ON results(exam_id);

-- Add index for faster queries by subject
CREATE INDEX idx_subject ON results(subject);

-- Add index for faster queries by grade_level
CREATE INDEX idx_grade_level ON results(grade_level);

-- Add index for faster queries by class
CREATE INDEX idx_class ON results(class);

-- Add index for faster queries by section
CREATE INDEX idx_section ON results(section);

-- Add index for faster queries by exam_type    
CREATE INDEX idx_exam_type ON results(exam_type);