'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaSave, 
  FaSpinner,
  FaUsers,
  FaTag,
  FaCalendar,
  FaPalette
} from 'react-icons/fa';
import { apiGet, apiPost, apiPut } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const ProjectForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    color: '#6366f1',
    startDate: '',
    dueDate: '',
    tags: [],
    members: [],
    isPublic: false
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchUsers();
    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await apiGet('/api/auth/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/projects/${id}`);
      if (response.data.success) {
        const project = response.data.data;
        setFormData({
          name: project.name || '',
          description: project.description || '',
          status: project.status || 'planning',
          priority: project.priority || 'medium',
          color: project.color || '#6366f1',
          startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
          dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
          tags: project.tags || [],
          members: project.members?.map(m => m.user._id) || [],
          isPublic: project.isPublic || false
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Failed to load project');
      router.push('/system/dashboard/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        members: formData.members.map(userId => ({
          user: userId,
          role: 'member'
        }))
      };

      let response;
      if (isEdit) {
        response = await apiPut(`/api/projects/${id}`, payload);
      } else {
        response = await apiPost('/api/projects', payload);
      }

      if (response.data.success) {
        router.push(`/system/dashboard/projects/${isEdit ? id : response.data.data._id}`);
      } else {
        alert('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#ef4444', '#f59e0b', '#10b981', '#06b6d4',
    '#3b82f6', '#14b8a6', '#84cc16', '#f97316'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/system/dashboard/projects')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <FaArrowLeft /> Back to Projects
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Project' : 'Create New Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="Enter project description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaPalette className="inline mr-2" />
            Project Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-10 h-10 rounded-lg border-2 ${
                  formData.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="mt-2"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaTag className="inline mr-2" />
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-primary-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaUsers className="inline mr-2" />
            Team Members
          </label>
          <select
            multiple
            value={formData.members}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setFormData({ ...formData, members: selected });
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[120px]"
            size={5}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Hold Ctrl/Cmd to select multiple members
          </p>
        </div>

        {/* Public/Private */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Make this project public
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/system/dashboard/projects')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FaSave /> {isEdit ? 'Update' : 'Create'} Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;

