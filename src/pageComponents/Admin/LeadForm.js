'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { apiGet, apiPost, apiPatch } from '../../utils/api';

const LeadForm = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Kenya'
    },
    status: 'new',
    lifecycleStage: 'lead',
    leadScore: 0,
    leadRating: 'cold',
    source: 'website',
    sourceDetail: '',
    campaign: '',
    referrer: '',
    landingPage: '',
    industry: '',
    companySize: 'unknown',
    annualRevenue: '',
    budget: 'not_specified',
    timeline: 'not_specified',
    interests: [],
    services: [],
    preferredContactMethod: 'email',
    doNotCall: false,
    doNotEmail: false,
    tags: [],
    internalNotes: ''
  });

  const [newTag, setNewTag] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newService, setNewService] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/leads/admin/${id}`);
      const lead = response.data.lead;
      
      setFormData({
        firstName: lead.firstName || '',
        lastName: lead.lastName || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        jobTitle: lead.jobTitle || '',
        website: lead.website || '',
        address: lead.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Kenya'
        },
        status: lead.status || 'new',
        lifecycleStage: lead.lifecycleStage || 'lead',
        leadScore: lead.leadScore || 0,
        leadRating: lead.leadRating || 'cold',
        source: lead.source || 'website',
        sourceDetail: lead.sourceDetail || '',
        campaign: lead.campaign || '',
        referrer: lead.referrer || '',
        landingPage: lead.landingPage || '',
        industry: lead.industry || '',
        companySize: lead.companySize || 'unknown',
        annualRevenue: lead.annualRevenue || '',
        budget: lead.budget || 'not_specified',
        timeline: lead.timeline || 'not_specified',
        interests: lead.interests || [],
        services: lead.services || [],
        preferredContactMethod: lead.preferredContactMethod || 'email',
        doNotCall: lead.doNotCall || false,
        doNotEmail: lead.doNotEmail || false,
        tags: lead.tags || [],
        internalNotes: lead.internalNotes || ''
      });
    } catch (error) {
      console.error('Error fetching lead:', error);
      setError('Failed to load lead');
      if (error.response?.status === 404) {
        router.push('/system/dashboard/leads');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const submitData = {
        ...formData,
        annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : undefined
      };

      if (isEditing) {
        await apiPatch(`/api/leads/admin/${id}`, submitData);
        setSuccess('Lead updated successfully!');
      } else {
        const response = await apiPost('/api/leads/admin', submitData);
        setSuccess('Lead created successfully!');
        setTimeout(() => {
          router.push(`/system/dashboard/leads/${response.data.lead._id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      setError(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  const handleAddService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, newService.trim()]
      });
      setNewService('');
    }
  };

  const handleRemoveService = (service) => {
    setFormData({
      ...formData,
      services: formData.services.filter(s => s !== service)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => router.push('/system/dashboard/leads')}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FaArrowLeft />
          Back to Leads
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Lead' : 'Create New Lead'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State/Region
              </label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lead Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="nurturing">Nurturing</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
                <option value="unqualified">Unqualified</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lifecycle Stage
              </label>
              <select
                value={formData.lifecycleStage}
                onChange={(e) => setFormData({ ...formData, lifecycleStage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="subscriber">Subscriber</option>
                <option value="lead">Lead</option>
                <option value="marketing_qualified_lead">Marketing Qualified Lead (MQL)</option>
                <option value="sales_qualified_lead">Sales Qualified Lead (SQL)</option>
                <option value="opportunity">Opportunity</option>
                <option value="customer">Customer</option>
                <option value="evangelist">Evangelist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lead Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.leadScore}
                onChange={(e) => setFormData({ ...formData, leadScore: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lead Rating
              </label>
              <select
                value={formData.leadRating}
                onChange={(e) => setFormData({ ...formData, leadRating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Source & Attribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="email_campaign">Email Campaign</option>
                <option value="paid_ad">Paid Ad</option>
                <option value="organic_search">Organic Search</option>
                <option value="direct">Direct</option>
                <option value="other">Other</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source Detail
              </label>
              <input
                type="text"
                value={formData.sourceDetail}
                onChange={(e) => setFormData({ ...formData, sourceDetail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Facebook, LinkedIn, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Campaign
              </label>
              <input
                type="text"
                value={formData.campaign}
                onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Landing Page
              </label>
              <input
                type="text"
                value={formData.landingPage}
                onChange={(e) => setFormData({ ...formData, landingPage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Size
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="unknown">Unknown</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Annual Revenue
              </label>
              <input
                type="number"
                value={formData.annualRevenue}
                onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="not_specified">Not Specified</option>
                <option value="under_10k">Under $10,000</option>
                <option value="10k_25k">$10,000 - $25,000</option>
                <option value="25k_50k">$25,000 - $50,000</option>
                <option value="50k_100k">$50,000 - $100,000</option>
                <option value="over_100k">Over $100,000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timeline
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="not_specified">Not Specified</option>
                <option value="immediate">Immediate</option>
                <option value="1_month">1 Month</option>
                <option value="3_months">3 Months</option>
                <option value="6_months">6 Months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Contact Method
              </label>
              <select
                value={formData.preferredContactMethod}
                onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="meeting">Meeting</option>
                <option value="any">Any</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.doNotCall}
                onChange={(e) => setFormData({ ...formData, doNotCall: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Do Not Call</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.doNotEmail}
                onChange={(e) => setFormData({ ...formData, doNotEmail: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Do Not Email</span>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm flex items-center gap-2">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tag..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Interests & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.interests.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2">
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                  placeholder="Add interest..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Services</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.services.map((service, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-2">
                    {service}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(service)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                  placeholder="Add service..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Internal Notes</h2>
          <textarea
            value={formData.internalNotes}
            onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Add internal notes about this lead..."
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/system/dashboard/leads')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FaTimes />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                {isEditing ? 'Update Lead' : 'Create Lead'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;

