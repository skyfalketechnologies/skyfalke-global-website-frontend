'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaCheck, FaSpinner, FaSearch, FaArrowUp, FaArrowDown, FaExchangeAlt, FaTimes } from 'react-icons/fa';
import { adminApiGet, adminApiPost } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const Transactions = () => {
  const { isSuperAdmin } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ 
    type: '', 
    account: '', 
    status: '',
    startDate: '',
    endDate: '',
    search: '' 
  });

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  if (!isSuperAdmin()) {
    return <Navigate to="/system/dashboard" replace />;
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });
      const response = await adminApiGet(`/api/accounting/transactions?${params}`);
      if (response.success && response.data) {
        setTransactions(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this transaction? This will update account balances.')) {
      try {
        const response = await adminApiPost(`/api/accounting/transactions/${id}/approve`);
        if (response.success) {
          fetchTransactions();
        } else {
          alert(response.message || 'Failed to approve transaction');
        }
      } catch (error) {
        console.error('Error approving transaction:', error);
        alert('Failed to approve transaction');
      }
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason !== null) {
      try {
        const response = await adminApiPost(`/api/accounting/transactions/${id}/reject`, { rejectionReason: reason });
        if (response.success) {
          fetchTransactions();
        } else {
          alert(response.message || 'Failed to reject transaction');
        }
      } catch (error) {
        console.error('Error rejecting transaction:', error);
        alert('Failed to reject transaction');
      }
    }
  };

  const handleReconcile = async (id) => {
    if (window.confirm('Are you sure you want to reconcile this transaction?')) {
      try {
        const response = await adminApiPost(`/api/accounting/transactions/${id}/reconcile`);
        if (response.success) {
          fetchTransactions();
        }
      } catch (error) {
        console.error('Error reconciling transaction:', error);
        alert('Failed to reconcile transaction');
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'income': return FaArrowUp;
      case 'expense': return FaArrowDown;
      case 'transfer': return FaExchangeAlt;
      default: return FaArrowUp;
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transaction Management</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track all financial transactions</p>
        </div>
        <Link href="/system/dashboard/accounting/transactions/new"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <FaPlus className="mr-2 -ml-1 h-4 w-4" />
          New Transaction
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => {
                const TypeIcon = getTypeIcon(transaction.type);
                return (
                  <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {transaction.transactionNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {transaction.account?.name || '-'}
                      {transaction.toAccount && (
                        <div className="text-xs text-gray-500">→ {transaction.toAccount.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : transaction.type === 'expense'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        <TypeIcon className="mr-1 h-3 w-3" />
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : transaction.type === 'expense'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                      {transaction.currency} {transaction.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'approved' || transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : transaction.status === 'pending_approval'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : transaction.status === 'rejected'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {transaction.status === 'pending_approval' ? 'Pending Approval' : transaction.status}
                        </span>
                        {transaction.approvedBy && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Approved by {transaction.approvedBy?.name || 'Super Admin'}
                          </span>
                        )}
                        {transaction.reconciled && (
                          <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                            <FaCheck className="mr-1" /> Reconciled
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link href={`/system/dashboard/accounting/transactions/${transaction._id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        {transaction.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => handleApprove(transaction._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(transaction._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {!transaction.reconciled && (transaction.status === 'approved' || transaction.status === 'completed') && (
                          <button
                            onClick={() => handleReconcile(transaction._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Reconcile"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;

