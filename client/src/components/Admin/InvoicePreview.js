import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaDownload, FaPaperPlane } from 'react-icons/fa';

const InvoicePreview = ({ formData, subtotal, taxAmount, total, onClose, onDownload, onSendEmail }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `INV-${year}${month}${day}-001`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invoice Preview
          </h2>
          <div className="flex items-center gap-3">
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaDownload />
                Download PDF
              </button>
            )}
            {onSendEmail && (
              <button
                onClick={onSendEmail}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPaperPlane />
                Send Email
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="max-w-4xl mx-auto">
            {/* Company Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-primary-500">SKYFALKE</h1>
                    <p className="text-gray-600 dark:text-gray-400">Digital Solutions Partner</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>info@skyfalke.com</p>
                  <p>+254 700 000 000</p>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p><span className="font-medium">Invoice #:</span> {generateInvoiceNumber()}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(formData.issueDate)}</p>
                  <p><span className="font-medium">Due:</span> {formatDate(formData.dueDate)}</p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill To:</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.client.name}</p>
                    {formData.client.company && (
                      <p className="text-gray-600 dark:text-gray-400">{formData.client.company}</p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">{formData.client.email}</p>
                    {formData.client.phone && (
                      <p className="text-gray-600 dark:text-gray-400">{formData.client.phone}</p>
                    )}
                  </div>
                  
                  {(formData.client.address.street || formData.client.address.city) && (
                    <div>
                      {formData.client.address.street && (
                        <p className="text-gray-600 dark:text-gray-400">{formData.client.address.street}</p>
                      )}
                      {(formData.client.address.city || formData.client.address.state) && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {[formData.client.address.city, formData.client.address.state]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      {formData.client.address.zipCode && (
                        <p className="text-gray-600 dark:text-gray-400">{formData.client.address.zipCode}</p>
                      )}
                      {formData.client.address.country && (
                        <p className="text-gray-600 dark:text-gray-400">{formData.client.address.country}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary-500 text-white">
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-medium">
                        Description
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-medium">
                        Qty
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right font-medium">
                        Unit Price
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right font-medium">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                          {item.description}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right font-medium">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {formData.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                      <span className="font-medium">-${formData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {formData.taxRate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tax ({formData.taxRate}%):
                      </span>
                      <span className="font-medium">${taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-primary-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            {formData.paymentInstructions && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Instructions:
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {formData.paymentInstructions}
                </p>
              </div>
            )}

            {/* Notes */}
            {formData.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Notes:
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {formData.notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-6 mt-8">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Thank you for your business!</p>
                <p className="mt-2">
                  For questions about this invoice, please contact us at info@skyfalke.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvoicePreview;
