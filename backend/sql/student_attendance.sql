CREATE TABLE IF NOT EXISTS student_attendance (
    student_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Excused', 'Late') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, date), -- Prevent duplicates
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);