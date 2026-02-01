'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiGet, apiDelete } from '../../utils/api';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaPaperPlane,
  FaSearch,
  FaFilter,
  FaFileInvoice,
  FaDollarSign,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimesCircle
} from 'react-icons/fa';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchInvoices();
    fetchStats();
  }, [currentPage, statusFilter, searchTerm]);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { client: searchTerm })
      });

      const response = await apiGet(`/api/invoices?${params}`);
      if (response.data.success) {
        setInvoices(response.data.data.invoices);
        setTotalPages(response.data.data.pagination.pages);
      }
    } catch (error) {
      // Network errors are expected when API server is not running
      // They're already logged by the API interceptor, so we don't need to log again
      const isNetworkError = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response;
      if (!isNetworkError) {
        console.error('Error fetching invoices:', error);
        setError('Failed to fetch invoices');
      }
      // Set empty arrays on network error to prevent UI from breaking
      setInvoices([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiGet('/api/invoices/stats/overview');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      // Network errors are expected when API server is not running
      // They're already logged by the API interceptor, so we don't need to log again
      const isNetworkError = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response;
      if (!isNetworkError) {
        console.error('Error fetching stats:', error);
      }
      // Set default stats on error
      setStats({});
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      const response = await apiDelete(`/api/invoices/${id}`);
      if (response.data.success) {
        setSuccess('Invoice deleted successfully');
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setError('Failed to delete invoice');
    }
  };

  const downloadPDF = async (id) => {
    try {
      const response = await fetch(`/api/invoices/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF');
    }
  };

  const sendEmail = async (id) => {
    try {
      setSendingEmails(prev => new Set(prev).add(id));
      const response = await apiGet(`/api/invoices/${id}/send`);
      if (response.data.success) {
        setSuccess('Invoice sent successfully');
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      setError('Failed to send invoice');
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FaCheckCircle className="text-green-500" />;
      case 'sent':
        return <FaPaperPlane className="text-blue-500" />;
      case 'overdue':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-gray-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Invoices - Skyfalke Admin</title>
        <meta name="description" content="Manage invoices and billing" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <div className="flex">
              <FaCheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FaFileInvoice className="text-primary-500" />
                Invoices
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your invoices and billing
              </p>
            </div>
            
            <Link href="/system/dashboard/invoices/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <FaPlus />
              New Invoice
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaFileInvoice className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalInvoices || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaDollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${(stats.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <FaClock className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.stats?.find(s => s._id === 'draft')?.count || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <FaExclamationTriangle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.stats?.find(s => s._id === 'overdue')?.count || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaFileInvoice className="text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.formattedNumber}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Due: {new Date(invoice.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.client.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.client.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-400 mr-3" />
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ${invoice.total.toFixed(2)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">{invoice.status}</span>
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => downloadPDF(invoice._id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Download PDF"
                          >
                            <FaDownload />
                          </button>
                          
                          {invoice.status === 'draft' && (
                            <button
                              onClick={() => sendEmail(invoice._id)}
                              disabled={sendingEmails.has(invoice._id)}
                              className={`text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                sendingEmails.has(invoice._id) ? 'animate-pulse' : ''
                              }`}
                              title={sendingEmails.has(invoice._id) ? "Sending..." : "Send Email"}
                            >
                              {sendingEmails.has(invoice._id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <FaPaperPlane />
                              )}
                            </button>
                          )}
                          
                          <Link href={`/system/dashboard/invoices/${invoice._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Edit Invoice"
                          >
                            <FaEdit />
                          </Link>
                          
                          <button
                            onClick={() => deleteInvoice(invoice._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete Invoice"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing page {currentPage} of {totalPages}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
