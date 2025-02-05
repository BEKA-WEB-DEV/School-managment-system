CREATE TABLE IF NOT EXISTS admins (
    admin_id VARVARCHAR(10) AUTO_INCREMENT PRIMARY KEY,
    employee_id INT(10) NOT NULL,
    username VARVARCHAR(50) UNIQUE NOT NULL,
    password VARVARCHAR(255) NOT NULL,
    level ENUM('6', '5', '4') DEFAULT '4', -- 6=Super Admin, 5=Admin, 4=Registrar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);