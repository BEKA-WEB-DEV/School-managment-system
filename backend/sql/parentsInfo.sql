CREATE TABLE IF NOT EXISTS parents_info (
    parent_id VARCHAR(10) NOT NULL PRIMARY KEY,
    father_first_name VARVARCHAR(255) NOT NULL,
    father_middle_name VARVARCHAR(255),
    father_last_name VARVARCHAR(255) NOT NULL,
    mother_first_name VARVARCHAR(255) NOT NULL,
    mother_middle_name VARVARCHAR(255),
    mother_last_name VARVARCHAR(255) NOT NULL,
    email VARVARCHAR(255) NOT NULL,
    phone VARVARCHAR(20) NOT NULL,
    relationship ENUM('Parent', 'Guardian') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);