const { Admin, Employee } = require("../models");
const { logger } = require("../utils/logger");
const bcrypt = require("bcryptjs");

const adminController = {
  // Create Admin (Super Admin only)
  createAdmin: async (req, res) => {
    try {
      const { employee_id, username, password, level } = req.body;

      // Check if employee exists
      const employee = await Employee.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      // Check for existing admin
      const existingAdmin = await Admin.findOne({ where: { employee_id } });
      if (existingAdmin) {
        return res
          .status(409)
          .json({ error: "Admin already exists for this employee" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await Admin.create({
        admin_id: `ADM${Date.now().toString().slice(-7)}`,
        employee_id,
        username,
        password: hashedPassword,
        level,
      });

      res.status(201).json(admin);
    } catch (error) {
      logger.error(`Admin creation error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get Admin by ID
  getAdminById: async (req, res) => {
    try {
      const admin = await Admin.findByPk(req.params.id, {
        include: [{ model: Employee, as: "employee" }],
      });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      res.json(admin);
    } catch (error) {
      logger.error(`Admin fetch error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update Admin (Self or Super Admin)
  updateAdmin: async (req, res) => {
    try {
      const admin = await Admin.findByPk(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // Authorization check
      if (req.user.level !== "6" && admin.admin_id !== req.user.admin_id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updates = req.body;
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      await admin.update(updates);
      res.json(admin);
    } catch (error) {
      logger.error(`Admin update error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Delete Admin (Super Admin only)
  deleteAdmin: async (req, res) => {
    try {
      const admin = await Admin.findByPk(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      await admin.destroy();
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      logger.error(`Admin deletion error: ${error.message}`);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = adminController;
