'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchDashboardData, handleAdminApiError } from '../../utils/adminApi';
import { apiGet } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  FaBlog,
  FaEnvelope,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartLine,
  FaCalendarAlt,
  FaRss,
  FaSpinner,
  FaShoppingCart,
  FaUserTie,
  FaHandshake,
  FaCheckCircle,
  FaClock,
  FaBell,
  FaFileInvoice,
  FaGraduationCap,
  FaExclamationTriangle,
  FaTimes,
  FaWhatsapp,
  FaExternalLinkAlt
} from 'react-icons/fa';

const Dashboard = () => {
  const router = useRouter();
  const { canAccessAccounting, user } = useAuth();
  const { socket } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'employee') {
      router.replace('/system/dashboard/portal');
    }
  }, [user?.role, router]);
  const [apiError, setApiError] = useState(null);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalBlogs: 0,
    totalContacts: 0,
    totalViews: 0,
    totalSubscriptions: 0,
    totalOrders: 0,
    totalApplications: 0,
    totalPartnerships: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    pendingContacts: 0,
    pendingApplications: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [waConversations, setWaConversations] = useState([]);
  const [waLoading, setWaLoading] = useState(true);
  const [changes, setChanges] = useState({
    contacts: { value: 0, type: 'increase' },
    visitors: { value: 0, type: 'increase' }
  });

  useEffect(() => {
    fetchDashboardDataHandler();
    fetchWhatsAppConversations();
    // Fallback poll in case the websocket connection drops
    const waInterval = setInterval(() => fetchWhatsAppConversations(true), 30000);
    return () => clearInterval(waInterval);
  }, [canAccessAccounting]);

  // Real-time refresh via websocket when a new WhatsApp message arrives
  useEffect(() => {
    if (!socket) return;
    const handleNotification = (data) => {
      if (data?.notification?.type !== 'whatsapp') return;
      fetchWhatsAppConversations(true);
    };
    socket.on('new-notification', handleNotification);
    return () => socket.off('new-notification', handleNotification);
  }, [socket]);

  const fetchWhatsAppConversations = async (silent = false) => {
    try {
      if (!silent) setWaLoading(true);
      const response = await apiGet('/api/whatsapp/admin/conversations?limit=5');
      setWaConversations(response.data.conversations || []);
    } catch (error) {
      console.warn('Error fetching WhatsApp conversations:', error);
    } finally {
      if (!silent) setWaLoading(false);
    }
  };

  const fetchDashboardDataHandler = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Fetch all dashboard data in parallel with error handling
      const [
        dashboardRes,
        projectsRes,
        ordersRes,
        applicationsRes,
        contactsRes,
        accountingRes
      ] = await Promise.all([
        fetchDashboardData().catch((error) => {
          console.warn('Dashboard data fetch failed:', error);
          return {
            overview: { success: false, data: { data: { stats: {}, changes: {} } } },
            activity: { success: false, data: [] },
            contacts: { success: false, data: [] },
            blogs: { success: false, data: [] }
          };
        }),
        apiGet('/api/projects?limit=1000').catch(() => ({ data: { success: false, data: [] } })),
        apiGet('/api/orders?limit=1000').catch(() => ({ data: { success: false, data: [] } })),
        apiGet('/api/applications/stats').catch(() => ({ data: { success: false, data: {} } })),
        apiGet('/api/contact?status=new&limit=1000').catch(() => ({ data: { success: false, data: [] } })),
        canAccessAccounting()
          ? apiGet('/api/accounting/transactions/stats').catch(() => ({ data: { success: false, data: {} } }))
          : Promise.resolve({ data: { success: false, data: {} } })
      ]);

      const { overview, activity, contacts, blogs } = dashboardRes;

      // Set overview data
      if (overview.success && overview.data) {
        const overviewData = overview.data;
        
        const statsData = {
          totalVisitors: overviewData.data?.stats?.totalVisitors || 0,
          totalBlogs: overviewData.data?.stats?.totalBlogs || 0,
          totalContacts: overviewData.data?.stats?.totalContacts || 0,
          totalViews: overviewData.data?.stats?.totalViews || 0,
          totalSubscriptions: overviewData.data?.stats?.totalSubscriptions || 0,
          totalOrders: overviewData.data?.stats?.totalOrders || 0,
          totalApplications: overviewData.data?.stats?.totalApplications || 0,
          totalPartnerships: overviewData.data?.stats?.totalPartnerships || 0,
          totalProjects: 0,
          activeProjects: 0,
          totalRevenue: 0,
          totalExpenses: 0,
          pendingContacts: 0,
          pendingApplications: 0
        };

        // Add projects data
        if (projectsRes.data.success && projectsRes.data.data) {
          const projects = projectsRes.data.data;
          statsData.totalProjects = projects.length || 0;
          statsData.activeProjects = projects.filter(p => p.status === 'active').length || 0;
        }

        // Add revenue data
        if (ordersRes.data.success && ordersRes.data.data) {
          const orders = Array.isArray(ordersRes.data.data) ? ordersRes.data.data : [];
          statsData.totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        }

        // Add expenses data
        if (accountingRes.data.success && accountingRes.data.data) {
          statsData.totalExpenses = accountingRes.data.data.totalExpenses || 0;
        }

        // Add pending contacts
        if (contactsRes.data.success && Array.isArray(contactsRes.data.data)) {
          statsData.pendingContacts = contactsRes.data.data.length || 0;
        }

        // Add pending applications
        if (applicationsRes.data.success && applicationsRes.data.data) {
          statsData.pendingApplications = applicationsRes.data.data.pending || 0;
        }

        setStats(statsData);
        setChanges(overviewData.data?.changes || {
          contacts: { value: 0, type: 'increase' },
          visitors: { value: 0, type: 'increase' }
        });
      }

      // Set recent activity
      const activityData = activity.success && Array.isArray(activity.data?.data) ? activity.data.data : [];
      setRecentActivity(activityData);

      // Set recent contacts
      const contactsData = contacts.success && Array.isArray(contacts.data?.data) ? contacts.data.data : [];
      setRecentContacts(contactsData);

      // Set recent blogs
      const blogsData = blogs.success && Array.isArray(blogs.data?.data) ? blogs.data.data : [];
      setRecentBlogs(blogsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to load dashboard data');
      
      // Check if it's a network error (API server not running)
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        setApiError('API server is not accessible. Please ensure the backend server is running on http://localhost:5000');
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Unified stats row - consistent card sizing for a cleaner, professional layout
  const statCards = [
    {
      title: 'Pending Actions',
      value: stats.pendingContacts + stats.pendingApplications,
      icon: FaBell,
      change: `${stats.pendingContacts} contacts, ${stats.pendingApplications} applications`,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      link: '/system/dashboard/contacts',
      highlight: true
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FaShoppingCart,
      change: `KES ${stats.totalRevenue.toLocaleString()} revenue`,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      link: '/system/dashboard/orders'
    },
    {
      title: 'Job Applications',
      value: stats.totalApplications,
      icon: FaUserTie,
      change: `${stats.pendingApplications} pending`,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      iconColor: 'text-teal-600 dark:text-teal-400',
      link: '/system/dashboard/applications'
    },
    {
      title: 'Contact Inquiries',
      value: stats.totalContacts,
      icon: FaEnvelope,
      change: `${changes.contacts.value}% vs last period`,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
      link: '/system/dashboard/contacts'
    },
    {
      title: 'Subscriptions',
      value: stats.totalSubscriptions,
      icon: FaRss,
      change: `${stats.totalSubscriptions} active`,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      link: '/system/dashboard/subscriptions'
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      new: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
      in_progress: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'blog': return FaBlog;
      case 'contact': return FaEnvelope;
      case 'order': return FaShoppingCart;
      case 'application': return FaUserTie;
      case 'partnership': return FaHandshake;
      default: return FaChartLine;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* API Error Banner */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                API Connection Issue
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>{apiError}</p>
                <p className="mt-2">
                  The dashboard will display with limited data. Please start the backend server to see full statistics.
                </p>
              </div>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="ml-auto flex-shrink-0 text-yellow-400 hover:text-yellow-500"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Dashboard
          </motion.h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your business.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchDashboardDataHandler}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? (
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FaChartLine className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link href="/system/dashboard/blogs"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            New Blog Post
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border ${
                stat.highlight ? 'border-orange-200 dark:border-orange-900/50' : 'border-gray-100 dark:border-gray-700'
              } ${stat.link ? 'cursor-pointer' : ''}`}
              onClick={stat.link ? () => router.push(stat.link) : undefined}
            >
              <div className="p-5">
                <div className={`inline-flex p-2.5 rounded-lg ${stat.bgColor} mb-3`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                {stat.change && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 truncate">
                    {stat.change}
                  </p>
                )}
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WhatsApp */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col"
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaWhatsapp className="text-[#25D366]" /> WhatsApp
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {waLoading ? (
              <div className="flex justify-center py-10">
                <FaSpinner className="animate-spin text-xl text-[#25D366]" />
              </div>
            ) : waConversations.length > 0 ? (
              waConversations.map((conv) => {
                const msg = conv.lastMessage || {};
                const preview = msg.body || msg.caption || (msg.type && msg.type !== 'text' ? `[${msg.type}]` : '');
                const time = msg.timestamp
                  ? new Date(msg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : '';
                return (
                  <Link
                    key={conv._id}
                    href={`/system/dashboard/whatsapp?phone=${encodeURIComponent(conv._id)}`}
                    className="flex items-center justify-between gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conv.contactName || conv._id}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {msg.direction === 'outbound' ? 'You: ' : ''}{preview || 'No messages'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">{time}</span>
                      {conv.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#25D366] text-white text-[10px] font-semibold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 dark:text-gray-400">
                <FaWhatsapp className="text-3xl mb-2 opacity-40" />
                <p className="text-sm">No conversations yet</p>
              </div>
            )}
          </div>
          <div className="p-5 pt-4 mt-auto">
            <Link href="/system/dashboard/whatsapp"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              View more <FaExternalLinkAlt className="ml-2 text-[10px]" />
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <div className="p-5">
            <div className="flow-root">
              <ul className="-mb-6">
                {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, index, arr) => {
                  const Icon = getActivityIcon(activity.type);
                  const timeAgo = new Date(activity.time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <li key={activity.id || index}>
                      <div className="relative pb-6">
                        {index !== arr.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div className="min-w-0">
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{activity.action || 'Activity'}</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.title || 'No details available'}</p>
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {timeAgo}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }) : (
                  <li className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No recent activity
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-4">
              <Link href="/system/dashboard/analytics"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                View more
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Blog Posts
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {recentBlogs.length > 0 ? recentBlogs.slice(0, 5).map((blog) => {
                const blogDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div key={blog._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {blog.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(blog.status)}`}>
                          {blog.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {blog.views || 0} views
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {blogDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4 shrink-0">
                      <Link href={`/system/dashboard/blogs/${blog._id}/edit`} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        <FaEdit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No blog posts yet
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/system/dashboard/blogs"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                View more
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Contact Inquiries
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentContacts.length > 0 ? recentContacts.slice(0, 5).map((contact) => {
                const contactDate = new Date(contact.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
                
                return (
                  <tr key={contact._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {contact.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(contact.status)}`}>
                        {contact.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {contactDate}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No contact inquiries yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link href="/system/dashboard/contacts"
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            View more
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
