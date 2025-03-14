import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './AttendanceForm.module.css';

const AttendanceForm = ({ classId, students, onSubmit }) => {
  const [attendance, setAttendance] = useState(
    students.map(student => ({ student_id: student.id, status: 'present' }))
  );

  const handleStatusChange = (index, status) => {
    const newAttendance = [...attendance];
    newAttendance[index].status = status;
    setAttendance(newAttendance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      classId,
      date: new Date().toISOString().split('T')[0],
      records: attendance
    });
  };

  return (
    <form className={styles.attendanceForm} onSubmit={handleSubmit}>
      <h3>Class Attendance</h3>
      <div className={styles.studentList}>
        {students.map((student, index) => (
          <div key={student.id} className={styles.studentItem}>
            <span>{student.name}</span>
            <select
              value={attendance[index].status}
              onChange={(e) => handleStatusChange(index, e.target.value)}
              className={styles.statusSelect}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
            </select>
          </div>
        ))}
      </div>
      <Button type="submit">Submit Attendance</Button>
    </form>
  );
};

export default AttendanceForm;