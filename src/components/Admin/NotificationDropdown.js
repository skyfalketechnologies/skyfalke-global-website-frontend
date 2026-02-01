import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FaBell, 
  FaTimes, 
  FaCheck, 
  FaTrash, 
  FaEnvelope, 
  FaShoppingCart, 
  FaFileAlt, 
  FaUser,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { 
    notifications, 
    unreadCount,
    totalCount,
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle bell click
  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const getNotificationIcon = (type, category) => {
    switch (type) {
      case 'contact':
        return FaEnvelope;
      case 'order':
        return FaShoppingCart;
      case 'blog':
        return FaFileAlt;
      case 'application':
        return FaUser;
      case 'warning':
        return FaExclamationTriangle;
      case 'success':
        return FaCheckCircle;
      case 'info':
        return FaInfoCircle;
      default:
        return FaBell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'contact':
        return 'text-blue-500 bg-blue-100';
      case 'order':
        return 'text-green-500 bg-green-100';
      case 'blog':
        return 'text-purple-500 bg-purple-100';
      case 'application':
        return 'text-orange-500 bg-orange-100';
      case 'warning':
        return 'text-yellow-500 bg-yellow-100';
      case 'success':
        return 'text-green-500 bg-green-100';
      case 'error':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
  };

  // Transform old notification URLs to new structure
  const transformNotificationUrl = (url) => {
    if (!url) return url;
    
    // Transform old admin URLs to new system dashboard URLs
    return url
      .replace(/^\/admin\/contacts\//, '/system/dashboard/contacts/')
      .replace(/^\/admin\/applications\//, '/system/dashboard/applications/')
      .replace(/^\/admin\/orders\//, '/system/dashboard/orders/')
      .replace(/^\/admin\/notifications/, '/system/dashboard/notifications')
      .replace(/^\/admin\/blogs\//, '/system/dashboard/blogs/')
      .replace(/^\/admin\/case-studies\//, '/system/dashboard/case-studies/')
      .replace(/^\/admin\/shop\/products\//, '/system/dashboard/shop/products/');
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
      >
        <FaBell className="h-6 w-6" />
        
        {/* Notification Badge - Always show when there are notifications */}
        {notifications.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium ${
              unreadCount > 0 ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {unreadCount > 0 ? (unreadCount > 99 ? '99+' : unreadCount) : notifications.length > 99 ? '99+' : notifications.length}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <FaClock className="h-6 w-6 mx-auto mb-2 animate-spin" />
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <FaBell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.slice(0, 10).map((notification) => {
                    const Icon = getNotificationIcon(notification.type, notification.category);
                    return (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  !notification.read 
                                    ? 'text-gray-900 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                  {formatTimeAgo(notification.createdAt)}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification._id)}
                                    className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                                    title="Mark as read"
                                  >
                                    <FaCheck className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification._id)}
                                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                  title="Delete"
                                >
                                  <FaTrash className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            {/* Action URL */}
                            {notification.actionUrl && (
                              <Link href={transformNotificationUrl(notification.actionUrl)}
                                onClick={() => handleNotificationClick(notification)}
                                className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                View details →
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 10 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <Link href="/system/dashboard/notifications"
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
