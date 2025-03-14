import Enrollment from '../../models/Enrollment.js';
import Class from '../../models/Class.js';

export const getStudentSchedule = async (req, res, next) => {
  try {
    const schedule = await Enrollment.findAll({
      where: { student_id: req.user.student_id },
      include: [{
        model: Class,
        attributes: ['class_name', 'schedule', 'academic_year'],
        include: ['Subject']
      }]
    });

    res.json(schedule);
  } catch (err) {
    next(err);
  }
};