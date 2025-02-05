const { exam, Employee, Result, sequelize } = require("../models");
const { logger } = require("../utils/logger");
const { Op } = require("sequelize");

const examController = {
  // Schedule new exam
  createExam: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { employee_id, ...examData } = req.body;

      // Validate teacher exists and is active
      const teacher = await Employee.findOne({
        where: { employee_id, status: "Active" },
        transaction,
      });

      if (!teacher) {
        await transaction.rollback();
        return res.status(400).json({ error: "Invalid or inactive teacher" });
      }

      // Validate exam datetime
      if (new Date(examData.exam_datetime) < new Date()) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ error: "Exam datetime cannot be in the past" });
      }

      // Check for scheduling conflicts
      const conflict = await exam.findOne({
        where: {
          grade_level: examData.grade_level,
          section_name: examData.section_name,
          exam_datetime: {
            [Op.between]: [
              new Date(examData.exam_datetime),
              new Date(
                new Date(examData.exam_datetime).getTime() +
                  examData.duration * 60000
              ),
            ],
          },
        },
        transaction,
      });

      if (conflict) {
        await transaction.rollback();
        return res.status(409).json({
          error: "Scheduling conflict",
          conflictingExam: conflict.exam_id,
        });
      }

      // Create new exam
      const exam = await exam.create(
        {
          exam_id: `EXM${Date.now().toString().slice(-7)}`,
          employee_id,
          ...examData,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json(exam);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Exam creation error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update exam details
  updateExam: async (req, res) => {
    try {
      const exam = await exam.findByPk(req.params.id);
      if (!exam) return res.status(404).json({ error: "Exam not found" });

      // Prevent modification of completed exams
      if (exam.status === "Completed") {
        return res.status(400).json({ error: "Cannot modify completed exams" });
      }

      await exam.update(req.body);
      res.json(exam);
    } catch (error) {
      logger.error(`Exam update error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get exam schedule with filters
  getExams: async (req, res) => {
    try {
      const { page = 1, limit = 20, grade, subject, type, status } = req.query;
      const where = {};

      if (grade) where.grade_level = grade;
      if (subject) where.subject_name = subject;
      if (type) where.exam_type = type;
      if (status) where.status = status;

      const exams = await exam.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [
          { model: Employee, as: "teacher" },
          { association: "Results" },
        ],
      });

      res.json({
        total: exams.count,
        page: parseInt(page),
        totalPages: Math.ceil(exams.count / limit),
        data: exams.rows,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Calculate exam results
  calculateResults: async (req, res) => {
    try {
      const exam = await exam.findByPk(req.params.id, {
        include: [Result],
      });

      if (!exam) return res.status(404).json({ error: "Exam not found" });

      const summary = await Result.findAll({
        where: { exam_id: req.params.id },
        attributes: [
          [sequelize.fn("AVG", sequelize.col("score")), "average"],
          [sequelize.fn("MAX", sequelize.col("score")), "highest"],
          [sequelize.fn("MIN", sequelize.col("score")), "lowest"],
        ],
      });

      res.json({
        exam_id: exam.exam_id,
        total_students: exam.Results.length,
        ...summary[0].dataValues,
      });
    } catch (error) {
      logger.error(`Result calculation error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Generate exam report
  generateReport: async (req, res) => {
    try {
      const exam = await exam.findByPk(req.params.id, {
        include: [
          {
            association: "Results",
            include: [Student],
          },
        ],
      });

      if (!exam) return res.status(404).json({ error: "Exam not found" });

      // Generate CSV report
      const csvHeader = "Student ID,Student Name,Score\n";
      const csvRows = exam.Results.map(
        (result) =>
          `${result.student_id},"${result.Student.first_name} ${result.Student.last_name}",${result.score}`
      ).join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${exam.exam_id}_report.csv`
      );
      res.send(csvHeader + csvRows);
    } catch (error) {
      logger.error(`Report generation error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Cancel scheduled exam
  cancelExam: async (req, res) => {
    try {
      const exam = await exam.findByPk(req.params.id);
      if (!exam) return res.status(404).json({ error: "Exam not found" });

      if (exam.status !== "Scheduled") {
        return res
          .status(400)
          .json({ error: "Only scheduled exams can be cancelled" });
      }

      await exam.update({ status: "Cancelled" });
      res.json({ message: "Exam cancelled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = examController;
