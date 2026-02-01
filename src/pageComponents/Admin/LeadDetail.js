'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft,
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaUser,
  FaCalendar,
  FaClock,
  FaTag,
  FaStar,
  FaCheck,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaChartLine,
  FaFire,
  FaSun,
  FaSnowflake,
  FaCheckCircle,
  FaTimesCircle,
  FaTasks,
  FaStickyNote,
  FaHistory,
  FaGlobe,
  FaMapMarkerAlt,
  FaBriefcase,
  FaDollarSign,
  FaFlag
} from 'react-icons/fa';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../utils/api';

const LeadDetail = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [newActivity, setNewActivity] = useState({
    type: 'other',
    title: '',
    description: ''
  });
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertData, setConvertData] = useState({
    convertedTo: 'customer',
    conversionValue: ''
  });

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/leads/admin/${id}`);
      setLead(response.data.lead);
    } catch (error) {
      console.error('Error fetching lead:', error);
      if (error.response?.status === 404) {
        router.push('/system/dashboard/leads');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await apiPatch(`/api/leads/admin/${id}`, { status: newStatus });
      fetchLead();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleLifecycleStageChange = async (newStage) => {
    try {
      setUpdating(true);
      await apiPatch(`/api/leads/admin/${id}`, { lifecycleStage: newStage });
      fetchLead();
    } catch (error) {
      console.error('Error updating lifecycle stage:', error);
      alert('Failed to update lifecycle stage');
    } finally {
      setUpdating(false);
    }
  };

  const handleScoreChange = async (newScore) => {
    try {
      setUpdating(true);
      await apiPatch(`/api/leads/admin/${id}/score`, { score: newScore });
      fetchLead();
    } catch (error) {
      console.error('Error updating score:', error);
      alert('Failed to update lead score');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setUpdating(true);
      await apiPost(`/api/leads/admin/${id}/notes`, {
        note: newNote.trim()
      });
      setNewNote('');
      setShowNoteForm(false);
      fetchLead();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      setUpdating(true);
      await apiPost(`/api/leads/admin/${id}/tasks`, newTask);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
      setShowTaskForm(false);
      fetchLead();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.title.trim()) return;

    try {
      setUpdating(true);
      await apiPost(`/api/leads/admin/${id}/activities`, newActivity);
      setNewActivity({ type: 'other', title: '', description: '' });
      setShowActivityForm(false);
      fetchLead();
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity');
    } finally {
      setUpdating(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      setUpdating(true);
      await apiPatch(`/api/leads/admin/${id}/tasks/${taskId}`, { status: newStatus });
      fetchLead();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await apiPost(`/api/leads/admin/${id}/convert`, convertData);
      setShowConvertModal(false);
      fetchLead();
      alert('Lead converted successfully!');
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('Failed to convert lead');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      await apiDelete(`/api/leads/admin/${id}`);
      router.push('/system/dashboard/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      qualified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      nurturing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      converted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      unqualified: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case 'hot':
        return <FaFire className="text-red-500" />;
      case 'warm':
        return <FaSun className="text-orange-500" />;
      case 'cold':
        return <FaSnowflake className="text-blue-500" />;
      default:
        return <FaSnowflake className="text-gray-400" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-red-600 font-bold';
    if (score >= 40) return 'text-orange-600 font-semibold';
    return 'text-blue-600';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/system/dashboard/leads')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              {lead.firstName} {lead.lastName}
              {lead.converted && (
                <span className="text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-3 py-1 rounded-full">
                  Converted
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {lead.company || 'No company'} • {lead.jobTitle || 'No title'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/system/dashboard/leads/${id}/edit`}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
          >
            <FaEdit />
            Edit
          </Link>
          {!lead.converted && (
            <button
              onClick={() => setShowConvertModal(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
            >
              <FaCheckCircle />
              Convert
            </button>
          )}
          <button
            onClick={handleDeleteLead}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Score and Rating */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lead Score
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={lead.leadScore || 0}
                    onChange={(e) => handleScoreChange(e.target.value)}
                    className={`text-2xl font-bold w-20 ${getScoreColor(lead.leadScore || 0)} bg-transparent border-0 focus:ring-2 focus:ring-primary-500 rounded`}
                  />
                  <span className="text-gray-500">/ 100</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2 text-2xl">
                  {getRatingIcon(lead.leadRating)}
                  <span className="text-lg capitalize">{lead.leadRating}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`px-3 py-2 rounded-lg font-medium ${getStatusColor(lead.status)} border-0`}
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
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FaEnvelope className="text-gray-400" />
                  <a href={`mailto:${lead.email}`} className="hover:text-primary-500">
                    {lead.email}
                  </a>
                </div>
              </div>
              {lead.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <FaPhone className="text-gray-400" />
                    <a href={`tel:${lead.phone}`} className="hover:text-primary-500">
                      {lead.phone}
                    </a>
                  </div>
                </div>
              )}
              {lead.company && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <FaBuilding className="text-gray-400" />
                    {lead.company}
                  </div>
                </div>
              )}
              {lead.website && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <FaGlobe className="text-gray-400" />
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-500">
                      {lead.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activities Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaHistory />
                Activity Timeline
              </h2>
              <button
                onClick={() => setShowActivityForm(true)}
                className="px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm"
              >
                <FaPlus />
                Add Activity
              </button>
            </div>
            <div className="space-y-4">
              {lead.activities && lead.activities.length > 0 ? (
                lead.activities
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((activity, index) => (
                    <div key={index} className="border-l-2 border-primary-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                          {activity.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.description}</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded capitalize">
                          {activity.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center py-4">No activities yet</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaStickyNote />
                Notes
              </h2>
              <button
                onClick={() => setShowNoteForm(true)}
                className="px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm"
              >
                <FaPlus />
                Add Note
              </button>
            </div>
            <div className="space-y-4">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((note, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-900 dark:text-white">{note.note}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {note.createdBy?.name || 'Unknown'} • {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaTasks />
                Tasks
              </h2>
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm"
              >
                <FaPlus />
                Add Task
              </button>
            </div>
            <div className="space-y-3">
              {lead.tasks && lead.tasks.length > 0 ? (
                lead.tasks.map((task, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={(e) => handleTaskStatusChange(task._id, e.target.checked ? 'completed' : 'pending')}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                          </p>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 ml-6 text-xs text-gray-500 dark:text-gray-400">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <FaCalendar />
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                          <span className="capitalize">{task.priority} priority</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No tasks yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lifecycle Stage</label>
                <select
                  value={lead.lifecycleStage}
                  onChange={(e) => handleLifecycleStageChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="subscriber">Subscriber</option>
                  <option value="lead">Lead</option>
                  <option value="marketing_qualified_lead">MQL</option>
                  <option value="sales_qualified_lead">SQL</option>
                  <option value="opportunity">Opportunity</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
                <p className="text-gray-900 dark:text-white capitalize">{lead.source?.replace('_', ' ') || 'N/A'}</p>
              </div>
              {lead.campaign && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign</label>
                  <p className="text-gray-900 dark:text-white">{lead.campaign}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created</label>
                <p className="text-gray-900 dark:text-white">{formatDate(lead.createdAt)}</p>
              </div>
              {lead.lastActivityDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Activity</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(lead.lastActivityDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaTag />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note Form Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Note</h3>
              <button onClick={() => setShowNoteForm(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddNote}>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter note..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating || !newNote.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Task</h3>
              <button onClick={() => setShowTaskForm(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white mb-4"
                required
              />
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Description (optional)..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white mb-4"
              />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating || !newTask.title.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Form Modal */}
      {showActivityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Activity</h3>
              <button onClick={() => setShowActivityForm(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddActivity}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="email_sent">Email Sent</option>
                  <option value="email_opened">Email Opened</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Note</option>
                  <option value="task">Task</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="form_submission">Form Submission</option>
                  <option value="page_view">Page View</option>
                  <option value="download">Download</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input
                type="text"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Activity title..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white mb-4"
                required
              />
              <textarea
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Description (optional)..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowActivityForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating || !newActivity.title.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Convert Lead</h3>
              <button onClick={() => setShowConvertModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleConvert}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Convert To</label>
                <select
                  value={convertData.convertedTo}
                  onChange={(e) => setConvertData({ ...convertData, convertedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="customer">Customer</option>
                  <option value="contact">Contact</option>
                  <option value="deal">Deal</option>
                  <option value="opportunity">Opportunity</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conversion Value</label>
                <input
                  type="number"
                  value={convertData.conversionValue}
                  onChange={(e) => setConvertData({ ...convertData, conversionValue: e.target.value })}
                  placeholder="Enter value..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : 'Convert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;

