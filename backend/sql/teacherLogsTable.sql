-- Create the table
CREATE TABLE IF NOT EXISTS teacher_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARVARCHAR(10) NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) 
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Add the index (optional but recommended)
CREATE INDEX idx_employee_id ON teacher_logs(employee_id);