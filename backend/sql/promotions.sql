CREATE TABLE IF NOT EXISTS promotions (
  promotion_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(10) NOT NULL,
  current_grade ENUM('1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade') NOT NULL,
  requested_grade ENUM('1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade') NOT NULL,
  reason ENUM('Passed', 'Failed') NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  requested_by VARCHAR(10) NOT NULL,
  approved_by VARCHAR(10),
  approved_at DATETIME,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (requested_by) REFERENCES employees(employee_id),
  FOREIGN KEY (approved_by) REFERENCES employees(employee_id)
);

CREATE INDEX idx_promotion_status ON promotions(status);
CREATE INDEX idx_promotion_student ON promotions(student_id);