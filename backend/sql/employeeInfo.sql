CREATE TABLE IF NOT EXISTS employees_info (
    employee_id VARVARCHAR(10) NOT NULL PRIMARY KEY,
    first_name VARVARCHAR(255) NOT NULL,
    middle_name VARVARCHAR(255),
    last_name VARVARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARVARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown') NOT NULL,
    address VARVARCHAR(255) NOT NULL,
    religion VARVARCHAR(50) NOT NULL,
    initial_salary DECIMAL(10, 2) NOT NULL,
    current_salary DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add index for faster queries by employee_id
CREATE INDEX idx_employee_id ON employees(employee_id);

-- Add index for faster queries by role
CREATE INDEX idx_role ON employees(role);

-- Add index for faster queries by status
CREATE INDEX idx_status ON employees(status);

-- Add index for faster queries by gender
CREATE INDEX idx_gender ON employees(gender);
