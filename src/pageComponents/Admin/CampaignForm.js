'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import RichTextEditor from '../../components/RichTextEditor';
import { 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaPaperPlane,
  FaUsers,
  FaEye,
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaEnvelope,
  FaCog,
  FaCalendarAlt
} from 'react-icons/fa';
import { apiGet, apiPost, apiPut } from '../../utils/api';

const CampaignForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [previewRecipients, setPreviewRecipients] = useState(null);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    recipientType: 'all_subscribers',
    recipients: {
      customEmails: [],
      segmentCriteria: {
        tags: [],
        source: '',
        subscribedAfter: '',
        subscribedBefore: ''
      },
      contactCriteria: 'all'
    },
    scheduledAt: '',
    settings: {
      fromName: 'Skyfalke Limited',
      fromEmail: '',
      replyTo: '',
      trackOpens: true,
      trackClicks: true
    },
    template: 'newsletter',
    tags: [],
    notes: ''
  });

  const recipientTypes = [
    { value: 'all_subscribers', label: 'All Subscribers' },
    { value: 'contacts', label: 'Contacts' },
    { value: 'custom', label: 'Custom List' },
    { value: 'segmented', label: 'Segmented Subscribers' }
  ];

  const templates = [
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'transactional', label: 'Transactional' },
    { value: 'custom', label: 'Custom' }
  ];

  const contactStatuses = [
    { value: 'all', label: 'All Contacts' },
    { value: 'new', label: 'New' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'responded', label: 'Responded' },
    { value: 'closed', label: 'Closed' }
  ];


  useEffect(() => {
    if (isEditing) {
      fetchCampaign();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/campaigns/${id}`);
      if (response.data.campaign) {
        const campaign = response.data.campaign;
        setFormData({
          name: campaign.name || '',
          subject: campaign.subject || '',
          content: campaign.content || '',
          recipientType: campaign.recipientType || 'all_subscribers',
          recipients: campaign.recipients || {
            customEmails: [],
            segmentCriteria: {
              tags: [],
              source: '',
              subscribedAfter: '',
              subscribedBefore: ''
            },
            contactCriteria: 'all'
          },
          scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : '',
          settings: campaign.settings || {
            fromName: 'Skyfalke Limited',
            fromEmail: '',
            replyTo: '',
            trackOpens: true,
            trackClicks: true
          },
          template: campaign.template || 'newsletter',
          tags: campaign.tags || [],
          notes: campaign.notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setStatus({ 
        type: 'error', 
        message: 'Failed to load campaign details. Please try again.' 
      });
      setTimeout(() => setStatus({ type: null, message: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('settings.')) {
      const settingKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('recipients.segmentCriteria.')) {
      const segmentKey = name.split('.')[2];
      setFormData(prev => ({
        ...prev,
        recipients: {
          ...prev.recipients,
          segmentCriteria: {
            ...prev.recipients.segmentCriteria,
            [segmentKey]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePreviewRecipients = async () => {
    try {
      setLoadingRecipients(true);
      let response;
      if (id) {
        response = await apiGet(`/api/campaigns/${id}/recipients/preview`);
      } else {
        response = await apiPost('/api/campaigns/preview/recipients', {
          recipientType: formData.recipientType,
          recipients: formData.recipients
        });
      }
      setPreviewRecipients(response.data);
      setStatus({ 
        type: 'success', 
        message: `Found ${response.data.count} recipients for this campaign.` 
      });
      setTimeout(() => setStatus({ type: null, message: '' }), 5000);
    } catch (error) {
      console.error('Error previewing recipients:', error);
      setStatus({ 
        type: 'error', 
        message: 'Failed to preview recipients. Please check your recipient settings.' 
      });
      setTimeout(() => setStatus({ type: null, message: '' }), 5000);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const addCustomEmail = () => {
    setFormData(prev => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        customEmails: [...prev.recipients.customEmails, '']
      }
    }));
  };

  const updateCustomEmail = (index, value) => {
    setFormData(prev => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        customEmails: prev.recipients.customEmails.map((email, i) => 
          i === index ? value : email
        )
      }
    }));
  };

  const removeCustomEmail = (index) => {
    setFormData(prev => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        customEmails: prev.recipients.customEmails.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setSaving(true);

    try {
      const payload = {
        ...formData,
        scheduledAt: formData.scheduledAt || null
      };

      let response;
      if (isEditing) {
        response = await apiPut(`/api/campaigns/${id}`, payload);
      } else {
        response = await apiPost('/api/campaigns', payload);
      }

      if (response.data.success) {
        setStatus({ 
          type: 'success', 
          message: isEditing ? 'Campaign updated successfully!' : 'Campaign created successfully!' 
        });
        setTimeout(() => {
          router.push('/system/dashboard/campaigns');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to save campaign. Please check all required fields.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
            </motion.h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEditing ? 'Update your email campaign details' : 'Design and schedule your email campaign'}
            </p>
          </div>
          <button
            onClick={() => router.push('/system/dashboard/campaigns')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>

      {/* Status Notification */}
      <AnimatePresence>
        {status.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-lg shadow-lg p-4 border-l-4 ${
              status.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : status.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {status.type === 'success' ? (
                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                ) : status.type === 'error' ? (
                  <FaExclamationCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <FaInfoCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <p
                  className={`text-sm font-medium ${
                    status.type === 'success'
                      ? 'text-green-800 dark:text-green-200'
                      : status.type === 'error'
                      ? 'text-red-800 dark:text-red-200'
                      : 'text-blue-800 dark:text-blue-200'
                  }`}
                >
                  {status.message}
                </p>
              </div>
              <button
                onClick={() => setStatus({ type: null, message: '' })}
                className="ml-3 flex-shrink-0"
              >
                <FaTimes
                  className={`h-4 w-4 ${
                    status.type === 'success'
                      ? 'text-green-500'
                      : status.type === 'error'
                      ? 'text-red-500'
                      : 'text-blue-500'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px" aria-label="Tabs">
              {[
                { id: 'basic', label: 'Basic Info', icon: FaEnvelope },
                { id: 'content', label: 'Content', icon: FaEye },
                { id: 'recipients', label: 'Recipients', icon: FaUsers },
                { id: 'settings', label: 'Settings', icon: FaCog },
                { id: 'schedule', label: 'Schedule', icon: FaCalendarAlt }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Campaign Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Provide a name and subject line for your email campaign
                </p>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Campaign Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Monthly Newsletter - January 2024"
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      A descriptive name to identify this campaign in your dashboard
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Subject Line <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Exciting Updates from Skyfalke Limited"
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      This is what recipients will see in their inbox
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Content Tab */}
          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Email Content
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Create your email content using the rich text editor below
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <RichTextEditor
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                      placeholder="Start writing your email content here..."
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Use the toolbar above to format your content. Links will be automatically tracked if click tracking is enabled.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recipients Tab */}
          {activeTab === 'recipients' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Recipient Selection
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Choose who will receive this campaign
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recipient Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="recipientType"
                      value={formData.recipientType}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                    >
                      {recipientTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {formData.recipientType === 'custom' && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Custom Email Addresses
                      </label>
                      <div className="space-y-2 mb-3">
                        {formData.recipients.customEmails.map((email, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => updateCustomEmail(index, e.target.value)}
                              placeholder="email@example.com"
                              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => removeCustomEmail(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addCustomEmail}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FaPlus className="mr-2 h-4 w-4" />
                        Add Email
                      </button>
                    </div>
                  )}

                  {formData.recipientType === 'contacts' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Status Filter
                      </label>
                      <select
                        name="recipients.contactCriteria"
                        value={formData.recipients.contactCriteria}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                      >
                        {contactStatuses.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.recipientType === 'segmented' && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subscription Source
                        </label>
                        <select
                          name="recipients.segmentCriteria.source"
                          value={formData.recipients.segmentCriteria.source}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                        >
                          <option value="">All Sources</option>
                          <option value="footer">Footer</option>
                          <option value="blog">Blog</option>
                          <option value="contact_form">Contact Form</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subscribed After
                          </label>
                          <input
                            type="date"
                            name="recipients.segmentCriteria.subscribedAfter"
                            value={formData.recipients.segmentCriteria.subscribedAfter}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subscribed Before
                          </label>
                          <input
                            type="date"
                            name="recipients.segmentCriteria.subscribedBefore"
                            value={formData.recipients.segmentCriteria.subscribedBefore}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handlePreviewRecipients}
                      disabled={loadingRecipients}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                      {loadingRecipients ? (
                        <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                      ) : (
                        <FaUsers className="mr-2 h-4 w-4" />
                      )}
                      Preview Recipients
                    </button>
                    {previewRecipients && (
                      <div className="flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          {previewRecipients.count.toLocaleString()} recipients
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Campaign Settings
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Configure email settings and tracking options
                </p>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      name="settings.fromName"
                      value={formData.settings.fromName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      The display name shown in the recipient's inbox. Emails are sent from your configured SMTP account.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reply To Email
                    </label>
                    <input
                      type="email"
                      name="settings.replyTo"
                      value={formData.settings.replyTo}
                      onChange={handleInputChange}
                      placeholder="Leave empty to use default reply-to address"
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Tracking Options
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="settings.trackOpens"
                          checked={formData.settings.trackOpens}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          Track email opens
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="settings.trackClicks"
                          checked={formData.settings.trackClicks}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          Track link clicks
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Schedule Campaign
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {isEditing ? 'Scheduling is only available when creating a new campaign.' : 'Schedule this campaign to be sent at a specific date and time.'}
                </p>
                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Send Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      value={formData.scheduledAt}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-all"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Leave empty to send immediately when you click "Send Campaign" from the campaigns list.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formData.name && (
                <span className="flex items-center">
                  <FaCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Campaign: {formData.name}
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => router.push('/system/dashboard/campaigns')}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !formData.name || !formData.subject || !formData.content}
                className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update Campaign' : 'Save Campaign'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;

