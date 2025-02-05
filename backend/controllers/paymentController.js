const { Payment, Student } = require("../models");
const { logger } = require("../utils/logger");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Op } = require("sequelize");

const paymentController = {
  // Create payment record
  createPayment: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { student_id, ...paymentData } = req.body;

      // Validate student exists
      const student = await Student.findByPk(student_id, { transaction });
      if (!student) {
        await transaction.rollback();
        return res.status(404).json({ error: "Student not found" });
      }

      // Check for duplicate payments
      const existingPayment = await Payment.findOne({
        where: {
          student_id,
          payment_purpose: paymentData.payment_purpose,
          due_date: paymentData.due_date,
        },
        transaction,
      });

      if (existingPayment) {
        await transaction.rollback();
        return res.status(409).json({ error: "Duplicate payment record" });
      }

      const payment = await Payment.create(
        {
          payment_id: `PAY${Date.now().toString().slice(-7)}`,
          student_id,
          ...paymentData,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json(payment);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Payment creation error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Process online payment
  processPayment: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) return res.status(404).json({ error: "Payment not found" });

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: payment.amount * 100,
        currency: "usd",
        metadata: { payment_id: payment.payment_id },
      });

      await payment.update({
        transaction_id: paymentIntent.id,
        payment_method: "Online",
      });

      res.json({
        client_secret: paymentIntent.client_secret,
        payment_id: payment.payment_id,
      });
    } catch (error) {
      logger.error(`Payment processing error: ${error.message}`);
      res.status(500).json({ error: "Payment processing failed" });
    }
  },

  // Get payments with filters
  getPayments: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, student_id, method } = req.query;
      const where = {};

      if (status) where.payment_status = status;
      if (student_id) where.student_id = student_id;
      if (method) where.payment_method = method;

      const payments = await Payment.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [{ model: Student, as: "student" }],
      });

      res.json({
        total: payments.count,
        page: parseInt(page),
        totalPages: Math.ceil(payments.count / limit),
        data: payments.rows,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update payment status
  updatePaymentStatus: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) return res.status(404).json({ error: "Payment not found" });

      // Validate status transition
      const allowedTransitions = {
        Pending: ["Completed", "Failed"],
        Failed: ["Pending"],
        Completed: ["Refunded"],
      };

      if (
        !allowedTransitions[payment.payment_status]?.includes(
          req.body.payment_status
        )
      ) {
        return res.status(400).json({ error: "Invalid status transition" });
      }

      await payment.update({ payment_status: req.body.payment_status });
      res.json(payment);
    } catch (error) {
      logger.error(`Status update error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Generate financial report
  generateFinancialReport: async (req, res) => {
    try {
      const { start_date, end_date } = req.query;

      const report = await Payment.findAll({
        where: {
          payment_date: {
            [Op.between]: [new Date(start_date), new Date(end_date)],
          },
        },
        attributes: [
          "payment_method",
          [sequelize.fn("SUM", sequelize.col("amount")), "total_amount"],
          [
            sequelize.fn("COUNT", sequelize.col("payment_id")),
            "transaction_count",
          ],
        ],
        group: ["payment_method"],
      });

      res.json({
        period: `${start_date} to ${end_date}`,
        report,
      });
    } catch (error) {
      logger.error(`Report generation error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Send payment reminder
  sendPaymentReminder: async (req, res) => {
    try {
      const overduePayments = await Payment.findAll({
        where: {
          payment_status: "Pending",
          due_date: { [Op.lt]: new Date() },
        },
        include: [Student],
      });

      // TODO: Implement email/SMS notification
      logger.info(
        `Sending reminders for ${overduePayments.length} overdue payments`
      );

      res.json({
        message: `${overduePayments.length} reminders sent`,
        payments: overduePayments.map((p) => p.payment_id),
      });
    } catch (error) {
      logger.error(`Reminder error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = paymentController;
