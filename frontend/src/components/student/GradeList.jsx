import styles from './GradeList.module.css';

const GradeList = ({ grades }) => {
  return (
    <div className={styles.gradeList}>
      <h3>Grades</h3>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Grade</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.subject}</td>
              <td>{grade.grade}</td>
              <td>{grade.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeList;