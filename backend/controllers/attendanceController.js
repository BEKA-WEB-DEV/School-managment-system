const {
  StudentAttendance,
  EmployeeAttendance,
  student,
  employee,
} = require("../models");
const { logger } = require("../utils/logger");

const attendanceController = {
  // Record attendance for multiple users
  recordAttendance: async (req, res) => {
    try {
      const { userType, records } = req.body;
      const Model =
        userType === "student" ? StudentAttendance : EmployeeAttendance;

      // Validate existence of users
      const userIds = records.map((r) => r.user_id);
      const users = await (userType === "student"
        ? student.findAll({ where: { student_id: userIds } })
        : employee.findAll({ where: { employee_id: userIds } }));

      if (users.length !== records.length) {
        return res.status(404).json({ error: "Some users not found" });
      }

      const attendanceRecords = await Model.bulkCreate(records);
      logger.info(
        `${userType} attendance recorded for ${records.length} users`
      );
      res.status(201).json(attendanceRecords);
    } catch (error) {
      logger.error(`Attendance recording error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get attendance for a single user
  getAttendance: async (req, res) => {
    try {
      const { userType, userId } = req.params;
      const Model =
        userType === "student" ? StudentAttendance : EmployeeAttendance;

      const records = await Model.findAll({
        where: {
          [userType === "student" ? "student_id" : "employee_id"]: userId,
        },
        order: [["date", "DESC"]],
      });

      res.json(records);
    } catch (error) {
      logger.error(`Attendance fetch error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update attendance status
  updateAttendance: async (req, res) => {
    try {
      const { userType, userId, date } = req.params;
      const Model =
        userType === "student" ? StudentAttendance : EmployeeAttendance;

      const record = await Model.findOne({
        where: {
          [userType === "student" ? "student_id" : "employee_id"]: userId,
          date,
        },
      });

      if (!record) return res.status(404).json({ error: "Record not found" });

      await record.update({ status: req.body.status });
      logger.info(`${userType} attendance updated: ${userId} - ${date}`);
      res.json(record);
    } catch (error) {
      logger.error(`Attendance update error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Delete attendance record
  deleteAttendance: async (req, res) => {
    try {
      const { userType, userId, date } = req.params;
      const Model =
        userType === "student" ? StudentAttendance : EmployeeAttendance;

      await Model.destroy({
        where: {
          [userType === "student" ? "student_id" : "employee_id"]: userId,
          date,
        },
      });

      logger.warn(`${userType} attendance deleted: ${userId} - ${date}`);
      res.json({ message: "Attendance record deleted" });
    } catch (error) {
      logger.error(`Attendance deletion error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = attendanceController;
