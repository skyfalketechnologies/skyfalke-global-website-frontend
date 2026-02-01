'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaEdit, 
  FaFilePdf, 
  FaEnvelope, 
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaFileInvoice,
  FaTrash
} from 'react-icons/fa';
// import { useNotifications } from '../../contexts/NotificationContext';

const QuotationView = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  // Notification function - defined at the top level
  const showNotification = React.useCallback((message, type) => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  }, []);

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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
    fetchQuotation();
  }, [id]);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotations/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuotation(data);
      } else {
        showNotification('Failed to fetch quotation', 'error');
        router.push('/system/dashboard/quotations');
      }
    } catch (error) {
      console.error('Error fetching quotation:', error);
      showNotification('Error fetching quotation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/quotations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        showNotification(`Quotation status updated to ${newStatus}`, 'success');
        fetchQuotation();
      } else {
        showNotification('Failed to update quotation status', 'error');
      }
    } catch (error) {
      console.error('Error updating quotation status:', error);
      showNotification('Error updating quotation status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/quotations/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showNotification('Quotation sent successfully', 'success');
        fetchQuotation();
      } else {
        showNotification('Failed to send quotation', 'error');
      }
    } catch (error) {
      console.error('Error sending quotation:', error);
      showNotification('Error sending quotation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvertToInvoice = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/quotations/${id}/convert-to-invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        showNotification('Quotation converted to invoice successfully', 'success');
        router.push(`/system/dashboard/invoices/${data.invoice._id}`);
      } else {
        showNotification('Failed to convert quotation to invoice', 'error');
      }
    } catch (error) {
      console.error('Error converting quotation:', error);
      showNotification('Error converting quotation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const downloadPDF = async (quotationId) => {
    try {
      const response = await fetch(`/api/quotations/${quotationId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
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
        showNotification('Failed to download PDF', 'error');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showNotification('Error downloading PDF', 'error');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const currency = quotation?.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quotation not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The quotation you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/system/dashboard/quotations')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Quotations
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[quotation.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/system/dashboard/quotations')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quotation QT-{quotation.quotationNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Created on {formatDate(quotation.issueDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[quotation.status]}`}>
            <StatusIcon className="mr-1 h-4 w-4" />
            {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap items-center space-x-3">
            <button
              onClick={() => router.push(`/system/dashboard/quotations/${id}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaEdit className="mr-2 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => downloadPDF(id)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaFilePdf className="mr-2 h-4 w-4" />
              Download PDF
            </button>
            {quotation.status !== 'sent' && (
              <button
                onClick={handleSendEmail}
                disabled={actionLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <FaEnvelope className="mr-2 h-4 w-4" />
                {actionLoading ? 'Sending...' : 'Send Email'}
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {quotation.status === 'accepted' && !quotation.convertedToInvoice && (
              <button
                onClick={handleConvertToInvoice}
                disabled={actionLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <FaFileInvoice className="mr-2 h-4 w-4" />
                {actionLoading ? 'Converting...' : 'Convert to Invoice'}
              </button>
            )}
            {quotation.convertedToInvoice && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <FaCheck className="mr-1 h-4 w-4" />
                Converted to Invoice
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Name
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{quotation.client.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{quotation.client.email}</p>
              </div>
              {quotation.client.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{quotation.client.phone}</p>
                </div>
              )}
              {quotation.client.company && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Company
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{quotation.client.company}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Items
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {quotation.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Notes and Terms */}
          {(quotation.notes || quotation.terms) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                {quotation.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Notes
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {quotation.notes}
                    </p>
                  </div>
                )}
                {quotation.terms && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Terms & Conditions
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {quotation.terms}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quotation Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quotation Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Quotation Number
                </label>
                <p className="text-sm text-gray-900 dark:text-white">QT-{quotation.quotationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Issue Date
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(quotation.issueDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Expiry Date
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(quotation.expiryDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[quotation.status]}`}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Currency
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {quotation.currency || 'USD'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pricing Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Pricing Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(quotation.subtotal)}
                </span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    -{formatCurrency(quotation.discount)}
                  </span>
                </div>
              )}
              {quotation.taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tax ({quotation.taxRate}%):
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(quotation.taxAmount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900 dark:text-white">Total:</span>
                  <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(quotation.total)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status Actions */}
          {quotation.status === 'draft' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Status Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusChange('sent')}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  Mark as Sent
                </button>
              </div>
            </motion.div>
          )}

          {quotation.status === 'sent' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Status Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusChange('accepted')}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  Mark as Accepted
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  Mark as Rejected
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationView;
