'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaFilePdf, 
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaFileInvoice
} from 'react-icons/fa';
import { apiGet, apiDelete, apiPost, API_BASE_URL } from '../../utils/api';
// import { useNotifications } from '../../contexts/NotificationContext';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);
  // Notification function - defined at the top level
  const showNotification = React.useCallback((message, type) => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  }, []);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-orange-100 text-orange-800'
  };

  const statusIcons = {
    draft: FaClock,
    sent: FaEnvelope,
    accepted: FaCheck,
    rejected: FaTimes,
    expired: FaExclamationTriangle
  };

  useEffect(() => {
    fetchQuotations();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await apiGet(`/api/quotations?${params}`);
      
      if (response.data) {
        setQuotations(response.data.quotations || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      // Network errors are expected when API server is not running
      // They're already logged by the API interceptor, so we don't need to log again
      const isNetworkError = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response;
      
      if (isNetworkError) {
        // Set empty arrays on network error to prevent UI from breaking
        setQuotations([]);
        setTotalPages(1);
      } else {
        // Only log and show notifications for non-network errors
        console.error('Error fetching quotations:', error);
        if (error.response?.status === 503) {
          showNotification('Service temporarily unavailable. Please try again later.', 'error');
        } else if (error.response?.status >= 500) {
          showNotification('Server error. Please try again later.', 'error');
        } else {
          showNotification('Error fetching quotations', 'error');
        }
        setQuotations([]);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quotationId) => {
    try {
      await apiDelete(`/api/quotations/${quotationId}`);
      showNotification('Quotation deleted successfully', 'success');
      fetchQuotations();
      setShowDeleteModal(false);
      setQuotationToDelete(null);
    } catch (error) {
      console.error('Error deleting quotation:', error);
      if (error.response?.status === 503) {
        showNotification('Service temporarily unavailable. Please try again later.', 'error');
      } else {
        showNotification('Failed to delete quotation', 'error');
      }
    }
  };

  const handleSendEmail = async (quotationId) => {
    try {
      setSendingEmails(prev => new Set(prev).add(quotationId));
      await apiPost(`/api/quotations/${quotationId}/send`);
      showNotification('Quotation sent successfully', 'success');
      fetchQuotations();
    } catch (error) {
      console.error('Error sending quotation:', error);
      if (error.response?.status === 503) {
        showNotification('Service temporarily unavailable. Please try again later.', 'error');
      } else {
        showNotification('Failed to send quotation', 'error');
      }
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(quotationId);
        return newSet;
      });
    }
  };

  const handleConvertToInvoice = async (quotationId) => {
    try {
      await apiPost(`/api/quotations/${quotationId}/convert-to-invoice`);
      showNotification('Quotation converted to invoice successfully', 'success');
      fetchQuotations();
    } catch (error) {
      console.error('Error converting quotation:', error);
      if (error.response?.status === 503) {
        showNotification('Service temporarily unavailable. Please try again later.', 'error');
      } else {
        showNotification('Failed to convert quotation to invoice', 'error');
      }
    }
  };

  const downloadPDF = async (quotationId) => {
    try {
      // For PDF downloads, we need to use fetch to handle blob response
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/quotations/${quotationId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Check if response is actually a PDF (blob) and not HTML error page
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/pdf')) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `quotation-${quotationId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          showNotification('PDF downloaded successfully', 'success');
        } else {
          // Response is not a PDF, likely an error page
          const text = await response.text();
          if (text.trim().startsWith('<!')) {
            showNotification('Server error: Received HTML instead of PDF', 'error');
          } else {
            showNotification('Failed to download PDF', 'error');
          }
        }
      } else {
        if (response.status === 503) {
          showNotification('Service temporarily unavailable. Please try again later.', 'error');
        } else {
          showNotification('Failed to download PDF', 'error');
        }
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        showNotification('Network error. Please check your connection.', 'error');
      } else {
        showNotification('Error downloading PDF', 'error');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotations</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and track your quotations
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/system/dashboard/quotations/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            New Quotation
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchQuotations}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <FaFilter className="mr-2 h-4 w-4" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : quotations.length === 0 ? (
          <div className="text-center py-12">
            <FaFileInvoice className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No quotations</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new quotation.
            </p>
            <div className="mt-6">
              <Link href="/system/dashboard/quotations/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                New Quotation
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quotation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {quotations.map((quotation) => {
                  const StatusIcon = statusIcons[quotation.status];
                  return (
                    <motion.tr
                      key={quotation._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            QT-{quotation.quotationNumber}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Valid until {formatDate(quotation.expiryDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {quotation.client.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {quotation.client.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(quotation.total, quotation.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[quotation.status]}`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(quotation.issueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link href={`/system/dashboard/quotations/${quotation._id}`}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            title="View"
                          >
                            <FaEye className="h-4 w-4" />
                          </Link>
                          <Link href={`/system/dashboard/quotations/${quotation._id}/edit`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit"
                          >
                            <FaEdit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => downloadPDF(quotation._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Download PDF"
                          >
                            <FaFilePdf className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSendEmail(quotation._id)}
                            disabled={quotation.status === 'sent' || sendingEmails.has(quotation._id)}
                            className={`text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                              sendingEmails.has(quotation._id) ? 'animate-pulse' : ''
                            }`}
                            title={sendingEmails.has(quotation._id) ? "Sending..." : "Send Email"}
                          >
                            {sendingEmails.has(quotation._id) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <FaEnvelope className="h-4 w-4" />
                            )}
                          </button>
                          {quotation.status === 'accepted' && !quotation.convertedToInvoice && (
                            <button
                              onClick={() => handleConvertToInvoice(quotation._id)}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              title="Convert to Invoice"
                            >
                              <FaFileInvoice className="h-4 w-4" />
                            </button>
                          )}
                          {quotation.status === 'draft' && (
                            <button
                              onClick={() => {
                                setQuotationToDelete(quotation);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2">
                Delete Quotation
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete quotation QT-{quotationToDelete?.quotationNumber}? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setQuotationToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(quotationToDelete._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationList;
