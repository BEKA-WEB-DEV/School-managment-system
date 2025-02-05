CREATE TABLE IF NOT EXISTS parent_student_association (
    student_id VARCHAR(10) NOT NULL,
    parent_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (student_id, parent_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(parent_id) ON DELETE CASCADE
);
