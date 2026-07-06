const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();
const { accountingAuth } = require('../middleware/auth');
const Expense = require('../models/Expense');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const FinancialReport = require('../models/FinancialReport');
const AuditLog = require('../models/AuditLog');
const JournalEntry = require('../models/JournalEntry');
const FinancialDocument = require('../models/FinancialDocument');
const BankReconciliation = require('../models/BankReconciliation');
const { logAccountingAudit } = require('../utils/accountingAudit');
const { applyJournalLinesToBalances, validateBalancedLines } = require('../utils/journalPosting');
const { generateFinancialDocumentPDF } = require('../utils/financialDocumentPdf');

/** Strip unsafe / invalid fields from client payloads */
function sanitizeAccountPayload(body) {
  const allowed = [
    'name',
    'type',
    'category',
    'currency',
    'balance',
    'openingBalance',
    'openingBalanceDate',
    'bankDetails',
    'notes',
    'isActive',
    'parentAccount',
    'accountNumber'
  ];
  const out = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      out[key] = body[key];
    }
  }
  if (out.parentAccount === '' || out.parentAccount === null) {
    out.parentAccount = undefined;
  }
  if (out.openingBalanceDate !== undefined && out.openingBalanceDate !== null) {
    const d = new Date(out.openingBalanceDate);
    if (Number.isNaN(d.getTime())) {
      delete out.openingBalanceDate;
    } else {
      out.openingBalanceDate = d;
    }
  }
  return out;
}

function sanitizeTransactionPayload(body, { isCreate = false } = {}) {
  const allowed = [
    'type',
    'date',
    'account',
    'toAccount',
    'amount',
    'currency',
    'description',
    'category',
    'reference',
    'paymentMethod',
    'notes',
    'status',
    'attachments'
  ];
  const out = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      out[key] = body[key];
    }
  }
  if (out.account === '') out.account = undefined;
  if (out.toAccount === '') out.toAccount = undefined;
  if (out.date !== undefined && out.date !== null) {
    const d = new Date(out.date);
    if (!Number.isNaN(d.getTime())) out.date = d;
  }
  if (isCreate) {
    delete out.status;
    delete out.transactionNumber;
    delete out.createdBy;
    delete out.balanceUpdated;
  } else {
    delete out.createdBy;
    delete out.transactionNumber;
  }
  return out;
}

// ========== DASHBOARD SUMMARY (registered early so it is never shadowed by :id routes) ==========

/** Income/expense totals include pending rows so the dashboard matches what users see in the list */
const DASHBOARD_TX_STATUSES = ['approved', 'pending_approval', 'completed'];

router.get('/dashboard/summary', accountingAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const txQuery = {
      date: { $gte: start, $lte: end },
      status: { $in: DASHBOARD_TX_STATUSES }
    };
    const txs = await Transaction.find(txQuery);

    const totalIncome = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const pendingExpenses = await Expense.countDocuments({ status: 'pending' });
    const pendingTransactions = await Transaction.countDocuments({ status: 'pending_approval' });
    const accountCount = await Account.countDocuments({ isActive: true });
    const unreconciled = await Transaction.countDocuments({
      reconciled: false,
      status: 'approved',
      date: { $gte: start, $lte: end }
    });

    res.json({
      success: true,
      data: {
        period: { startDate: start, endDate: end },
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        pendingExpenses,
        pendingTransactions,
        accountCount,
        unreconciledTransactions: unreconciled
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard summary' });
  }
});

// ========== EXPENSE ROUTES ==========

// Get all expenses
router.get('/expenses', accountingAuth, async (req, res) => {
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
router.get('/expenses/:id', accountingAuth, async (req, res) => {
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
router.post('/expenses', accountingAuth, async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      createdBy: req.user._id
    });
    await expense.save();
    await expense.populate('account', 'name accountNumber');
    await logAccountingAudit({
      userId: req.user._id,
      action: 'create',
      entityType: 'expense',
      entityId: expense._id,
      details: { expenseNumber: expense.expenseNumber, amount: expense.amount },
      req
    });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update expense
router.put('/expenses/:id', accountingAuth, async (req, res) => {
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
router.post('/expenses/:id/approve', accountingAuth, async (req, res) => {
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
router.get('/expenses/stats', accountingAuth, async (req, res) => {
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
router.get('/accounts', accountingAuth, async (req, res) => {
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
router.get('/accounts/:id', accountingAuth, async (req, res) => {
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
router.post('/accounts', accountingAuth, async (req, res) => {
  try {
    const payload = sanitizeAccountPayload(req.body);
    const account = new Account({
      ...payload,
      createdBy: req.user._id
    });
    await account.save();
    await logAccountingAudit({
      userId: req.user._id,
      action: 'create',
      entityType: 'account',
      entityId: account._id,
      details: { accountNumber: account.accountNumber, name: account.name },
      req
    });
    res.status(201).json({ success: true, data: account });
  } catch (error) {
    console.error('Create account error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          'An account number already exists for this setup. If this persists, try again or pick a different account type sequence.'
      });
    }
    const msg =
      error.name === 'ValidationError' && error.errors
        ? Object.values(error.errors)
            .map((e) => e.message)
            .join(' ')
        : error.message;
    res.status(400).json({ success: false, message: msg });
  }
});

// Update account
router.put('/accounts/:id', accountingAuth, async (req, res) => {
  try {
    const payload = sanitizeAccountPayload(req.body);
    delete payload.createdBy;
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.json({ success: true, data: account });
  } catch (error) {
    console.error('Update account error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'That account number is already in use.'
      });
    }
    const msg =
      error.name === 'ValidationError' && error.errors
        ? Object.values(error.errors)
            .map((e) => e.message)
            .join(' ')
        : error.message;
    res.status(400).json({ success: false, message: msg });
  }
});

// Get account stats
router.get('/accounts/stats', accountingAuth, async (req, res) => {
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
router.get('/transactions', accountingAuth, async (req, res) => {
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

    const lim = parseInt(limit, 10) || 10;
    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page, 10) || 1,
        limit: lim,
        total,
        pages: Math.max(1, Math.ceil(total / lim))
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
router.get('/transactions/stats', accountingAuth, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (status) {
      if (String(status).includes(',')) {
        query.status = { $in: String(status).split(',').map((s) => s.trim()).filter(Boolean) };
      } else {
        query.status = status;
      }
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
router.post('/transactions', accountingAuth, async (req, res) => {
  try {
    const payload = sanitizeTransactionPayload(req.body, { isCreate: true });
    const transaction = new Transaction({
      ...payload,
      createdBy: req.user._id,
      status: 'pending_approval' // All transactions require approval
    });
    await transaction.save();
    await transaction.populate('account', 'name accountNumber');
    if (transaction.toAccount) {
      await transaction.populate('toAccount', 'name accountNumber');
    }
    await logAccountingAudit({
      userId: req.user._id,
      action: 'create',
      entityType: 'transaction',
      entityId: transaction._id,
      details: { transactionNumber: transaction.transactionNumber, type: transaction.type },
      req
    });
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update transaction
router.put('/transactions/:id', accountingAuth, async (req, res) => {
  try {
    const payload = sanitizeTransactionPayload(req.body, { isCreate: false });
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      payload,
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
router.post('/transactions/:id/approve', accountingAuth, async (req, res) => {
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

    await logAccountingAudit({
      userId: req.user._id,
      action: 'approve',
      entityType: 'transaction',
      entityId: transaction._id,
      details: { transactionNumber: transaction.transactionNumber },
      req
    });

    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Approve transaction error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Reject transaction
router.post('/transactions/:id/reject', accountingAuth, async (req, res) => {
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
router.post('/transactions/:id/reconcile', accountingAuth, async (req, res) => {
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
router.get('/reports', accountingAuth, async (req, res) => {
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
router.get('/reports/:id', accountingAuth, async (req, res) => {
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

// Generate report (P&L, balance sheet, cash flow, trial balance)
router.post('/reports/generate', accountingAuth, async (req, res) => {
  try {
    const { type, period, accounts: accountIds } = req.body;
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);

    const transactions = await Transaction.find({
      date: { $gte: start, $lte: end },
      status: 'approved'
    }).populate('account', 'name accountNumber type')
      .populate('toAccount', 'name accountNumber type');

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0
    };

    let items = [];

    if (type === 'profit-loss' || type === 'income-statement' || type === 'expense-report') {
      const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      summary.totalIncome = income;
      summary.totalExpenses = expense;
      summary.netIncome = income - expense;

      const accMap = new Map();
      for (const t of transactions) {
        if (t.type !== 'income' && t.type !== 'expense') continue;
        if (!t.account) continue;
        const id = t.account._id.toString();
        if (!accMap.has(id)) {
          accMap.set(id, {
            account: t.account._id,
            accountName: t.account.name,
            amount: 0
          });
        }
        const row = accMap.get(id);
        if (t.type === 'income') row.amount += t.amount;
        if (t.type === 'expense') row.amount -= t.amount;
      }
      items = Array.from(accMap.values());
    } else if (type === 'balance-sheet') {
      const accQuery = { isActive: true };
      if (accountIds && accountIds.length) accQuery._id = { $in: accountIds };
      const allAccounts = await Account.find(accQuery);
      for (const a of allAccounts) {
        if (['asset', 'bank', 'cash', 'accounts-receivable'].includes(a.type)) {
          summary.totalAssets += a.balance;
          items.push({ account: a._id, accountName: a.name, amount: a.balance });
        } else if (['liability', 'accounts-payable'].includes(a.type)) {
          summary.totalLiabilities += a.balance;
          items.push({ account: a._id, accountName: a.name, amount: a.balance });
        } else if (a.type === 'equity') {
          summary.totalEquity += a.balance;
          items.push({ account: a._id, accountName: a.name, amount: a.balance });
        }
      }
    } else if (type === 'cash-flow') {
      const cashAccounts = await Account.find({
        type: { $in: ['bank', 'cash'] },
        isActive: true
      });
      const cashIds = new Set(cashAccounts.map((a) => a._id.toString()));
      let inflow = 0;
      let outflow = 0;
      for (const t of transactions) {
        const aid = t.account?._id?.toString();
        const tid = t.toAccount?._id?.toString();
        const touchesCash = (aid && cashIds.has(aid)) || (tid && cashIds.has(tid));
        if (!touchesCash) continue;
        if (t.type === 'income') {
          inflow += t.amount;
          items.push({
            account: t.account?._id,
            accountName: t.description,
            amount: t.amount
          });
        } else if (t.type === 'expense') {
          outflow += t.amount;
          items.push({
            account: t.account?._id,
            accountName: t.description,
            amount: -t.amount
          });
        }
      }
      summary.totalIncome = inflow;
      summary.totalExpenses = outflow;
      summary.netIncome = inflow - outflow;
    } else if (type === 'trial-balance') {
      const accQuery = { isActive: true };
      if (accountIds && accountIds.length) accQuery._id = { $in: accountIds };
      const allAccounts = await Account.find(accQuery);
      for (const a of allAccounts) {
        items.push({
          account: a._id,
          accountName: a.name,
          amount: a.balance
        });
      }
    } else {
      const filterIds = accountIds && accountIds.length
        ? new Set(accountIds.map((id) => id.toString()))
        : null;
      for (const t of transactions) {
        if (!t.account) continue;
        if (filterIds && !filterIds.has(t.account._id.toString())) continue;
        const prev = items.find(
          (i) => i.account && i.account.toString() === t.account._id.toString()
        );
        const delta = t.type === 'income' ? t.amount : t.type === 'expense' ? -t.amount : 0;
        if (prev) prev.amount += delta;
        else {
          items.push({
            account: t.account._id,
            accountName: t.account.name,
            amount: delta
          });
        }
      }
    }

    const report = new FinancialReport({
      type,
      title: `${type} Report — ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
      period: { startDate: start, endDate: end },
      items,
      summary,
      generatedBy: req.user._id
    });

    await report.save();
    await report.populate('items.account', 'name accountNumber type');

    await logAccountingAudit({
      userId: req.user._id,
      action: 'generate_report',
      entityType: 'financial_report',
      entityId: report._id,
      details: { type, period: { start, end } },
      req
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Approve report
router.post('/reports/:id/approve', accountingAuth, async (req, res) => {
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

// ========== AUDIT LOG ==========

router.get('/audit-log', accountingAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, entityType, action } = req.query;
    const query = {};
    if (entityType) query.entityType = entityType;
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .limit(parseInt(limit, 10));

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('Audit log error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch audit log' });
  }
});

// ========== JOURNAL ENTRIES (GENERAL LEDGER SOURCE) ==========

router.get('/journal-entries', accountingAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const entries = await JournalEntry.find(query)
      .populate('createdBy', 'name email')
      .populate('lines.account', 'name accountNumber type')
      .sort({ date: -1 })
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .limit(parseInt(limit, 10));

    const total = await JournalEntry.countDocuments(query);

    res.json({
      success: true,
      data: entries,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('Journal entries error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journal entries' });
  }
});

router.post('/journal-entries', accountingAuth, async (req, res) => {
  try {
    const { date, description, lines, reference, sourceType, sourceId } = req.body;
    if (!lines || lines.length < 2) {
      return res.status(400).json({ success: false, message: 'At least two journal lines are required' });
    }
    validateBalancedLines(lines);

    const entry = new JournalEntry({
      date: date ? new Date(date) : new Date(),
      description,
      lines,
      reference,
      sourceType: sourceType || 'manual',
      sourceId,
      status: 'draft',
      createdBy: req.user._id
    });
    await entry.save();
    await entry.populate('lines.account', 'name accountNumber type');

    await logAccountingAudit({
      userId: req.user._id,
      action: 'create',
      entityType: 'journal_entry',
      entityId: entry._id,
      details: { entryNumber: entry.entryNumber, status: 'draft' },
      req
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/journal-entries/:id/post', accountingAuth, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id).populate('lines.account');
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }
    if (entry.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Only draft entries can be posted' });
    }

    validateBalancedLines(entry.lines);
    await applyJournalLinesToBalances(entry.lines);

    entry.status = 'posted';
    entry.postedBy = req.user._id;
    entry.postedAt = new Date();
    await entry.save();
    await entry.populate('lines.account', 'name accountNumber type');

    await logAccountingAudit({
      userId: req.user._id,
      action: 'post',
      entityType: 'journal_entry',
      entityId: entry._id,
      details: { entryNumber: entry.entryNumber },
      req
    });

    res.json({ success: true, data: entry });
  } catch (error) {
    console.error('Post journal entry error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ========== GENERAL LEDGER (account activity) ==========

router.get('/general-ledger', accountingAuth, async (req, res) => {
  try {
    const { accountId, startDate, endDate } = req.query;
    if (!accountId) {
      return res.status(400).json({ success: false, message: 'accountId is required' });
    }
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const txRows = await Transaction.find({
      account: accountId,
      date: { $gte: start, $lte: end },
      status: 'approved'
    }).sort({ date: 1 });

    const journalRows = await JournalEntry.find({
      status: 'posted',
      date: { $gte: start, $lte: end },
      'lines.account': accountId
    }).sort({ date: 1 });

    const linesOut = [];

    for (const t of txRows) {
      linesOut.push({
        date: t.date,
        source: 'transaction',
        sourceId: t._id,
        reference: t.transactionNumber,
        description: t.description,
        debit: t.type === 'income' || t.type === 'transfer' ? t.amount : 0,
        credit: t.type === 'expense' ? t.amount : 0
      });
    }

    for (const j of journalRows) {
      const line = j.lines.find((l) => l.account.toString() === accountId.toString());
      if (line) {
        linesOut.push({
          date: j.date,
          source: 'journal',
          sourceId: j._id,
          reference: j.entryNumber,
          description: j.description,
          debit: line.debit || 0,
          credit: line.credit || 0
        });
      }
    }

    linesOut.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ success: true, data: { accountId, period: { start, end }, lines: linesOut } });
  } catch (error) {
    console.error('General ledger error:', error);
    res.status(500).json({ success: false, message: 'Failed to load general ledger' });
  }
});

// ========== FINANCIAL DOCUMENTS (sales receipts, credit / debit notes) ==========

router.get('/documents', accountingAuth, async (req, res) => {
  try {
    const { documentType, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (documentType) query.documentType = documentType;
    if (status) query.status = status;

    const docs = await FinancialDocument.find(query)
      .populate('createdBy', 'name email')
      .sort({ issueDate: -1 })
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .limit(parseInt(limit, 10));

    const total = await FinancialDocument.countDocuments(query);

    res.json({
      success: true,
      data: docs,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('Financial documents error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
});

router.post('/documents', accountingAuth, async (req, res) => {
  try {
    const { documentType, status, ...rest } = req.body;
    if (!['sales_receipt', 'credit_note', 'debit_note'].includes(documentType)) {
      return res.status(400).json({ success: false, message: 'Invalid documentType' });
    }

    const documentNumber = await FinancialDocument.generateDocumentNumber(documentType);
    const doc = new FinancialDocument({
      ...rest,
      documentType,
      documentNumber,
      status: status || 'draft',
      createdBy: req.user._id
    });
    await doc.save();

    await logAccountingAudit({
      userId: req.user._id,
      action: 'create',
      entityType: 'financial_document',
      entityId: doc._id,
      details: { documentNumber, documentType },
      req
    });

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    console.error('Create financial document error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/documents/:id/pdf', accountingAuth, async (req, res) => {
  try {
    const doc = await FinancialDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const pdf = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${doc.documentNumber || 'document'}.pdf"`
    );
    pdf.pipe(res);
    await generateFinancialDocumentPDF(pdf, doc);
    pdf.end();

    await logAccountingAudit({
      userId: req.user._id,
      action: 'export_pdf',
      entityType: 'financial_document',
      entityId: doc._id,
      details: { documentNumber: doc.documentNumber },
      req
    });
  } catch (error) {
    console.error('Financial document PDF error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate PDF' });
    }
  }
});

router.get('/documents/:id', accountingAuth, async (req, res) => {
  try {
    const doc = await FinancialDocument.findById(req.params.id).populate('createdBy', 'name email');
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch document' });
  }
});

router.put('/documents/:id', accountingAuth, async (req, res) => {
  try {
    const doc = await FinancialDocument.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user._id },
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    await logAccountingAudit({
      userId: req.user._id,
      action: 'update',
      entityType: 'financial_document',
      entityId: doc._id,
      details: { documentNumber: doc.documentNumber },
      req
    });
    res.json({ success: true, data: doc });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ========== BANK RECONCILIATION ==========

router.get('/bank-reconciliation', accountingAuth, async (req, res) => {
  try {
    const { bankAccountId, page = 1, limit = 20 } = req.query;
    const query = {};
    if (bankAccountId) query.bankAccount = bankAccountId;

    const rows = await BankReconciliation.find(query)
      .populate('bankAccount', 'name accountNumber type balance')
      .populate('createdBy', 'name email')
      .sort({ statementDate: -1 })
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .limit(parseInt(limit, 10));

    const total = await BankReconciliation.countDocuments(query);

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('Bank reconciliation list error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reconciliations' });
  }
});

router.get('/bank-reconciliation/unmatched', accountingAuth, async (req, res) => {
  try {
    const { accountId } = req.query;
    if (!accountId) {
      return res.status(400).json({ success: false, message: 'accountId is required' });
    }

    const txs = await Transaction.find({
      account: accountId,
      reconciled: false,
      status: 'approved'
    }).sort({ date: -1 });

    res.json({ success: true, data: txs });
  } catch (error) {
    console.error('Unmatched transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unmatched transactions' });
  }
});

router.post('/bank-reconciliation', accountingAuth, async (req, res) => {
  try {
    const { bankAccount, statementDate, statementEndingBalance, clearedTransactionIds, notes } = req.body;

    const account = await Account.findById(bankAccount);
    if (!account || !['bank', 'cash', 'asset'].includes(account.type)) {
      return res.status(400).json({ success: false, message: 'Invalid bank account' });
    }

    let clearedBookBalance = 0;
    if (clearedTransactionIds && clearedTransactionIds.length) {
      const cleared = await Transaction.find({
        _id: { $in: clearedTransactionIds },
        account: bankAccount,
        status: 'approved'
      });
      for (const t of cleared) {
        if (t.type === 'income' || t.type === 'transfer') clearedBookBalance += t.amount;
        if (t.type === 'expense') clearedBookBalance -= t.amount;
      }
    }

    const difference = Number(statementEndingBalance) - Number(account.balance);

    const rec = new BankReconciliation({
      bankAccount,
      statementDate: new Date(statementDate),
      statementEndingBalance,
      clearedBookBalance,
      difference,
      clearedTransactionIds: clearedTransactionIds || [],
      status: 'draft',
      notes,
      createdBy: req.user._id
    });
    await rec.save();
    await rec.populate('bankAccount', 'name accountNumber type');

    await logAccountingAudit({
      userId: req.user._id,
      action: 'create',
      entityType: 'bank_reconciliation',
      entityId: rec._id,
      req
    });

    res.status(201).json({ success: true, data: rec });
  } catch (error) {
    console.error('Create bank reconciliation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/bank-reconciliation/:id/complete', accountingAuth, async (req, res) => {
  try {
    const rec = await BankReconciliation.findById(req.params.id);
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Reconciliation not found' });
    }

    if (rec.clearedTransactionIds && rec.clearedTransactionIds.length) {
      await Transaction.updateMany(
        { _id: { $in: rec.clearedTransactionIds } },
        {
          reconciled: true,
          reconciledAt: new Date(),
          reconciledBy: req.user._id
        }
      );
    }

    rec.status = 'completed';
    rec.completedBy = req.user._id;
    rec.completedAt = new Date();
    await rec.save();

    await logAccountingAudit({
      userId: req.user._id,
      action: 'complete',
      entityType: 'bank_reconciliation',
      entityId: rec._id,
      req
    });

    res.json({ success: true, data: rec });
  } catch (error) {
    console.error('Complete bank reconciliation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;

