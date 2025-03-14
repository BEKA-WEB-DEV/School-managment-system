import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ExamSubmitForm.module.css';

const ExamSubmitForm = ({ onSubmit }) => {
  const [examData, setExamData] = useState({
    exam_id: '',
    marks: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(examData);
  };

  return (
    <form className={styles.examSubmitForm} onSubmit={handleSubmit}>
      <Input
        placeholder="Exam ID"
        value={examData.exam_id}
        onChange={(e) => setExamData({ ...examData, exam_id: e.target.value })}
        required
      />
      <Input
        placeholder="Marks"
        value={examData.marks}
        onChange={(e) => setExamData({ ...examData, marks: e.target.value })}
        required
      />
      <Button type="submit">Submit Exam</Button>
    </form>
  );
};

export default ExamSubmitForm;