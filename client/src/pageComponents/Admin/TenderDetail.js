'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft,
  FaFileContract,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStickyNote,
  FaHistory,
  FaExternalLinkAlt,
  FaDollarSign,
  FaFlag
} from 'react-icons/fa';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../utils/api';

const TenderDetail = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    fetchTender();
  }, [id]);

  const fetchTender = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/tenders/admin/${id}`);
      setTender(response.data.tender);
    } catch (error) {
      console.error('Error fetching tender:', error);
      if (error.response?.status === 404) {
        router.push('/system/dashboard/tenders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await apiPatch(`/api/tenders/admin/${id}`, { status: newStatus });
      fetchTender();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleApplicationStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await apiPatch(`/api/tenders/admin/${id}/application`, { applicationStatus: newStatus });
      fetchTender();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await apiPost(`/api/tenders/admin/${id}/notes`, { note: newNote });
      setNewNote('');
      setShowNoteForm(false);
      fetchTender();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const handleDeleteTender = async () => {
    if (!window.confirm('Are you sure you want to delete this tender?')) return;

    try {
      await apiDelete(`/api/tenders/admin/${id}`);
      router.push('/system/dashboard/tenders');
    } catch (error) {
      console.error('Error deleting tender:', error);
      alert('Failed to delete tender');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      submitted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      awarded: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const isDeadlineApproaching = (deadline) => {
    if (!deadline) return false;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'KES') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400">Tender not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/system/dashboard/tenders')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <FaFileContract className="text-primary-500" />
              {tender.title}
            </h1>
            {tender.referenceNumber && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Reference: {tender.referenceNumber}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/system/dashboard/tenders/${id}/edit`}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
          >
            <FaEdit />
            Edit
          </Link>
          <button
            onClick={handleDeleteTender}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {isDeadlineApproaching(tender.deadline) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
          <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 text-xl" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              Deadline Approaching
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              This tender's deadline is on {formatDate(tender.deadline)}
            </p>
          </div>
        </div>
      )}

      {isDeadlinePassed(tender.deadline) && tender.status !== 'closed' && tender.status !== 'awarded' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-200">
              Deadline Passed
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              This tender's deadline was on {formatDate(tender.deadline)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                <p className="mt-1 text-gray-900 dark:text-white">{tender.description}</p>
              </div>
              {tender.organization && (
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Organization</label>
                    <p className="text-gray-900 dark:text-white">{tender.organization}</p>
                  </div>
                </div>
              )}
              {tender.category && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{tender.category}</p>
                </div>
              )}
              {tender.value?.amount && (
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Value</label>
                    <p className="text-gray-900 dark:text-white">
                      {formatCurrency(tender.value.amount, tender.value.currency)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          {tender.requirements && tender.requirements.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                {tender.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notes</h2>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="px-3 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 text-sm"
              >
                <FaPlus />
                Add Note
              </button>
            </div>

            {showNoteForm && (
              <form onSubmit={handleAddNote} className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white mb-2"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNoteForm(false);
                      setNewNote('');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {tender.notes && tender.notes.length > 0 ? (
                tender.notes.map((note, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                    <p className="text-gray-900 dark:text-white">{note.note}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      By {note.addedBy?.name || 'Unknown'} on {formatDate(note.addedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
              )}
            </div>
          </div>

          {/* Activity History */}
          {tender.activities && tender.activities.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaHistory />
                Activity History
              </h2>
              <div className="space-y-3">
                {tender.activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      {activity.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formatDate(activity.createdAt)} by {activity.createdBy?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  <select
                    value={tender.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(tender.priority)}`}>
                    {tender.priority.toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Deadline</label>
                  <p className={`mt-1 ${isDeadlinePassed(tender.deadline) ? 'text-red-600 font-semibold' : isDeadlineApproaching(tender.deadline) ? 'text-yellow-600 font-semibold' : 'text-gray-900 dark:text-white'}`}>
                    {formatDate(tender.deadline)}
                  </p>
                </div>
              </div>

              {tender.submissionDate && (
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Submission Date</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{formatDate(tender.submissionDate)}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignee</label>
                <div className="mt-1 flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white">
                    {tender.assignee ? (tender.assignee.name || tender.assignee.email) : 'Unassigned'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Created By</label>
                <div className="mt-1 flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white">
                    {tender.createdBy?.name || tender.createdBy?.email || 'Unknown'}
                  </p>
                </div>
              </div>

              {tender.externalLink && (
                <div>
                  <a
                    href={tender.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <FaExternalLinkAlt />
                    View External Link
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Application Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Application Status</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  <select
                    value={tender.applicationStatus}
                    onChange={(e) => handleApplicationStatusChange(e.target.value)}
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="not_applied">Not Applied</option>
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="awarded">Awarded</option>
                  </select>
                </div>
              </div>

              {tender.applicationNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{tender.applicationNotes}</p>
                </div>
              )}

              {tender.applicationDate && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Application Date</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{formatDate(tender.applicationDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {tender.tags && tender.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaTag />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tender.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;

