'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlus, FaFileAlt, FaSpinner, FaDownload, FaCheck, FaChartLine, FaFileInvoice } from 'react-icons/fa';
import { adminApiGet, adminApiPost } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const Reports = () => {
  const { isSuperAdmin } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: 'profit-loss',
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    accounts: []
  });
  const [availableAccounts, setAvailableAccounts] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchAccounts();
  }, []);

  if (!isSuperAdmin()) {
    return <Navigate to="/system/dashboard" replace />;
  }

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminApiGet('/api/accounting/reports');
      if (response.success && response.data) {
        setReports(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await adminApiGet('/api/accounting/accounts?isActive=true');
      if (response.success && response.data) {
        setAvailableAccounts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const response = await adminApiPost('/api/accounting/reports/generate', reportForm);
      if (response.success) {
        setShowGenerateModal(false);
        fetchReports();
        setReportForm({
          type: 'profit-loss',
          startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          accounts: []
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this report?')) {
      try {
        const response = await adminApiPost(`/api/accounting/reports/${id}/approve`);
        if (response.success) {
          fetchReports();
        }
      } catch (error) {
        console.error('Error approving report:', error);
        alert('Failed to approve report');
      }
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'profit-loss':
      case 'income-statement':
        return FaChartLine;
      case 'balance-sheet':
        return FaFileInvoice;
      default:
        return FaFileAlt;
    }
  };

  if (loading && reports.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Reports</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Generate and manage financial reports</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <FaPlus className="mr-2 -ml-1 h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const ReportIcon = getReportTypeIcon(report.type);
          return (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <ReportIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {report.type?.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.status === 'final'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {report.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Period:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(report.period?.startDate).toLocaleDateString()} - {new Date(report.period?.endDate).toLocaleDateString()}
                  </span>
                </div>
                {report.summary && (
                  <>
                    {report.summary.totalIncome !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Total Income:</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {report.currency} {report.summary.totalIncome?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {report.summary.totalExpenses !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Total Expenses:</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {report.currency} {report.summary.totalExpenses?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {report.summary.netIncome !== undefined && (
                      <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-gray-100">Net Income:</span>
                        <span className={`${
                          report.summary.netIncome >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {report.currency} {report.summary.netIncome?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href={`/system/dashboard/accounting/reports/${report._id}`}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 rounded-md hover:bg-primary-50"
                >
                  <FaFileAlt className="inline mr-2" />
                  View
                </Link>
                {report.status === 'draft' && isSuperAdmin() && (
                  <button
                    onClick={() => handleApprove(report._id)}
                    className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 rounded-md hover:bg-green-50"
                  >
                    <FaCheck className="inline mr-2" />
                    Approve
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {reports.length === 0 && !loading && (
        <div className="text-center py-12">
          <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No reports</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by generating a new financial report.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <FaPlus className="mr-2 -ml-1 h-4 w-4" />
              Generate Report
            </button>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Generate Financial Report</h3>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Report Type
                  </label>
                  <select
                    value={reportForm.type}
                    onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                    required
                  >
                    <option value="profit-loss">Profit & Loss</option>
                    <option value="balance-sheet">Balance Sheet</option>
                    <option value="cash-flow">Cash Flow</option>
                    <option value="income-statement">Income Statement</option>
                    <option value="expense-report">Expense Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={reportForm.startDate}
                    onChange={(e) => setReportForm({ ...reportForm, startDate: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={reportForm.endDate}
                    onChange={(e) => setReportForm({ ...reportForm, endDate: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

