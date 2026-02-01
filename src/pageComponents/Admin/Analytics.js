'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApiGet, handleAdminApiError } from '../../utils/adminApi';
import { 
  FaUsers,
  FaEye,
  FaChartLine,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaDesktop,
  FaMobile,
  FaTablet,
  FaGlobe,
  FaLink,
  FaLaptop
} from 'react-icons/fa';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [analyticsData, setAnalyticsData] = useState({
    analytics: [],
    totals: {
      pageViews: 0,
      visitors: 0,
      uniqueVisitors: 0
    },
    topPages: [],
    period: '30 days'
  });
  const [summary, setSummary] = useState({
    today: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
    yesterday: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
    thisWeek: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
    thisMonth: { pageViews: 0, visitors: 0, uniqueVisitors: 0 }
  });

  useEffect(() => {
    fetchAnalytics();
    fetchSummary();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Try dashboard analytics endpoint first (admin auth)
      try {
        const response = await adminApiGet(`/api/dashboard/analytics?period=${period}`);
        if (response.success && response.data) {
          const data = response.data.data || response.data; // Handle nested data structure
          setAnalyticsData({
            analytics: data.analytics || [],
            totals: data.totals || { 
              pageViews: (data.analytics || []).reduce((sum, day) => sum + (day.pageViews || 0), 0),
              visitors: (data.analytics || []).reduce((sum, day) => sum + (day.visitors || 0), 0),
              uniqueVisitors: (data.analytics || []).reduce((sum, day) => sum + (day.uniqueVisitors || 0), 0)
            },
            topPages: data.topPages || [],
            period: data.period || `${period} days`
          });
          return;
        }
      } catch (err) {
        console.log('Dashboard analytics endpoint failed, trying alternative...', err);
      }
      
      // Fallback to analytics dashboard endpoint using apiGet
      try {
        const { apiGet } = await import('../../utils/api');
        const response = await apiGet(`/api/analytics/dashboard?period=${period}`);
        const data = response.data;
        // Handle both response structures
        const analyticsData = data.success ? data : data;
        setAnalyticsData({
          analytics: analyticsData.analytics || [],
          totals: analyticsData.totals || { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
          topPages: analyticsData.topPages || [],
          period: analyticsData.period || `${period} days`
        });
      } catch (err) {
        console.error('Analytics dashboard endpoint also failed:', err);
        // Set empty data if both endpoints fail
        setAnalyticsData({
          analytics: [],
          totals: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
          topPages: [],
          period: `${period} days`
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      handleAdminApiError(error, 'Failed to load analytics data');
      // Set empty data on error
      setAnalyticsData({
        analytics: [],
        totals: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
        topPages: [],
        period: `${period} days`
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { apiGet } = await import('../../utils/api');
      const response = await apiGet('/api/analytics/summary');
      const data = response.data;
      // Handle both response structures
      const summaryData = data.success !== undefined ? (data.success ? data : {}) : data;
      setSummary({
        today: summaryData.today || { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
        yesterday: summaryData.yesterday || { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
        thisWeek: summaryData.thisWeek || { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
        thisMonth: summaryData.thisMonth || { pageViews: 0, visitors: 0, uniqueVisitors: 0 }
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
      // Set default summary on error
      setSummary({
        today: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
        yesterday: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
        thisWeek: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
        thisMonth: { pageViews: 0, visitors: 0, uniqueVisitors: 0 }
      });
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getMaxValue = (data, key) => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(item => item[key] || 0), 1);
  };

  const calculateDeviceStats = () => {
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    analyticsData.analytics.forEach(day => {
      if (day.devices) {
        devices.desktop += day.devices.desktop || 0;
        devices.mobile += day.devices.mobile || 0;
        devices.tablet += day.devices.tablet || 0;
      }
    });
    const total = devices.desktop + devices.mobile + devices.tablet;
    return {
      desktop: { count: devices.desktop, percentage: total > 0 ? (devices.desktop / total * 100).toFixed(1) : 0 },
      mobile: { count: devices.mobile, percentage: total > 0 ? (devices.mobile / total * 100).toFixed(1) : 0 },
      tablet: { count: devices.tablet, percentage: total > 0 ? (devices.tablet / total * 100).toFixed(1) : 0 }
    };
  };

  const calculateBrowserStats = () => {
    const browsers = {};
    analyticsData.analytics.forEach(day => {
      if (day.browsers && Array.isArray(day.browsers)) {
        day.browsers.forEach(browser => {
          browsers[browser.name] = (browsers[browser.name] || 0) + (browser.count || 0);
        });
      }
    });
    return Object.entries(browsers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const calculateReferrerStats = () => {
    const referrers = {};
    analyticsData.analytics.forEach(day => {
      if (day.referrers && Array.isArray(day.referrers)) {
        day.referrers.forEach(ref => {
          const source = ref.source || 'Direct';
          referrers[source] = (referrers[source] || 0) + (ref.visits || 0);
        });
      }
    });
    return Object.entries(referrers)
      .map(([source, visits]) => ({ source, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  };

  const calculateCountryStats = () => {
    const countries = {};
    analyticsData.analytics.forEach(day => {
      if (day.countries && Array.isArray(day.countries)) {
        day.countries.forEach(country => {
          countries[country.name] = (countries[country.name] || 0) + (country.count || 0);
        });
      }
    });
    return Object.entries(countries)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const deviceStats = calculateDeviceStats();
  const browserStats = calculateBrowserStats();
  const referrerStats = calculateReferrerStats();
  const countryStats = calculateCountryStats();

  const maxPageViews = getMaxValue(analyticsData.analytics, 'pageViews');
  const maxVisitors = getMaxValue(analyticsData.analytics, 'visitors');

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? { value: 100, type: 'increase' } : { value: 0, type: 'neutral' };
    const change = ((current - previous) / previous * 100).toFixed(1);
    return {
      value: Math.abs(change),
      type: change >= 0 ? 'increase' : 'decrease'
    };
  };

  const todayChange = calculateChange(summary.today.visitors, summary.yesterday.visitors);
  const weekChange = calculateChange(summary.thisWeek.visitors, summary.thisMonth.visitors);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
          >
            Analytics
          </motion.h2>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive insights into your website performance
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? (
              <FaSpinner className="mr-2 -ml-1 h-4 w-4 animate-spin" />
            ) : (
              <FaChartLine className="mr-2 -ml-1 h-4 w-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaUsers className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Visitors
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {formatNumber(analyticsData.totals.visitors)}
                    </div>
                    {todayChange.value > 0 && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        todayChange.type === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {todayChange.type === 'increase' ? (
                          <FaArrowUp className="self-center flex-shrink-0 h-3 w-3" />
                        ) : (
                          <FaArrowDown className="self-center flex-shrink-0 h-3 w-3" />
                        )}
                        <span className="sr-only">{todayChange.type === 'increase' ? 'Increased' : 'Decreased'} by</span>
                        {todayChange.value}%
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaEye className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Page Views
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(analyticsData.totals.pageViews)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FaUsers className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Unique Visitors
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(analyticsData.totals.uniqueVisitors)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <FaChartLine className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Today's Visitors
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(summary.today.visitors)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors & Page Views Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Visitors & Page Views Over Time
            </h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {analyticsData.analytics.length > 0 ? (
                analyticsData.analytics.map((day, index) => {
                  const date = new Date(day.date);
                  const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const pageViewsHeight = (day.pageViews / maxPageViews) * 100;
                  const visitorsHeight = (day.visitors / maxVisitors) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="w-full flex items-end justify-center space-x-0.5 mb-2">
                        <div
                          className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                          style={{ height: `${pageViewsHeight}%` }}
                          title={`Page Views: ${day.pageViews}`}
                        />
                        <div
                          className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                          style={{ height: `${visitorsHeight}%` }}
                          title={`Visitors: ${day.visitors}`}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {dayLabel}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <p>No data available for this period</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Page Views</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Visitors</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Device Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FaDesktop className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Desktop</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {deviceStats.desktop.count} ({deviceStats.desktop.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${deviceStats.desktop.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FaMobile className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {deviceStats.mobile.count} ({deviceStats.mobile.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${deviceStats.mobile.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FaTablet className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tablet</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {deviceStats.tablet.count} ({deviceStats.tablet.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${deviceStats.tablet.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Pages & Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Top Pages
            </h3>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {analyticsData.topPages.length > 0 ? (
                  analyticsData.topPages.slice(0, 10).map((page, index) => (
                    <li key={index} className="py-3 flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                          #{index + 1}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white truncate">
                          {page.path || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatNumber(page.views)}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="py-3 text-sm text-gray-500 dark:text-gray-400">
                    No page data available
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Browsers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Top Browsers
            </h3>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {browserStats.length > 0 ? (
                  browserStats.map((browser, index) => (
                    <li key={index} className="py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {browser.name || 'Unknown'}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatNumber(browser.count)}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="py-3 text-sm text-gray-500 dark:text-gray-400">
                    No browser data available
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referrers & Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referrers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FaLink className="mr-2 h-4 w-4" />
              Top Referrers
            </h3>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {referrerStats.length > 0 ? (
                  referrerStats.map((ref, index) => (
                    <li key={index} className="py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white truncate flex-1">
                        {ref.source || 'Direct'}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white ml-4">
                        {formatNumber(ref.visits)}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="py-3 text-sm text-gray-500 dark:text-gray-400">
                    No referrer data available
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FaGlobe className="mr-2 h-4 w-4" />
              Top Countries
            </h3>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {countryStats.length > 0 ? (
                  countryStats.map((country, index) => (
                    <li key={index} className="py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {country.name || 'Unknown'}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatNumber(country.count)}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="py-3 text-sm text-gray-500 dark:text-gray-400">
                    No country data available
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
