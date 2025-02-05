const bcrypt = require("bcryptjs");
const { Employee, EmployeeInfo } = require("../models");
const { logger } = require("../utils/logger");

const employeeController = {
  // Create employee with info
  createEmployee: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { password, ...employeeData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Validate employee ID format according to there role eg. ADM1234567 for Admin, REG1234567 for Registrar, etc.

      // Check if employee ID format is valid
      if (!/^ADM\d{7}$/.test(employeeData.employee_id)) {
        await transaction.rollback();
        return res.status(400).json({ error: "Invalid employee ID format" });
      } else if (!/^REG\d{7}$/.test(employeeData.employee_id)) {
        await transaction.rollback();
        return res.status(400).json({ error: "Invalid employee ID format" });
      } else if (!/^TEA\d{7}$/.test(employeeData.employee_id)) {
        await transaction.rollback();
        return res.status(400).json({ error: "Invalid employee ID format" });
      } else if (!/^ACA\d{7}$/.test(employeeData.employee_id)) {
        await transaction.rollback();
        return res.status(400).json({ error: "Invalid employee ID format" });
      }

      // Check if employee already exists
      const existingEmployee = await Employee.findOne({
        where: { employee_id: employeeData.employee_id },
      });
      if (existingEmployee) {
        await transaction.rollback();
        return res.status(409).json({ error: "Employee already exists" });
      }

      const employee = await Employee.create(
        {
          ...employeeData,
          password: hashedPassword,
        },
        { transaction }
      );

      await EmployeeInfo.create(
        {
          employee_id: employee.employee_id,
          ...req.body,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json(employee);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Employee creation error: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Get all employees with pagination
  getAllEmployees: async (req, res) => {
    try {
      const { page = 1, limit = 20, role } = req.query;
      const whereClause = role ? { role } : {};

      const employees = await Employee.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [{ model: EmployeeInfo, as: "details" }],
      });

      res.json({
        total: employees.count,
        page: parseInt(page),
        totalPages: Math.ceil(employees.count / limit),
        data: employees.rows,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get single employee
  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id, {
        include: [{ model: EmployeeInfo, as: "details" }],
      });

      if (!employee)
        return res.status(404).json({ error: "Employee not found" });
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update employee profile
  updateEmployee: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const employee = await Employee.findByPk(req.params.id, { transaction });
      if (!employee)
        return res.status(404).json({ error: "Employee not found" });

      // Update password if provided
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      await employee.update(req.body, { transaction });
      await EmployeeInfo.update(req.body, {
        where: { employee_id: req.params.id },
        transaction,
      });

      await transaction.commit();
      res.json(employee);
    } catch (error) {
      await transaction.rollback();
      logger.error(`Employee update error: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Update salary (Admin only)
  updateSalary: async (req, res) => {
    try {
      const employee = await EmployeeInfo.findByPk(req.params.id);
      if (!employee)
        return res.status(404).json({ error: "Employee not found" });

      const { current_salary } = req.body;
      if (isNaN(current_salary)) {
        return res.status(400).json({ error: "Invalid salary format" });
      }

      await employee.update({ current_salary });
      logger.info(`Salary updated for ${req.params.id}`);
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  // Deactivate employee
  deactivateEmployee: async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee)
        return res.status(404).json({ error: "Employee not found" });

      await employee.update({ status: "Inactive" });
      logger.warn(`Employee deactivated: ${req.params.id}`);
      res.json({ message: "Employee deactivated" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = employeeController;
