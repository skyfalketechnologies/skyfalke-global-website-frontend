'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiGet } from '../../utils/api';
import {
  FaShoppingCart,
  FaBox,
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaTruck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaPlus,
  FaEye,
  FaEdit,
  FaArrowRight,
  FaCalendarAlt,
  FaTag,
  FaStar
} from 'react-icons/fa';

const ShopDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsResponse, ordersResponse, productsResponse] = await Promise.all([
              apiGet('/api/shop/admin/stats'),
      apiGet('/api/shop/admin/orders?limit=5'),
      apiGet('/api/shop/admin/products?limit=5')
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (ordersResponse.data.success) {
        setRecentOrders(ordersResponse.data.data.orders);
      }

      if (productsResponse.data.success) {
        setRecentProducts(productsResponse.data.data.products);
      }
    } catch (error) {
      console.error('Error fetching shop dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'text-yellow-600 bg-yellow-100',
      'Confirmed': 'text-blue-600 bg-blue-100',
      'Processing': 'text-purple-600 bg-purple-100',
      'Shipped': 'text-orange-600 bg-orange-100',
      'Delivered': 'text-green-600 bg-green-100',
      'Cancelled': 'text-red-600 bg-red-100',
      'Refunded': 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Pending': 'text-yellow-600 bg-yellow-100',
      'Processing': 'text-blue-600 bg-blue-100',
      'Completed': 'text-green-600 bg-green-100',
      'Failed': 'text-red-600 bg-red-100',
      'Refunded': 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
        <span className="ml-3 text-gray-600">Loading shop dashboard...</span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shop Dashboard - Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shop Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Overview of your e-commerce operations
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link href="/system/dashboard/shop/products/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Product
            </Link>
            <Link href="/system/dashboard/orders"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaEye className="mr-2" />
              View Orders
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.orders?.overview?.totalOrders || 0}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <FaCheckCircle className="text-green-500 mr-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  {stats.orders?.overview?.deliveredOrders || 0} delivered
                </span>
              </div>
            </div>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaMoneyBillWave className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.orders?.overview?.totalRevenue)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <FaChartLine className="text-green-500 mr-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  Avg: {formatCurrency(stats.orders?.overview?.averageOrderValue)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Total Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FaBox className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.products?.totalProducts || 0}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <FaCheckCircle className="text-green-500 mr-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  {stats.products?.activeProducts || 0} active
                </span>
              </div>
            </div>
          </motion.div>

          {/* Pending Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FaTruck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.orders?.overview?.pendingOrders || 0}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <FaExclamationTriangle className="text-orange-500 mr-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  {stats.orders?.overview?.processingOrders || 0} processing
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h3>
                <Link href="/system/dashboard/orders"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <FaShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            #{order.orderNumber}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{order.customer.firstName} {order.customer.lastName}</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.payment.status)}`}>
                            {order.payment.status}
                          </span>
                        </div>
                      </div>
                      <Link href={`/system/dashboard/orders/${order._id}`}
                        className="ml-4 text-primary-600 hover:text-primary-700"
                      >
                        <FaArrowRight />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Products
                </h3>
                <Link href="/system/dashboard/shop/products"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentProducts.length === 0 ? (
                <div className="text-center py-8">
                  <FaBox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No products yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center flex-1">
                        <img
                          src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="flex items-center">
                              <FaTag className="mr-1" />
                              {product.category}
                            </span>
                            <span className="flex items-center">
                              <FaStar className="mr-1" />
                              {product.rating.average.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </span>
                        <Link href={`/system/dashboard/shop/products/edit/${product._id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <FaEdit />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/system/dashboard/shop/products/new"
              className="flex items-center p-4 bg-primary-50 dark:bg-primary-900 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            >
              <FaPlus className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
                <p className="font-medium text-primary-900 dark:text-primary-100">Add New Product</p>
                <p className="text-sm text-primary-700 dark:text-primary-300">Create a new product listing</p>
              </div>
            </Link>
            
            <Link href="/system/dashboard/shop/products"
              className="flex items-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              <FaBox className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Manage Products</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">View and edit products</p>
              </div>
            </Link>
            
            <Link href="/system/dashboard/orders"
              className="flex items-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
            >
              <FaShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-100">Manage Orders</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">View and process orders</p>
              </div>
            </Link>
            
            <Link href="/system/dashboard/shop/coupons"
              className="flex items-center p-4 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
            >
              <FaTag className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Manage Coupons</p>
                <p className="text-sm text-green-700 dark:text-green-300">Create and manage discounts</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ShopDashboard;
