const bcrypt = require("bcryptjs");
const { Parent, ParentInfo, Student, ParentStudent } = require("../models"); // Import models for parent, parent info, student, and parent-student association
const { logger } = require("../utils/logger");

const parentController = {
  // Get parent profile
  getParentProfile: async (req, res) => {
    try {
      const parent = await Parent.findByPk(req.params.id, {
        include: [
          { model: ParentInfo, as: "details" },
          { model: Student, as: "students" },
        ],
      });

      if (!parent) return res.status(404).json({ error: "Parent not found" });

      // Authorization check
      if (req.user.role !== "admin" && parent.parent_id !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json(parent);
    } catch (error) {
      logger.error(`Parent profile error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update parent profile
  updateParentProfile: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const parent = await Parent.findByPk(req.params.id, { transaction });
      if (!parent) return res.status(404).json({ error: "Parent not found" });

      // Update password if provided
      if (req.body.parent_password) {
        req.body.parent_password = await bcrypt.hash(
          req.body.parent_password,
          10
        );
      }

      await parent.update(req.body, { transaction });
      await ParentInfo.update(req.body, {
        where: { parent_id: req.params.id },
        transaction,
      });

      await transaction.commit();
      res.json(parent);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Parent update error: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Get linked students
  getLinkedStudents: async (req, res) => {
    try {
      const parent = await Parent.findByPk(req.params.id, {
        include: [{ model: Student, as: "students" }],
      });

      if (!parent) return res.status(404).json({ error: "Parent not found" });
      res.json(parent.students);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Add student association
  addStudentToParent: async (req, res) => {
    try {
      const { student_id } = req.body;

      // Verify student exists
      const student = await Student.findByPk(student_id);
      if (!student) return res.status(404).json({ error: "Student not found" });

      const association = await ParentStudent.create({
        parent_id: req.params.id,
        student_id,
      });

      logger.info(`Student ${student_id} added to parent ${req.params.id}`);
      res.status(201).json(association);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ error: "Association already exists" });
      }
      res.status(500).json({ error: "Server error" });
    }
  },

  // Remove student association
  removeStudentFromParent: async (req, res) => {
    try {
      const count = await ParentStudent.destroy({
        where: {
          parent_id: req.params.id,
          student_id: req.params.studentId,
        },
      });

      if (count === 0)
        return res.status(404).json({ error: "Association not found" });

      logger.warn(
        `Student ${req.params.studentId} removed from parent ${req.params.id}`
      );
      res.json({ message: "Association removed" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = parentController;
