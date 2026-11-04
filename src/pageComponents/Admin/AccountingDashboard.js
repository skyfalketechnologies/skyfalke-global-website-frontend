'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaWallet,
  FaSpinner,
  FaPlus,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { adminApiGet } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

/** adminApiGet returns { success, data: axiosBody }. Server sends { success, data: payload }. */
function unwrapInnerData(res) {
  if (!res?.success || res.data == null) return null;
  const body = res.data;
  if (typeof body !== 'object' || body === null) return null;
  if (Array.isArray(body)) return null;
  const nested = body.data;
  if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
    return nested;
  }
  if ('totalIncome' in body || 'accountCount' in body || 'period' in body) {
    return body;
  }
  return null;
}

function unwrapList(res) {
  if (!res?.success || res.data == null) return [];
  const body = res.data;
  const arr = body?.data;
  return Array.isArray(arr) ? arr : [];
}

function mtdDateRange() {
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  return { start, end, startStr: fmt(start), endStr: fmt(end) };
}

/** When /dashboard/summary fails (404 on older APIs, etc.), rebuild from existing endpoints. */
async function fetchSummaryFallback() {
  const { start, end, startStr, endStr } = mtdDateRange();
  const qs = new URLSearchParams({
    startDate: startStr,
    endDate: endStr,
    status: 'approved,pending_approval,completed'
  });
  const [txStatsRes, accStatsRes, txPendingRes, expPendingRes] = await Promise.all([
    adminApiGet(`/api/accounting/transactions/stats?${qs}`),
    adminApiGet('/api/accounting/accounts/stats'),
    adminApiGet('/api/accounting/transactions?limit=1&page=1&status=pending_approval'),
    adminApiGet('/api/accounting/expenses?limit=1&page=1&status=pending')
  ]);

  const txStats = unwrapInnerData(txStatsRes);
  const accStats = unwrapInnerData(accStatsRes);
  const txPendingTotal = txStatsRes.success && txStatsRes.data?.pagination?.total != null
    ? Number(txStatsRes.data.pagination.total)
    : 0;
  const expPendingTotal = expPendingRes.success && expPendingRes.data?.pagination?.total != null
    ? Number(expPendingRes.data.pagination.total)
    : 0;

  const totalIncome = txStats ? Number(txStats.totalIncome) || 0 : 0;
  const totalExpenses = txStats ? Number(txStats.totalExpenses) || 0 : 0;

  return {
    period: { startDate: start, endDate: end },
    totalIncome,
    totalExpenses,
    netIncome: totalIncome - totalExpenses,
    pendingExpenses: expPendingTotal,
    pendingTransactions: txPendingTotal,
    accountCount: accStats ? Number(accStats.active) || 0 : 0,
    unreconciledTransactions: 0
  };
}

const AccountingDashboard = () => {
  const router = useRouter();
  const { loading: authLoading, canAccessAccounting } = useAuth();
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    totalAccounts: 0,
    pendingExpenses: 0,
    pendingTransactions: 0,
    unreconciledTransactions: 0
  });
  const [periodLabel, setPeriodLabel] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError('');
      const [summaryRes, transactionsRes, expensesRes] = await Promise.all([
        adminApiGet('/api/accounting/dashboard/summary'),
        adminApiGet('/api/accounting/transactions?limit=5&page=1'),
        adminApiGet('/api/accounting/expenses?limit=5&page=1&status=pending')
      ]);

      let summary = unwrapInnerData(summaryRes);
      if (!summaryRes.success || !summary) {
        try {
          summary = await fetchSummaryFallback();
          setFetchError('');
        } catch (fbErr) {
          console.error('Accounting dashboard fallback failed:', fbErr);
          setFetchError(
            summaryRes.error?.message ||
              'Could not load dashboard summary. Totals may be incomplete.'
          );
        }
      } else {
        setFetchError('');
      }

      if (summary && typeof summary === 'object') {
        setStats({
          totalIncome: Number(summary.totalIncome) || 0,
          totalExpenses: Number(summary.totalExpenses) || 0,
          netIncome:
            (Number(summary.totalIncome) || 0) - (Number(summary.totalExpenses) || 0),
          totalAccounts: Number(summary.accountCount) || 0,
          pendingExpenses: Number(summary.pendingExpenses) || 0,
          pendingTransactions: Number(summary.pendingTransactions) || 0,
          unreconciledTransactions: Number(summary.unreconciledTransactions) || 0
        });
        const p = summary.period;
        if (p?.startDate && p?.endDate) {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          setPeriodLabel(
            `${start.toLocaleDateString()} – ${end.toLocaleDateString()} · income & expense (approved + pending)`
          );
        } else {
          setPeriodLabel('Month to date · income & expense (approved + pending)');
        }
      }

      setRecentTransactions(unwrapList(transactionsRes));
      setRecentExpenses(unwrapList(expensesRes));
    } catch (error) {
      console.error('Error fetching accounting dashboard data:', error);
      setFetchError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !canAccessAccounting()) return;
    fetchDashboardData();
  }, [authLoading, canAccessAccounting, fetchDashboardData]);

  useEffect(() => {
    if (authLoading) return;
    if (!canAccessAccounting()) {
      router.replace('/system/dashboard');
    }
  }, [authLoading, canAccessAccounting, router]);

  if (authLoading || !canAccessAccounting()) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Income (MTD)',
      value: `KES ${stats.totalIncome.toLocaleString()}`,
      icon: FaArrowUp,
      color: 'from-green-500 to-green-600',
      link: '/system/dashboard/accounting/transactions?type=income'
    },
    {
      title: 'Expenses (MTD)',
      value: `KES ${stats.totalExpenses.toLocaleString()}`,
      icon: FaArrowDown,
      color: 'from-red-500 to-red-600',
      link: '/system/dashboard/accounting/expenses'
    },
    {
      title: 'Net (MTD)',
      value: `KES ${stats.netIncome.toLocaleString()}`,
      icon: FaChartLine,
      color: stats.netIncome >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600',
      link: '/system/dashboard/accounting/reports'
    },
    {
      title: 'Active accounts',
      value: stats.totalAccounts,
      icon: FaWallet,
      color: 'from-purple-500 to-purple-600',
      link: '/system/dashboard/accounting/accounts'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate"
          >
            Accounting & Finance
          </motion.h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Invoicing, ledger, reconciliation, and financial reporting
          </p>
          {periodLabel && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{periodLabel}</p>
          )}
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 flex-wrap gap-2">
          <Link
            href="/system/dashboard/accounting/journal"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Journal
          </Link>
          <Link
            href="/system/dashboard/accounting/transactions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaPlus className="mr-2 -ml-1 h-4 w-4" />
            New Transaction
          </Link>
        </div>
      </div>

      {fetchError && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-sm text-amber-900 dark:text-amber-100">
          {fetchError}
        </div>
      )}

      {(stats.pendingExpenses > 0 || stats.pendingTransactions > 0 || stats.unreconciledTransactions > 0) && (
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
          {stats.pendingTransactions > 0 && (
            <Link
              href="/system/dashboard/accounting/transactions?status=pending_approval"
              className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {stats.pendingTransactions} transaction{stats.pendingTransactions !== 1 ? 's' : ''} awaiting approval
            </Link>
          )}
          {stats.pendingExpenses > 0 && (
            <Link
              href="/system/dashboard/accounting/expenses?status=pending"
              className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {stats.pendingExpenses} pending expense{stats.pendingExpenses !== 1 ? 's' : ''}
            </Link>
          )}
          {stats.unreconciledTransactions > 0 && (
            <Link
              href="/system/dashboard/accounting/bank-reconciliation"
              className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {stats.unreconciledTransactions} unreconciled in period
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.link}>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            {stat.title}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {stat.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Recent Transactions
              </h3>
              <Link
                href="/system/dashboard/accounting/transactions"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.account?.name} • {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        transaction.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {(transaction.currency || 'KES')}{' '}
                      {Number(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Pending Expenses
              </h3>
              <Link
                href="/system/dashboard/accounting/expenses?status=pending"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => (
                  <div key={expense._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {expense.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">
                      {(expense.currency || 'KES')}{' '}
                      {Number(expense.amount).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">
                  No pending expenses
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountingDashboard;
