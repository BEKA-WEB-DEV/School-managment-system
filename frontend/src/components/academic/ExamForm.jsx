import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ExamForm.module.css';

const ExamForm = ({ onSubmit }) => {
  const [examData, setExamData] = useState({
    examType: 'quiz',
    date: '',
    classId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(examData);
  };

  return (
    <form className={styles.examForm} onSubmit={handleSubmit}>
      <select 
        value={examData.examType}
        onChange={(e) => setExamData({...examData, examType: e.target.value})}
        className={styles.select}
      >
        <option value="midterm">Midterm</option>
        <option value="final">Final</option>
        <option value="quiz">Quiz</option>
      </select>
      
      <Input
        type="date"
        value={examData.date}
        onChange={(e) => setExamData({...examData, date: e.target.value})}
        required
      />
      
      <Input
        placeholder="Class ID"
        value={examData.classId}
        onChange={(e) => setExamData({...examData, classId: e.target.value})}
        required
      />
      
      <Button type="submit">Schedule Exam</Button>
    </form>
  );
};

export default ExamForm;