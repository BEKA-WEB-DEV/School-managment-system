const { Promotion, Student, Employee } = require("../models");
const { logger } = require("../utils/logger");
const { Op } = require("sequelize");

const promotionController = {
  // Create promotion request
  createPromotion: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { student_id, current_grade, requested_grade } = req.body;

      // Verify student's current grade
      const student = await Student.findByPk(student_id, { transaction });
      if (student.grade_level !== current_grade) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Student current grade mismatch",
        });
      }

      // Validate grade progression
      const gradeOrder = [
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade",
      ];

      const currentIndex = gradeOrder.indexOf(current_grade);
      const requestedIndex = gradeOrder.indexOf(requested_grade);

      if (Math.abs(requestedIndex - currentIndex) !== 1) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Invalid grade transition",
        });
      }

      const promotion = await Promotion.create(
        {
          ...req.body,
          requested_by: req.user.employee_id,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json(promotion);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Promotion creation error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get all promotions with filters
  getAllPromotions: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, student_id, grade } = req.query;

      const where = {};
      if (status) where.status = status;
      if (student_id) where.student_id = student_id;
      if (grade)
        where[Op.or] = [{ current_grade: grade }, { requested_grade: grade }];

      const promotions = await Promotion.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [
          { model: Student, as: "student" },
          { model: Employee, as: "requester" },
          { model: Employee, as: "approver" },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json({
        total: promotions.count,
        page: parseInt(page),
        totalPages: Math.ceil(promotions.count / limit),
        data: promotions.rows,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update promotion status (Admin only)
  updatePromotionStatus: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const promotion = await Promotion.findByPk(req.params.id, {
        transaction,
      });
      if (!promotion) {
        await transaction.rollback();
        return res.status(404).json({ error: "Promotion not found" });
      }

      const { status, comments } = req.body;

      // Validate status transition
      if (promotion.status === "Approved" && status !== "Approved") {
        await transaction.rollback();
        return res.status(400).json({
          error: "Cannot modify approved promotion",
        });
      }

      // Update promotion
      await promotion.update(
        {
          status,
          comments,
          approved_by: req.user.employee_id,
          approved_at: new Date(),
        },
        { transaction }
      );

      // If approved, update student grade
      if (status === "Approved") {
        await Student.update(
          { grade_level: promotion.requested_grade },
          { where: { student_id: promotion.student_id }, transaction }
        );
      }

      await transaction.commit();
      res.json(promotion);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Promotion update error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get promotion history for student
  getStudentPromotionHistory: async (req, res) => {
    try {
      const promotions = await Promotion.findAll({
        where: { student_id: req.params.studentId },
        include: [
          { model: Employee, as: "requester" },
          { model: Employee, as: "approver" },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json(promotions);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = promotionController;
