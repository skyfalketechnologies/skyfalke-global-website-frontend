'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCog, 
  FaBell, 
  FaPalette, 
  FaLanguage, 
  FaSave, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaMoon,
  FaSun,
  FaDesktop
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { adminApiGet, adminApiPut } from '../../utils/adminApi';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newContactAlerts: true,
    newOrderAlerts: true,
    newApplicationAlerts: true,
    weeklyReports: false,
    monthlyReports: true
  });

  // General preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    itemsPerPage: 20
  });

  // System settings (only for super admins)
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Skyfalke',
    siteEmail: 'info@skyfalke.com',
    maintenanceMode: false,
    allowRegistrations: true
  });

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedNotifications = localStorage.getItem('notificationPreferences');
    const savedPreferences = localStorage.getItem('userPreferences');
    const savedSystemSettings = localStorage.getItem('systemSettings');

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Error parsing notification preferences:', e);
      }
    }

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error('Error parsing user preferences:', e);
      }
    }

    if (savedSystemSettings) {
      try {
        setSystemSettings(JSON.parse(savedSystemSettings));
      } catch (e) {
        console.error('Error parsing system settings:', e);
      }
    }
  }, []);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveNotifications = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
      setMessage({ type: 'success', text: 'Notification preferences saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving notifications:', error);
      setMessage({ type: 'error', text: 'Failed to save notification preferences' });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setLoading(false);
    }
  };

  const saveSystemSettings = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // In a real app, this would be saved to the backend
      localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
      setMessage({ type: 'success', text: 'System settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving system settings:', error);
      setMessage({ type: 'error', text: 'Failed to save system settings' });
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = () => {
    return user?.role === 'super_admin' || user?.email === 'mronald@skyfalke.com';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your preferences and system configuration</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <FaCheckCircle className="h-5 w-5" />
          ) : (
            <FaExclamationCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FaPalette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize the look and feel</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Theme Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => toggleTheme()}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                    isDarkMode
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {isDarkMode ? (
                    <>
                      <FaMoon className="mr-2 h-5 w-5" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <FaSun className="mr-2 h-5 w-5" />
                      Light Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FaBell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationChange(key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}

            <button
              onClick={saveNotifications}
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Notifications
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* General Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <FaLanguage className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preferences</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure your general settings</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Africa/Nairobi">Nairobi (EAT)</option>
              </select>
            </div>

            {/* Date Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Format
              </label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Format
              </label>
              <select
                value={preferences.timeFormat}
                onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="12h">12 Hour</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Items Per Page
              </label>
              <select
                value={preferences.itemsPerPage}
                onChange={(e) => handlePreferenceChange('itemsPerPage', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <button
              onClick={savePreferences}
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* System Settings (Super Admin Only) */}
        {isSuperAdmin() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <FaCog className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Settings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure system-wide settings</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Site Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={systemSettings.siteName}
                  onChange={(e) => handleSystemSettingChange('siteName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Site Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Email
                </label>
                <input
                  type="email"
                  value={systemSettings.siteEmail}
                  onChange={(e) => handleSystemSettingChange('siteEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Mode</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Put the site in maintenance mode</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => handleSystemSettingChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Allow Registrations */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Registrations</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enable user registrations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.allowRegistrations}
                    onChange={(e) => handleSystemSettingChange('allowRegistrations', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <button
                onClick={saveSystemSettings}
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save System Settings
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;

