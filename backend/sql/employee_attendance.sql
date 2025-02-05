CREATE TABLE IF NOT EXISTS employee_attendance (
    employee_id VARVARCHAR(10) NOT NULL,  -- Fixed data type
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Excused', 'On Leave', 'Late') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees_info(employee_id)
);

-- Add index for faster queries by employee_id
CREATE INDEX idx_employee_id ON employee_attendance(employee_id);

-- Add index for faster queries by date
CREATE INDEX idx_date ON employee_attendance(date);
