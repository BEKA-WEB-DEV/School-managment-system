CREATE TABLE IF NOT EXISTS employees (
    employee_id VARVARCHAR(10) NOT NULL PRIMARY KEY,
    password VARVARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Registrar', 'Academic', 'Teacher') DEFAULT 'Teacher',
    level ENUM('5', '4', '3', '2') DEFAULT '2', -- 5=Admin, 4=Registrar, 3=Academic, 2=Teacher
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    -- ... other fields from employees_info
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);