const express = require('express');
const router = express.Router();
const { adminAuth, superAdminAuth } = require('../middleware/auth');
const Expense = require('../models/Expense');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const FinancialReport = require('../models/FinancialReport');

// ========== EXPENSE ROUTES ==========

// Get all expenses
router.get('/expenses', superAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, startDate, endDate, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { expenseNumber: { $regex: search, $options: 'i' } },
        { 'vendor.name': { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(query)
      .populate({
        path: 'account',
        select: 'name accountNumber',
        strictPopulate: false
      })
      .populate({
        path: 'approvedBy',
        select: 'name email',
        strictPopulate: false
      })
      .sort({ date: -1 })
      .limit(parseInt(limit) || 10)
      .skip((parseInt(page) - 1) * (parseInt(limit) || 10));

    const total = await Expense.countDocuments(query);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch expenses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single expense
router.get('/expenses/:id', superAdminAuth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('account', 'name accountNumber')
      .populate('approvedBy', 'name email')
      .populate('createdBy', 'name email');

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch expense' });
  }
});

// Create expense
router.post('/expenses', superAdminAuth, async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      createdBy: req.user._id
    });
    await expense.save();
    await expense.populate('account', 'name accountNumber');
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update expense
router.put('/expenses/:id', superAdminAuth, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('account', 'name accountNumber');
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Approve expense
router.post('/expenses/:id/approve', superAdminAuth, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('account', 'name accountNumber');
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    console.error('Approve expense error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get expense stats
router.get('/expenses/stats', superAdminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const stats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const statusStats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalExpenses = await Expense.countDocuments(query);
    const totalAmount = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalExpenses,
        totalAmount: totalAmount[0]?.total || 0,
        byCategory: stats,
        byStatus: statusStats
      }
    });
  } catch (error) {
    console.error('Expense stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ========== ACCOUNT ROUTES ==========

// Get all accounts
router.get('/accounts', superAdminAuth, async (req, res) => {
  try {
    const { type, isActive, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { accountNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const accounts = await Account.find(query)
      .populate({
        path: 'createdBy',
        select: 'name email',
        strictPopulate: false
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch accounts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single account
router.get('/accounts/:id', superAdminAuth, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({ success: true, data: account });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch account' });
  }
});

// Create account
router.post('/accounts', superAdminAuth, async (req, res) => {
  try {
    const account = new Account({
      ...req.body,
      createdBy: req.user._id
    });
    await account.save();
    res.status(201).json({ success: true, data: account });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update account
router.put('/accounts/:id', superAdminAuth, async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.json({ success: true, data: account });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get account stats
router.get('/accounts/stats', superAdminAuth, async (req, res) => {
  try {
    const stats = await Account.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalBalance: { $sum: '$balance' }
        }
      }
    ]);

    const totalAccounts = await Account.countDocuments();
    const activeAccounts = await Account.countDocuments({ isActive: true });
    const totalBalance = await Account.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalAccounts,
        active: activeAccounts,
        totalBalance: totalBalance[0]?.total || 0,
        byType: stats
      }
    });
  } catch (error) {
    console.error('Account stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ========== TRANSACTION ROUTES ==========

// Get all transactions
router.get('/transactions', superAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, account, startDate, endDate, status, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (account) query.account = account;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { transactionNumber: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }

    const transactions = await Transaction.find(query)
      .populate({
        path: 'account',
        select: 'name accountNumber',
        strictPopulate: false
      })
      .populate({
        path: 'toAccount',
        select: 'name accountNumber',
        strictPopulate: false
      })
      .populate({
        path: 'createdBy',
        select: 'name email',
        strictPopulate: false
      })
      .populate({
        path: 'approvedBy',
        select: 'name email',
        strictPopulate: false
      })
      .sort({ date: -1 })
      .limit(parseInt(limit) || 10)
      .skip((parseInt(page) - 1) * (parseInt(limit) || 10));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get transaction stats
router.get('/transactions/stats', superAdminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get stats by type
    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Get total transactions count
    const totalTransactions = await Transaction.countDocuments(query);
    
    // Get total income
    const incomeQuery = { ...query, type: 'income' };
    const totalIncomeResult = await Transaction.aggregate([
      { $match: incomeQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = totalIncomeResult[0]?.total || 0;
    
    // Get total expenses
    const expenseQuery = { ...query, type: 'expense' };
    const totalExpensesResult = await Transaction.aggregate([
      { $match: expenseQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = totalExpensesResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        total: totalTransactions,
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        byType: stats
      }
    });
  } catch (error) {
    console.error('Transaction stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create transaction
router.post('/transactions', superAdminAuth, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      createdBy: req.user._id,
      status: 'pending_approval' // All transactions require approval
    });
    await transaction.save();
    await transaction.populate('account', 'name accountNumber');
    if (transaction.toAccount) {
      await transaction.populate('toAccount', 'name accountNumber');
    }
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update transaction
router.put('/transactions/:id', superAdminAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('account', 'name accountNumber');
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Approve transaction
router.post('/transactions/:id/approve', superAdminAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Transaction already approved' });
    }

    // Update transaction status - the post-save hook will handle balance updates
    transaction.status = 'approved';
    transaction.approvedBy = req.user._id;
    transaction.approvedAt = new Date();
    await transaction.save();

    await transaction.populate('account', 'name accountNumber');
    await transaction.populate('toAccount', 'name accountNumber');
    await transaction.populate('approvedBy', 'name email');

    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Approve transaction error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Reject transaction
router.post('/transactions/:id/reject', superAdminAuth, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: rejectionReason || 'Transaction rejected by super admin'
      },
      { new: true }
    ).populate('account', 'name accountNumber');
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Reject transaction error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Reconcile transaction
router.post('/transactions/:id/reconcile', superAdminAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        reconciled: true,
        reconciledAt: new Date(),
        reconciledBy: req.user._id
      },
      { new: true }
    ).populate('account', 'name accountNumber');
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Reconcile transaction error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ========== FINANCIAL REPORT ROUTES ==========

// Get all reports
router.get('/reports', superAdminAuth, async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const reports = await FinancialReport.find(query)
      .populate('generatedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
});

// Get single report
router.get('/reports/:id', superAdminAuth, async (req, res) => {
  try {
    const report = await FinancialReport.findById(req.params.id)
      .populate('items.account', 'name accountNumber type')
      .populate('generatedBy', 'name email')
      .populate('approvedBy', 'name email');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report' });
  }
});

// Generate report
router.post('/reports/generate', superAdminAuth, async (req, res) => {
  try {
    const { type, period, accounts } = req.body;
    
    // Fetch transactions for the period
    const transactions = await Transaction.find({
      date: {
        $gte: new Date(period.startDate),
        $lte: new Date(period.endDate)
      },
      status: 'completed'
    }).populate('account', 'name accountNumber type');

    // Build report items
    const items = [];
    if (accounts && accounts.length > 0) {
      for (const accountId of accounts) {
        const accountTransactions = transactions.filter(t => 
          t.account._id.toString() === accountId.toString()
        );
        const total = accountTransactions.reduce((sum, t) => {
          if (t.type === 'income') return sum + t.amount;
          if (t.type === 'expense') return sum - t.amount;
          return sum;
        }, 0);
        
        items.push({
          account: accountId,
          accountName: accountTransactions[0]?.account?.name || '',
          amount: total
        });
      }
    }

    const report = new FinancialReport({
      type,
      title: `${type} Report - ${new Date(period.startDate).toLocaleDateString()} to ${new Date(period.endDate).toLocaleDateString()}`,
      period: {
        startDate: new Date(period.startDate),
        endDate: new Date(period.endDate)
      },
      items,
      generatedBy: req.user._id
    });
    
    await report.save();
    await report.populate('items.account', 'name accountNumber type');
    
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Approve report
router.post('/reports/:id/approve', superAdminAuth, async (req, res) => {
  try {
    const report = await FinancialReport.findByIdAndUpdate(
      req.params.id,
      {
        status: 'final',
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Approve report error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;

