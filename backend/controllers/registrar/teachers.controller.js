import Teacher from '../../models/Teacher.js';
import User from '../../models/User.js';

export const registerTeacher = async (req, res, next) => {
  try {
    const { user_id, ...teacherData } = req.body;
    
    if (req.user.role !== 'admin' && req.user.role !== 'registrar') {
      throw new ForbiddenError('Insufficient permissions');
    }
    // Verify user exists and has teacher role
    const user = await User.findByPk(user_id);
    if (!user || user.role !== 'teacher') {
      return res.status(400).json({ error: 'Invalid teacher user account' });
    }

    const teacher = await Teacher.create({
      teacher_id: `TCH_${Date.now()}`,
      user_id,
      ...teacherData
    });

    res.status(201).json(teacher);
  } catch (err) {
    next(err);
  }
};

export const updateTeacherProfile = async (req, res, next) => {
  try {
    const { teacher_id } = req.params;
    const updates = req.body;

    const teacher = await Teacher.findByPk(teacher_id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    await teacher.update(updates);
    res.json(teacher);
  } catch (err) {
    next(err);
  }
};

export const listTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (err) {
    next(err);
  }
};

export const getTeacherDetails = async (req, res, next) => {
  try {
    const { teacher_id } = req.params;
    const teacher = await Teacher.findByPk(teacher_id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    next(err);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const { teacher_id } = req.params;
    const teacher = await Teacher.findByPk(teacher_id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    await teacher.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};