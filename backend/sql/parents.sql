CREATE TABLE IF NOT EXISTS parents(
    parent_id VARCHAR(10) NOT NULl,
    student_id VARCHAR(10) NOT NULL,
    parent_password VARVARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES parents_info(parent_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
    
);