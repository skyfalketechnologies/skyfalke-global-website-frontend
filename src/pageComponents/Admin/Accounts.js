'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaSpinner, FaSearch, FaWallet, FaCheckCircle } from 'react-icons/fa';
import { adminApiGet, adminApiDelete } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const Accounts = () => {
  const { isSuperAdmin } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', isActive: '', search: '' });

  useEffect(() => {
    fetchAccounts();
  }, [filters]);

  if (!isSuperAdmin()) {
    return <Navigate to="/system/dashboard" replace />;
  }

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      );
      const response = await adminApiGet(`/api/accounting/accounts?${params}`);
      if (response.success && response.data) {
        setAccounts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const response = await adminApiDelete(`/api/accounting/accounts/${id}`);
        if (response.success) {
          fetchAccounts();
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  if (loading && accounts.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Account Management</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your chart of accounts</p>
        </div>
        <Link href="/system/dashboard/accounting/accounts/new"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <FaPlus className="mr-2 -ml-1 h-4 w-4" />
          New Account
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
              <option value="equity">Equity</option>
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <motion.div
            key={account._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <FaWallet className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {account.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {account.accountNumber}
                  </p>
                </div>
              </div>
              {account.isActive && (
                <FaCheckCircle className="text-green-500" />
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {account.type?.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Balance:</span>
                <span className={`text-sm font-bold ${
                  account.balance >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {account.currency} {account.balance?.toLocaleString()}
                </span>
              </div>
              {account.category && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {account.category}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href={`/system/dashboard/accounting/accounts/${account._id}/edit`}
                className="flex-1 text-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 rounded-md hover:bg-primary-50"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(account._id)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-md hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {accounts.length === 0 && !loading && (
        <div className="text-center py-12">
          <FaWallet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No accounts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new account.
          </p>
          <div className="mt-6">
            <Link href="/system/dashboard/accounting/accounts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <FaPlus className="mr-2 -ml-1 h-4 w-4" />
              New Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

