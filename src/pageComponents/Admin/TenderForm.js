'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaSpinner, FaArrowLeft, FaUser } from 'react-icons/fa';
import { apiGet, apiPost, apiPatch } from '../../utils/api';

const TenderForm = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    referenceNumber: '',
    organization: '',
    category: '',
    value: {
      amount: '',
      currency: 'KES'
    },
    deadline: '',
    submissionDate: '',
    status: 'draft',
    priority: 'medium',
    assignee: '',
    applicationStatus: 'not_applied',
    applicationNotes: '',
    requirements: [],
    tags: [],
    externalLink: '',
    source: 'manual'
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchUsers();
    if (isEditing) {
      fetchTender();
    }
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await apiGet('/api/auth/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchTender = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/tenders/admin/${id}`);
      const tender = response.data.tender;
      
      setFormData({
        title: tender.title || '',
        description: tender.description || '',
        referenceNumber: tender.referenceNumber || '',
        organization: tender.organization || '',
        category: tender.category || '',
        value: tender.value || { amount: '', currency: 'KES' },
        deadline: tender.deadline ? new Date(tender.deadline).toISOString().split('T')[0] : '',
        submissionDate: tender.submissionDate ? new Date(tender.submissionDate).toISOString().split('T')[0] : '',
        status: tender.status || 'draft',
        priority: tender.priority || 'medium',
        assignee: tender.assignee?._id || tender.assignee || '',
        applicationStatus: tender.applicationStatus || 'not_applied',
        applicationNotes: tender.applicationNotes || '',
        requirements: tender.requirements || [],
        tags: tender.tags || [],
        externalLink: tender.externalLink || '',
        source: tender.source || 'manual'
      });
    } catch (error) {
      console.error('Error fetching tender:', error);
      setError('Failed to load tender');
      if (error.response?.status === 404) {
        router.push('/system/dashboard/tenders');
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
        value: {
          amount: formData.value.amount ? parseFloat(formData.value.amount) : undefined,
          currency: formData.value.currency || 'KES'
        },
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        submissionDate: formData.submissionDate ? new Date(formData.submissionDate).toISOString() : undefined,
        assignee: formData.assignee || undefined
      };

      if (isEditing) {
        await apiPatch(`/api/tenders/admin/${id}`, submitData);
        setSuccess('Tender updated successfully!');
        setTimeout(() => {
          router.push(`/system/dashboard/tenders/${id}`);
        }, 1500);
      } else {
        const response = await apiPost('/api/tenders/admin', submitData);
        setSuccess('Tender created successfully!');
        setTimeout(() => {
          router.push(`/system/dashboard/tenders/${response.data.tender._id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving tender:', error);
      setError(error.response?.data?.message || 'Failed to save tender');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()]
      });
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (requirement) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter(r => r !== requirement)
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/system/dashboard/tenders')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <FaArrowLeft />
          Back to Tenders
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Tender' : 'Create New Tender'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Value Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value.amount}
                  onChange={(e) => setFormData({
                    ...formData,
                    value: { ...formData.value, amount: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={formData.value.currency}
                  onChange={(e) => setFormData({
                    ...formData,
                    value: { ...formData.value, currency: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates and Status */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dates and Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Submission Date
                </label>
                <input
                  type="date"
                  value={formData.submissionDate}
                  onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="awarded">Awarded</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assignment</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign To
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Application Status (for editing) */}
          {isEditing && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Application Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Application Status
                  </label>
                  <select
                    value={formData.applicationStatus}
                    onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="not_applied">Not Applied</option>
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="awarded">Awarded</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Application Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.applicationNotes}
                  onChange={(e) => setFormData({ ...formData, applicationNotes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Requirements */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Requirements</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                placeholder="Add requirement"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(req)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag"
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
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                External Link
              </label>
              <input
                type="url"
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/system/dashboard/tenders')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                {isEditing ? 'Update Tender' : 'Create Tender'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TenderForm;

