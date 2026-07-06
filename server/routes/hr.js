const express = require('express');
const router = express.Router();
const { adminAuth, superAdminAuth, hrManagementAuth } = require('../middleware/auth');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const { syncEmployeeUserLink } = require('../utils/hrEmployeeLink');

// Staff accounts available to link to an Employee record (portal login)
router.get('/linkable-users', hrManagementAuth, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name email role employeeProfile')
      .sort({ name: 1 })
      .lean();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('linkable-users error:', error);
    res.status(500).json({ success: false, message: 'Failed to load users' });
  }
});

// ========== EMPLOYEE ROUTES ==========

// Get all employees
router.get('/employees', hrManagementAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, department, search } = req.query;
    const query = {};

    if (status) query['employmentInfo.status'] = status;
    if (department) query['employmentInfo.department'] = department;
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query)
      .populate('employmentInfo.manager', 'personalInfo.firstName personalInfo.lastName employeeId')
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Employee.countDocuments(query);

    res.json({
      success: true,
      data: employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employees' });
  }
});

// Get single employee
router.get('/employees/:id', hrManagementAuth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('employmentInfo.manager', 'personalInfo.firstName personalInfo.lastName employeeId')
      .populate('createdBy', 'name email')
      .populate('user', 'name email role employeeProfile');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/employees', hrManagementAuth, async (req, res) => {
  try {
    const { user: linkUserId, ...body } = req.body;
    const employee = new Employee({
      ...body,
      createdBy: req.user._id
    });
    await employee.save();
    if (linkUserId !== undefined) {
      await syncEmployeeUserLink(employee._id, linkUserId || null);
    }
    const populated = await Employee.findById(employee._id)
      .populate('user', 'name email role employeeProfile');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update employee
router.put('/employees/:id', hrManagementAuth, async (req, res) => {
  try {
    const hasUserField = Object.prototype.hasOwnProperty.call(req.body, 'user');
    const { user: linkUserId, ...body } = req.body;
    const employee = await Employee.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    if (hasUserField) {
      await syncEmployeeUserLink(employee._id, linkUserId || null);
    }
    const populated = await Employee.findById(employee._id)
      .populate('employmentInfo.manager', 'personalInfo.firstName personalInfo.lastName employeeId')
      .populate('user', 'name email role employeeProfile');
    res.json({ success: true, data: populated });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete employee
router.delete('/employees/:id', hrManagementAuth, async (req, res) => {
  try {
    const existing = await Employee.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    await syncEmployeeUserLink(req.params.id, null);
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete employee' });
  }
});

// Get employee stats
router.get('/employees/stats', hrManagementAuth, async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: '$employmentInfo.status',
          count: { $sum: 1 }
        }
      }
    ]);

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$employmentInfo.department',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ 'employmentInfo.status': 'active' });

    res.json({
      success: true,
      data: {
        total: totalEmployees,
        active: activeEmployees,
        byStatus: stats,
        byDepartment: departmentStats
      }
    });
  } catch (error) {
    console.error('Employee stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ========== PAYROLL ROUTES ==========

// Get all payrolls
router.get('/payrolls', superAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, employee, month, year } = req.query;
    const query = {};

    if (status) query.status = status;
    if (employee) query.employee = employee;
    if (month) query['period.month'] = parseInt(month);
    if (year) query['period.year'] = parseInt(year);

    const payrolls = await Payroll.find(query)
      .populate('employee', 'personalInfo.firstName personalInfo.lastName employeeId employmentInfo.department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payroll.countDocuments(query);

    res.json({
      success: true,
      data: payrolls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payrolls error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payrolls' });
  }
});

// Get single payroll
router.get('/payrolls/:id', superAdminAuth, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employee')
      .populate('approvedBy', 'name email')
      .populate('createdBy', 'name email');

    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    res.json({ success: true, data: payroll });
  } catch (error) {
    console.error('Get payroll error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payroll' });
  }
});

// Create payroll
router.post('/payrolls', superAdminAuth, async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.employee) {
      return res.status(400).json({ success: false, message: 'Employee is required' });
    }
    if (!req.body.period || !req.body.period.startDate || !req.body.period.endDate) {
      return res.status(400).json({ success: false, message: 'Pay period is required' });
    }
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one payroll item is required' });
    }

    const payroll = new Payroll({
      ...req.body,
      createdBy: req.user._id
    });
    await payroll.save();
    await payroll.populate('employee', 'personalInfo.firstName personalInfo.lastName employeeId');
    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    console.error('Create payroll error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message || 'Failed to create payroll' });
  }
});

// Update payroll
router.put('/payrolls/:id', superAdminAuth, async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employee', 'personalInfo.firstName personalInfo.lastName employeeId');
    
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }
    res.json({ success: true, data: payroll });
  } catch (error) {
    console.error('Update payroll error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Approve payroll
router.post('/payrolls/:id/approve', superAdminAuth, async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('employee', 'personalInfo.firstName personalInfo.lastName employeeId');
    
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }
    res.json({ success: true, data: payroll });
  } catch (error) {
    console.error('Approve payroll error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get payroll stats
router.get('/payrolls/stats', superAdminAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = {};
    if (month) query['period.month'] = parseInt(month);
    if (year) query['period.year'] = parseInt(year);

    const stats = await Payroll.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalNetSalary: { $sum: '$netSalary' }
        }
      }
    ]);

    const totalPayrolls = await Payroll.countDocuments(query);
    const totalNetSalary = await Payroll.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$netSalary' } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalPayrolls,
        totalNetSalary: totalNetSalary[0]?.total || 0,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Payroll stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ========== ATTENDANCE ROUTES ==========

// Get all attendance records
router.get('/attendance', hrManagementAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, employee, startDate, endDate, status } = req.query;
    const query = {};

    if (employee) query.employee = employee;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (status) query.status = status;

    const attendance = await Attendance.find(query)
      .populate('employee', 'personalInfo.firstName personalInfo.lastName employeeId employmentInfo.department')
      .populate('approvedBy', 'name email')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
});

// Get single attendance record
router.get('/attendance/:id', hrManagementAuth, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('employee')
      .populate('approvedBy', 'name email');

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
});

// Create attendance record
router.post('/attendance', hrManagementAuth, async (req, res) => {
  try {
    const attendance = new Attendance({
      ...req.body,
      createdBy: req.user._id
    });
    await attendance.save();
    await attendance.populate('employee', 'personalInfo.firstName personalInfo.lastName employeeId');
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Create attendance error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update attendance record
router.put('/attendance/:id', hrManagementAuth, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employee', 'personalInfo.firstName personalInfo.lastName employeeId');
    
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get attendance stats
router.get('/attendance/stats', hrManagementAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$totalHours' },
          totalOvertime: { $sum: '$overtimeHours' }
        }
      }
    ]);

    const totalRecords = await Attendance.countDocuments(query);
    const totalHours = await Attendance.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$totalHours' } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalRecords,
        totalHours: totalHours[0]?.total || 0,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Attendance stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

module.exports = router;

