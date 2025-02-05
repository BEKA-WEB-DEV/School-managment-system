const { Result, Student, Exam, Subject } = require("../models");
const { logger } = require("../utils/logger");
const { Op } = require("sequelize");

const resultController = {
  // Record exam result
  createResult: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { student_id, exam_id, ...resultData } = req.body;

      // Validate student and exam exist
      const [student, exam] = await Promise.all([
        Student.findByPk(student_id, { transaction }),
        Exam.findByPk(exam_id, { transaction }),
      ]);

      if (!student || !exam) {
        await transaction.rollback();
        return res.status(404).json({ error: "Student or Exam not found" });
      }

      // Validate score range
      if (resultData.score < 0 || resultData.score > 100) {
        await transaction.rollback();
        return res.status(400).json({ error: "Invalid score (0-100 only)" });
      }

      const result = await Result.create(
        {
          result_id: `RES${Date.now().toString().slice(-7)}`,
          student_id,
          exam_id,
          grade_level: exam.grade_level,
          subject_name: exam.subject_name,
          section_name: exam.section_name,
          exam_type: exam.exam_type,
          ...resultData,
        },
        { transaction }
      );

      await transaction.commit();
      logger.info(`Result recorded: ${result.result_id}`);
      res.status(201).json(result);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Result creation error: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Get result by ID
  getResultById: async (req, res) => {
    try {
      const result = await Result.findByPk(req.params.id, {
        include: [
          { model: Student, as: "student" },
          { model: Exam, as: "exam" },
          { model: Subject, as: "Subject" },
        ],
      });
      if (!result) return res.status(404).json({ error: "Result not found" });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update result
  updateResult: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const result = await Result.findByPk(req.params.id, { transaction });
      if (!result) {
        await transaction.rollback();
        return res.status(404).json({ error: "Result not found" });
      }

      if (req.body.score) {
        if (req.body.score < 0 || req.body.score > 100) {
          await transaction.rollback();
          return res.status(400).json({ error: "Invalid score value" });
        }
      }

      await result.update(req.body, { transaction });
      await transaction.commit();
      res.json(result);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Result update error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get student's academic results
  getStudentResults: async (req, res) => {
    try {
      const { student_id } = req.params;
      const { subject, exam_type, page = 1, limit = 20 } = req.query;

      const where = { student_id };
      if (subject) where.subject_name = subject;
      if (exam_type) where.exam_type = exam_type;

      const results = await Result.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [
          { model: Exam, as: "exam" },
          { model: Subject, as: "Subject" },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json({
        total: results.count,
        page: parseInt(page),
        totalPages: Math.ceil(results.count / limit),
        data: results.rows,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get class/subject performance report
  getClassPerformance: async (req, res) => {
    try {
      const { grade_level, subject_name } = req.query;

      const performance = await Result.findAll({
        where: { grade_level, subject_name },
        attributes: [
          [sequelize.fn("AVG", sequelize.col("score")), "class_average"],
          [sequelize.fn("MAX", sequelize.col("score")), "top_score"],
          [sequelize.fn("MIN", sequelize.col("score")), "lowest_score"],
          [sequelize.fn("COUNT", sequelize.col("result_id")), "total_students"],
        ],
        include: [
          {
            model: Student,
            as: "student",
            attributes: [],
          },
        ],
      });

      res.json(performance[0]);
    } catch (error) {
      logger.error(`Performance report error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Approve result (Admin only)
  approveResult: async (req, res) => {
    try {
      const result = await Result.findByPk(req.params.id);
      if (!result) return res.status(404).json({ error: "Result not found" });

      await result.update({ is_approved: true });
      logger.info(`Result approved: ${result.result_id}`);
      res.json(result);
    } catch (error) {
      logger.error(`Result approval error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = resultController;
