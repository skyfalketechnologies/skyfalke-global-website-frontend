'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaDollarSign, 
  FaChartLine, 
  FaWallet, 
  FaFileInvoice,
  FaSpinner,
  FaPlus,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { adminApiGet } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const AccountingDashboard = () => {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    totalAccounts: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!isSuperAdmin()) {
    return <Navigate to="/system/dashboard" replace />;
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, expensesRes, accountsRes, transactionStatsRes] = await Promise.all([
        adminApiGet('/api/accounting/transactions?limit=5'),
        adminApiGet('/api/accounting/expenses?limit=5&status=pending'),
        adminApiGet('/api/accounting/accounts'),
        adminApiGet('/api/accounting/transactions/stats')
      ]);

      if (transactionsRes.success && transactionsRes.data) {
        setRecentTransactions(transactionsRes.data.data || []);
      }

      if (expensesRes.success && expensesRes.data) {
        setRecentExpenses(expensesRes.data.data || []);
      }

      if (accountsRes.success && accountsRes.data) {
        setStats(prev => ({
          ...prev,
          totalAccounts: accountsRes.data.length || 0
        }));
      }

      if (transactionStatsRes.success && transactionStatsRes.data) {
        setStats(prev => ({
          ...prev,
          totalIncome: transactionStatsRes.data.totalIncome || 0,
          totalExpenses: transactionStatsRes.data.totalExpenses || 0,
          netIncome: (transactionStatsRes.data.totalIncome || 0) - (transactionStatsRes.data.totalExpenses || 0)
        }));
      }
    } catch (error) {
      console.error('Error fetching accounting dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Income',
      value: `KES ${stats.totalIncome.toLocaleString()}`,
      icon: FaArrowUp,
      color: 'from-green-500 to-green-600',
      link: '/system/dashboard/accounting/transactions?type=income'
    },
    {
      title: 'Total Expenses',
      value: `KES ${stats.totalExpenses.toLocaleString()}`,
      icon: FaArrowDown,
      color: 'from-red-500 to-red-600',
      link: '/system/dashboard/accounting/expenses'
    },
    {
      title: 'Net Income',
      value: `KES ${stats.netIncome.toLocaleString()}`,
      icon: FaChartLine,
      color: stats.netIncome >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600',
      link: '/system/dashboard/accounting/reports'
    },
    {
      title: 'Total Accounts',
      value: stats.totalAccounts,
      icon: FaWallet,
      color: 'from-purple-500 to-purple-600',
      link: '/system/dashboard/accounting/accounts'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate"
          >
            Accounting Dashboard
          </motion.h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage finances, expenses, accounts, and transactions
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link href="/system/dashboard/accounting/transactions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaPlus className="mr-2 -ml-1 h-4 w-4" />
            New Transaction
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
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
              <Link href="/system/dashboard/accounting/transactions"
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
                    <div className={`text-sm font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
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

        {/* Pending Expenses */}
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
              <Link href="/system/dashboard/accounting/expenses?status=pending"
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
                      KES {expense.amount.toLocaleString()}
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

