'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { apiGet, apiPost, apiPut } from '../../utils/api';
import RichTextEditor from '../RichTextEditor';
import { 
  FaSave, 
  FaTimes, 
  FaSpinner, 
  FaExclamationTriangle,
  FaPlus,
  FaTrash
} from 'react-icons/fa';

const JobForm = ({ id: propId }) => {
  const router = useRouter();
  const params = useParams();
  const id = propId || params?.id;
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    type: '',
    experience: '',
    description: '',
    requirements: [''],
    benefits: [''],
    responsibilities: [''],
    skills: [''],
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'yearly'
    },
    isRemote: false,
    isActive: true,
    deadline: '',
    department: '',
    contactInfo: {
      email: '',
      phone: ''
    }
  });

  const categories = ['Development', 'Design', 'Marketing', 'Sales', 'Operations', 'Management'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const currencies = ['USD', 'EUR', 'GBP', 'KES'];
  const periods = ['hourly', 'monthly', 'yearly'];

  const fetchJob = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await apiGet(`/api/jobs/${id}`);
      if (response.data) {
        setFormData({
          title: response.data.title || '',
          category: response.data.category || '',
          location: response.data.location || '',
          type: response.data.type || '',
          experience: response.data.experience || '',
          description: response.data.description || '',
          requirements: response.data.requirements || [''],
          benefits: response.data.benefits || [''],
          responsibilities: response.data.responsibilities || [''],
          skills: response.data.skills || [''],
          salary: {
            min: response.data.salary?.min ?? '',
            max: response.data.salary?.max ?? '',
            currency: response.data.salary?.currency || 'USD',
            period: response.data.salary?.period || 'yearly'
          },
          isRemote: response.data.isRemote || false,
          isActive: response.data.isActive !== undefined ? response.data.isActive : true,
          deadline: response.data.deadline || '',
          department: response.data.department || '',
          contactInfo: {
            email: response.data.contactInfo?.email || '',
            phone: response.data.contactInfo?.phone || ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && isEditing) {
      fetchJob();
    }
  }, [id, isEditing, fetchJob]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Rich text editor change handler
  const handleRichTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Job title is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.location.trim()) errors.push('Location is required');
    if (!formData.type) errors.push('Job type is required');
    if (!formData.experience.trim()) errors.push('Experience level is required');
    // Strip HTML tags for validation
    const descriptionText = formData.description.replace(/<[^>]*>/g, '').trim();
    if (!descriptionText) errors.push('Job description is required');
    if (!formData.contactInfo.email.trim()) errors.push('Contact email is required');
    
    if (formData.requirements.length === 1 && !formData.requirements[0].trim()) {
      errors.push('At least one requirement is required');
    }
    
    if (formData.responsibilities.length === 1 && !formData.responsibilities[0].trim()) {
      errors.push('At least one responsibility is required');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setSaving(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        salary: formData.salary || {
          min: '',
          max: '',
          currency: 'USD',
          period: 'yearly'
        },
        requirements: formData.requirements.filter(req => req.trim()),
        benefits: formData.benefits.filter(benefit => benefit.trim()),
        responsibilities: formData.responsibilities.filter(resp => resp.trim()),
        skills: formData.skills.filter(skill => skill.trim())
      };

      let response;
      if (isEditing) {
        response = await apiPut(`/api/jobs/${id}`, submitData);
      } else {
        response = await apiPost('/api/jobs', submitData);
      }

      router.push('/system/dashboard/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to save job. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
        <span className="ml-3 text-gray-600">Loading job details...</span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Job' : 'Create New Job'} - Admin | Skyfalke</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Job' : 'Create New Job'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEditing ? 'Update job posting details' : 'Create a new job posting'}
            </p>
          </div>
          <button
            onClick={() => router.push('/system/dashboard/jobs')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Cancel
          </button>
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

        {/* Job Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Senior Full Stack Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Nairobi, Kenya"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Type *
                </label>
                <select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select job type</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 3-5 years"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Engineering"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                <RichTextEditor
                  value={formData.description || ''}
                  onChange={(value) => handleRichTextChange('description', value)}
                  placeholder="Provide a detailed description of the role..."
                  style={{ minHeight: '200px' }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center">
              <input
                type="checkbox"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remote work available
              </label>
            </div>

            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Job is active and accepting applications
              </label>
            </div>
          </div>

          {/* Salary Information */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Salary Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  name="salary.min"
                  value={formData.salary?.min ?? ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  name="salary.max"
                  value={formData.salary?.max ?? ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 80000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  name="salary.currency"
                  value={formData.salary?.currency || 'USD'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period
                </label>
                <select
                  name="salary.period"
                  value={formData.salary?.period || 'yearly'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Requirements</h2>
            
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange(index, 'requirements', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter a requirement..."
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'requirements')}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Add Requirement
            </button>
          </div>

          {/* Responsibilities */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Key Responsibilities</h2>
            
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={responsibility}
                  onChange={(e) => handleArrayChange(index, 'responsibilities', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter a responsibility..."
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'responsibilities')}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('responsibilities')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Add Responsibility
            </button>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Required Skills</h2>
            
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayChange(index, 'skills', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter a skill..."
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'skills')}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('skills')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Add Skill
            </button>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Benefits</h2>
            
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayChange(index, 'benefits', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter a benefit..."
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'benefits')}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('benefits')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Add Benefit
            </button>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo?.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="careers@skyfalke.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo?.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+254 700 123 456"
                />
              </div>
            </div>
          </div>

          {/* Application Deadline */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Application Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">Leave empty for no deadline</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/system/dashboard/jobs')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className="h-4 w-4" />
                  <span>{isEditing ? 'Update Job' : 'Create Job'}</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </>
  );
};

export default JobForm;
