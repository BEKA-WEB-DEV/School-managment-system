CREATE TABLE IF NOT EXISTS employees_password_and_autorized_leave (
    employee_id VARVARCHAR(10) NOT NULL,
    employee_password VARVARCHAR(255) NOT NULL,
    autorized_leave ENUM('4', '3', '2', '1', '0') DEFAULT '0',
    employee_status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    
);