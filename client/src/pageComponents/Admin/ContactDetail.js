'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft,
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaUsers, 
  FaRocket,
  FaCalendar,
  FaClock,
  FaUser,
  FaTag,
  FaStar,
  FaCheck,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPlus
} from 'react-icons/fa';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../utils/api';

const ContactDetail = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/contact/admin/${id}`);
      setContact(response.data.contact);
      setEditData({
        status: response.data.contact.status,
        priority: response.data.contact.priority,
        assignedTo: response.data.contact.assignedTo?._id || ''
      });
    } catch (error) {
      console.error('Error fetching contact:', error);
      if (error.response?.status === 404) {
        router.push('/system/dashboard/contacts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async () => {
    try {
      setUpdating(true);
              await apiPatch(`/api/contact/admin/${id}/status`, editData);
      setEditing(false);
      fetchContact();
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setUpdating(true);
              await apiPost(`/api/contact/admin/${id}/notes`, {
        note: newNote.trim()
      });
      setNewNote('');
      fetchContact();
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      setUpdating(true);
              await apiPatch(`/api/contact/admin/${id}/read`);
      fetchContact();
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsResponded = async () => {
    try {
      setUpdating(true);
              await apiPatch(`/api/contact/admin/${id}/responded`);
      fetchContact();
    } catch (error) {
      console.error('Error marking as responded:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      setUpdating(true);
              await apiDelete(`/api/contact/admin/${id}`);
              router.push('/system/dashboard/contacts');
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      contact: FaEnvelope,
      hire_us: FaUsers,
      quote_request: FaBuilding,
      partnership: FaRocket
    };
    return icons[type] || FaEnvelope;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      spam: 'bg-red-100 text-red-800'
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Contact not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/system/dashboard/contacts')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Contacts
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Contact Details
            </h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contact.status)}`}>
                {contact.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(contact.priority)}`}>
                {contact.priority.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(contact.createdAt)}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>
            <button
              onClick={handleDeleteContact}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Contact Information */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-6">
              {React.createElement(getTypeIcon(contact.type), { className: "text-2xl text-blue-600 mr-3" })}
              <h2 className="text-xl font-semibold text-gray-900">
                {contact.type.replace('_', ' ').toUpperCase()} Request
              </h2>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-3" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.company && (
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-400 mr-3" />
                      <span>{contact.company}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Request Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subject</p>
                    <p className="font-medium">{contact.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="font-medium">{contact.type.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="font-medium">{formatDate(contact.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Message</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-3">
              {contact.status === 'new' && (
                <button
                  onClick={handleMarkAsRead}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <FaCheck className="mr-2" />
                  Mark as Read
                </button>
              )}
              {contact.status !== 'responded' && (
                <button
                  onClick={handleMarkAsResponded}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FaEnvelope className="mr-2" />
                  Mark as Responded
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          {editing ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                    <option value="spam">Spam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateContact}
                    disabled={updating}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {updating ? <FaSpinner className="animate-spin mx-auto" /> : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Priority</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contact.status)}`}>
                    {contact.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(contact.priority)}`}>
                    {contact.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            
            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <button
                type="submit"
                disabled={updating || !newNote.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Note
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {contact.notes && contact.notes.length > 0 ? (
                contact.notes.map((note, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{note.note}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
