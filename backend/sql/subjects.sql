CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT(10) NOT NULL PRIMARY KEY,
    subject_name VARVARCHAR(255) NOT NULL,
    grade_level VARVARCHAR(255),
    subject_status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

    FOREIGN KEY (grade_level) REFERENCES grade_level(grade_level)
);