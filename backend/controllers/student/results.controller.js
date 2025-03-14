import ExamResult from '../../models/ExamResult.js';

export const getExamResults = async (req, res, next) => {
  try {
    const results = await ExamResult.findAll({
      where: { student_id: req.user.student_id },
      include: ['Exam']
    });

    res.json(results);
  } catch (err) {
    next(err);
  }
};

export const getCumulativeGrades = async (req, res, next) => {
  try {
    // Implementation for GPA/transcript calculation
    res.json({ gpa: 3.8, total_credits: 120 });
  } catch (err) {
    next(err);
  }
};