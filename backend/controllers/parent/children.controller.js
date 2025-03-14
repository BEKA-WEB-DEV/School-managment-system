import Student from '../../models/Student.js';

export const getChildrenDetails = async (req, res, next) => {
  try {
    const children = await Student.findAll({
      where: { parent_id: req.user.parent_id },
      include: ['User']
    });

    res.json(children);
  } catch (err) {
    next(err);
  }
};

export const updateChildInfo = async (req, res, next) => {
  try {
    const { student_id } = req.params;
    
    // Verify parent-student relationship
    const student = await Student.findOne({
      where: {
        student_id,
        parent_id: req.user.parent_id
      }
    });

    if (!student) return res.status(403).json({ error: 'Not authorized' });

    await student.update(req.body);
    res.json(student);
  } catch (err) {
    next(err);
  }
};