CREATE TABLE IF NOT EXISTS auth_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,         -- Format: TYPE_ID (STU123, EMP456, etc)
    user_type ENUM('student', 'employee', 'admin', 'parent') NOT NULL,
    action ENUM('login', 'logout', 'token_refresh') NOT NULL,
    success BOOLEAN NOT NULL,             -- 1=success, 0=failure
    user_agent TEXT,
    ip_address VARCHAR(45),               -- Supports IPv6 (45 chars)
    metadata JSON,                        -- Store additional context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    FOREIGN
);

-- Indexes for faster querying
CREATE INDEX idx_auth_user ON auth_logs(user_id);
CREATE INDEX idx_auth_success ON auth_logs(success);
CREATE INDEX idx_auth_created ON auth_logs(created_at);