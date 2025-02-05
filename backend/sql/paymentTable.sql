CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(10) NOT NULL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,  -- Added deadline field
    payment_method ENUM('Cash', 'Credit Card', 'Bank Transfer'),  -- Added payment method
    payment_status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    description VARVARCHAR(255),
    payment_purpose VARVARCHAR(255)  -- Added payment purpose
    FOREIGN KEY (student_id) 
        REFERENCES students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Add index for faster student-based queries
CREATE INDEX idx_student_id ON payments(student_id);