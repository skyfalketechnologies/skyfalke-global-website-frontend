'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { adminApiGet, adminApiPost, adminApiPut } from '../../utils/adminApi';

const AccountForm = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    currency: 'KES',
    balance: '0',
    openingBalance: '0',
    openingBalanceDate: new Date().toISOString().split('T')[0],
    isActive: true,
    bankDetails: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      branch: '',
      swiftCode: '',
      iban: ''
    },
    notes: ''
  });

  const accountTypes = [
    'asset',
    'liability',
    'equity',
    'revenue',
    'expense',
    'bank',
    'cash',
    'accounts-receivable',
    'accounts-payable'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchAccount();
    }
  }, [id]);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const response = await adminApiGet(`/api/accounting/accounts/${id}`);
      if (response.success && response.data) {
        const account = response.data.data;
        setFormData({
          name: account.name || '',
          type: account.type || '',
          category: account.category || '',
          currency: account.currency || 'KES',
          balance: account.balance || '0',
          openingBalance: account.openingBalance || '0',
          openingBalanceDate: account.openingBalanceDate ? new Date(account.openingBalanceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          isActive: account.isActive !== undefined ? account.isActive : true,
          bankDetails: {
            bankName: account.bankDetails?.bankName || '',
            accountName: account.bankDetails?.accountName || '',
            accountNumber: account.bankDetails?.accountNumber || '',
            branch: account.bankDetails?.branch || '',
            swiftCode: account.bankDetails?.swiftCode || '',
            iban: account.bankDetails?.iban || ''
          },
          notes: account.notes || ''
        });
      }
    } catch (err) {
      setError('Failed to fetch account details');
      console.error('Error fetching account:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const path = name.split('.');
    
    if (path.length === 2) {
      setFormData(prev => ({
        ...prev,
        [path[0]]: {
          ...prev[path[0]],
          [path[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Account name is required');
    if (!formData.type) errors.push('Account type is required');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setSaving(true);
      const submitData = {
        ...formData,
        balance: parseFloat(formData.balance) || 0,
        openingBalance: parseFloat(formData.openingBalance) || 0,
        openingBalanceDate: new Date(formData.openingBalanceDate)
      };

      let response;
      if (isEditing) {
        response = await adminApiPut(`/api/accounting/accounts/${id}`, submitData);
      } else {
        response = await adminApiPost('/api/accounting/accounts', submitData);
      }

      if (response.success) {
        setSuccess(isEditing ? 'Account updated successfully' : 'Account created successfully');
        setTimeout(() => {
          router.push('/system/dashboard/accounting/accounts');
        }, 1500);
      } else {
        setError(response.error?.message || 'Failed to save account');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Error saving account:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Account' : 'Add New Account'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Update account information' : 'Create a new account'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Type</option>
              {accountTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Opening Balance
            </label>
            <input
              type="number"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Opening Balance Date
            </label>
            <input
              type="date"
              name="openingBalanceDate"
              value={formData.openingBalanceDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>
        </div>

        {/* Bank Details */}
        {(formData.type === 'bank' || formData.type === 'cash') && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  name="bankDetails.accountName"
                  value={formData.bankDetails.accountName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  name="bankDetails.branch"
                  value={formData.bankDetails.branch}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  name="bankDetails.swiftCode"
                  value={formData.bankDetails.swiftCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IBAN
                </label>
                <input
                  type="text"
                  name="bankDetails.iban"
                  value={formData.bankDetails.iban}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => router.push('/system/dashboard/accounting/accounts')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FaTimes className="inline mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? (
              <FaSpinner className="inline mr-2 animate-spin" />
            ) : (
              <FaSave className="inline mr-2" />
            )}
            {saving ? 'Saving...' : isEditing ? 'Update Account' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;

