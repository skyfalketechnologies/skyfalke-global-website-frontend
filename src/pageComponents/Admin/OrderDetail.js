'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiGet, apiPatch } from '../../utils/api';
import {
  FaArrowLeft,
  FaShoppingCart,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
  FaBox,
  FaSpinner,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPrint,
  FaDownload,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaShippingFast,
  FaTag
} from 'react-icons/fa';

const OrderDetail = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiGet(`/api/orders/admin/${id}`);
      if (response.data.success) {
        setOrder(response.data.data.order);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error.response?.status === 404) {
        setError('Order not found');
        setTimeout(() => router.push('/system/dashboard/orders'), 2000);
      } else {
        setError('Failed to fetch order details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      setUpdating(true);
      setError('');
      const response = await apiPatch(`/api/orders/admin/${id}/status`, {
        status: newStatus,
        notes: statusNotes
      });

      if (response.data.success) {
        setSuccess('Order status updated successfully');
        setShowStatusModal(false);
        setNewStatus('');
        setStatusNotes('');
        setTimeout(() => setSuccess(''), 3000);
        fetchOrder();
      } else {
        setError('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return <FaCreditCard />;
      case 'mpesa':
        return <FaMoneyBillWave />;
      case 'paypal':
        return <FaCreditCard />;
      default:
        return <FaCreditCard />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">Order not found</p>
              <p className="text-sm text-red-700 dark:text-red-300">Redirecting to orders list...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order #{order.orderNumber} | Admin | Skyfalke</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/system/dashboard/orders')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FaShoppingCart className="text-primary-500" />
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              <FaPrint />
              Print
            </button>
            <button
              onClick={() => {
                setNewStatus(order.status);
                setShowStatusModal(true);
              }}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
            >
              <FaEdit />
              Update Status
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
            <FaCheckCircle className="text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
            <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaBox />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      {item.sku && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku}</p>
                      )}
                      {item.variant && Object.keys(item.variant).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {Object.entries(item.variant).map(([key, value]) => (
                            <span key={key} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity} × {formatPrice(item.price)}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice(item.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaUser />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">
                    <a href={`mailto:${order.customer.email}`} className="text-primary-600 hover:text-primary-700">
                      {order.customer.email}
                    </a>
                  </p>
                </div>
                {order.customer.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                    <p className="text-gray-900 dark:text-white">
                      <a href={`tel:${order.customer.phone}`} className="text-primary-600 hover:text-primary-700">
                        {order.customer.phone}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt />
                Billing Address
              </h2>
              <div className="text-gray-700 dark:text-gray-300">
                <p className="font-medium">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                <p>{order.billingAddress.address}</p>
                <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                <p>{order.billingAddress.country}</p>
                <p className="mt-2">
                  <a href={`mailto:${order.billingAddress.email}`} className="text-primary-600 hover:text-primary-700">
                    {order.billingAddress.email}
                  </a>
                </p>
                {order.billingAddress.phone && (
                  <p>
                    <a href={`tel:${order.billingAddress.phone}`} className="text-primary-600 hover:text-primary-700">
                      {order.billingAddress.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaTruck />
                  Shipping Address
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2">
                      <a href={`tel:${order.shippingAddress.phone}`} className="text-primary-600 hover:text-primary-700">
                        {order.shippingAddress.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Customer Notes */}
            {order.notes?.customer && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaTag />
                  Customer Notes
                </h2>
                <p className="text-gray-700 dark:text-gray-300">{order.notes.customer}</p>
              </div>
            )}

            {/* Admin Notes */}
            {order.notes?.admin && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaTag />
                  Admin Notes
                </h2>
                <p className="text-gray-700 dark:text-gray-300">{order.notes.admin}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(order.subtotal)}</span>
                </div>
                {order.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.shipping)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.tax)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                    <span className="text-green-600 dark:text-green-400">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Order Date</label>
                  <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated</label>
                    <p className="mt-1 text-gray-900 dark:text-white flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      {formatDate(order.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {getPaymentMethodIcon(order.payment.method)}
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Method</label>
                  <p className="mt-1 text-gray-900 dark:text-white capitalize">{order.payment.method}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(order.payment.status)}`}>
                      {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                    </span>
                  </div>
                </div>
                {order.payment.transactionId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Transaction ID</label>
                    <p className="mt-1 text-gray-900 dark:text-white font-mono text-sm">{order.payment.transactionId}</p>
                  </div>
                )}
                {order.payment.mpesaCheckoutRequestId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">M-Pesa Checkout Request ID</label>
                    <p className="mt-1 text-gray-900 dark:text-white font-mono text-sm">{order.payment.mpesaCheckoutRequestId}</p>
                  </div>
                )}
                {order.payment.paypalOrderId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">PayPal Order ID</label>
                    <p className="mt-1 text-gray-900 dark:text-white font-mono text-sm">{order.payment.paypalOrderId}</p>
                  </div>
                )}
                {order.payment.processedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Processed At</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{formatDate(order.payment.processedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            {order.shipping && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaShippingFast />
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  {order.shipping.method && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Method</label>
                      <p className="mt-1 text-gray-900 dark:text-white capitalize">{order.shipping.method}</p>
                    </div>
                  )}
                  {order.shipping.trackingNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tracking Number</label>
                      <p className="mt-1 text-gray-900 dark:text-white font-mono">{order.shipping.trackingNumber}</p>
                    </div>
                  )}
                  {order.shipping.carrier && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Carrier</label>
                      <p className="mt-1 text-gray-900 dark:text-white">{order.shipping.carrier}</p>
                    </div>
                  )}
                  {order.shipping.estimatedDelivery && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Delivery</label>
                      <p className="mt-1 text-gray-900 dark:text-white">{formatDate(order.shipping.estimatedDelivery)}</p>
                    </div>
                  )}
                  {order.shipping.shippedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Shipped At</label>
                      <p className="mt-1 text-gray-900 dark:text-white">{formatDate(order.shipping.shippedAt)}</p>
                    </div>
                  )}
                  {order.shipping.deliveredAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered At</label>
                      <p className="mt-1 text-gray-900 dark:text-white">{formatDate(order.shipping.deliveredAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Update Order Status</h3>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('');
                    setStatusNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    rows="3"
                    placeholder="Add notes about this status change..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('');
                    setStatusNotes('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || !newStatus}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetail;

