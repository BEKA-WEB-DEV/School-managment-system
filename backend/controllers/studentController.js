const { Student, StudentInfo } = require("../models");
const { logger } = require("../utils/logger");

const studentController = {
  // Create student with info
  createStudent: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { password, ...studentData } = req.body;

      // Validate student ID format
      if (!/^STU\d{7}$/.test(studentData.student_id)) {
        await transaction.rollback();
        return res.status(400).json({ error: "Invalid student ID format" });
      }

      const student = await Student.create(
        {
          ...studentData,
          student_password: password,
        },
        { transaction }
      );

      await StudentInfo.create(
        {
          student_id: student.student_id,
          ...req.body,
        },
        { transaction }
      );

      await transaction.commit();
      logger.info(`Student created: ${student.student_id}`);
      res.status(201).json(student);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Student creation error: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Get all students (paginated)
  getAllStudents: async (req, res) => {
    try {
      const { page = 1, limit = 20, grade, section, status } = req.query;
      const where = {};

      if (grade) where.grade_level = grade;
      if (section) where.section = section;
      if (status) where.status = status;

      const students = await Student.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [{ model: StudentInfo, as: "details" }],
      });

      res.json({
        total: students.count,
        page: parseInt(page),
        totalPages: Math.ceil(students.count / limit),
        data: students.rows,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get student profile
  getStudentById: async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.id, {
        include: [
          { model: StudentInfo, as: "details" },
          { association: "Results" },
          { association: "Attendances" },
        ],
      });

      if (!student) return res.status(404).json({ error: "Student not found" });

      // Authorization check
      if (req.user.role !== "admin" && student.student_id !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json(student);
    } catch (error) {
      logger.error(`Student fetch error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update student profile
  updateStudent: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const student = await Student.findByPk(req.params.id, { transaction });
      if (!student) {
        await transaction.rollback();
        return res.status(404).json({ error: "Student not found" });
      }

      // Update password if provided
      if (req.body.password) {
        student.student_password = req.body.password;
      }

      await student.update(req.body, { transaction });
      await StudentInfo.update(req.body, {
        where: { student_id: req.params.id },
        transaction,
      });

      await transaction.commit();
      res.json(student);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Student update error: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Deactivate student
  deactivateStudent: async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.id);
      if (!student) return res.status(404).json({ error: "Student not found" });

      await student.update({ status: "Inactive" });
      logger.warn(`Student deactivated: ${req.params.id}`);
      res.json({ message: "Student deactivated" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = studentController;
