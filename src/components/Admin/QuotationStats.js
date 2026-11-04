import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileInvoice, 
  FaDollarSign, 
  FaClock, 
  FaEnvelope, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle,
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const QuotationStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quotations/stats/overview', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching quotation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <FaFileInvoice className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No data available</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Unable to load quotation statistics.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Quotations',
      value: formatNumber(stats.totalQuotations),
      icon: FaFileInvoice,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue),
      icon: FaDollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Draft Quotations',
      value: formatNumber(stats.draftQuotations),
      icon: FaClock,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700'
    },
    {
      title: 'Sent Quotations',
      value: formatNumber(stats.sentQuotations),
      icon: FaEnvelope,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Accepted Quotations',
      value: formatNumber(stats.acceptedQuotations),
      icon: FaCheck,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Rejected Quotations',
      value: formatNumber(stats.rejectedQuotations),
      icon: FaTimes,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900'
    },
    {
      title: 'Expired Quotations',
      value: formatNumber(stats.expiredQuotations),
      icon: FaExclamationTriangle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ];

  // Calculate acceptance rate
  const totalProcessed = stats.sentQuotations + stats.acceptedQuotations + stats.rejectedQuotations;
  const acceptanceRate = totalProcessed > 0 ? (stats.acceptedQuotations / totalProcessed) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.slice(0, 4).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Status Breakdown
          </h3>
          <div className="space-y-4">
            {statCards.slice(3).map((stat, index) => {
              const Icon = stat.icon;
              const percentage = stats.totalQuotations > 0 ? (stat.value.replace(/,/g, '') / stats.totalQuotations) * 100 : 0;
              
              return (
                <div key={stat.title} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-2 rounded-md ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-2 rounded-md bg-green-100 dark:bg-green-900">
                  <FaChartLine className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Acceptance Rate
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Accepted vs Sent + Accepted + Rejected
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {acceptanceRate.toFixed(1)}%
                </p>
                <div className="flex items-center">
                  {acceptanceRate >= 50 ? (
                    <FaArrowUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <FaArrowDown className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-2 rounded-md bg-blue-100 dark:bg-blue-900">
                  <FaDollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Average Value
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total value per quotation
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.totalQuotations > 0 ? formatCurrency(stats.totalValue / stats.totalQuotations) : '$0.00'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-2 rounded-md bg-purple-100 dark:bg-purple-900">
                  <FaFileInvoice className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Conversion Rate
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Accepted to total quotations
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.totalQuotations > 0 ? ((stats.acceptedQuotations / stats.totalQuotations) * 100).toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.draftQuotations}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Draft quotations need attention
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.expiredQuotations}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expired quotations to follow up
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.acceptedQuotations}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Accepted quotations ready for invoicing
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuotationStats;
