import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
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
  FaPlus,
  FaEdit
} from 'react-icons/fa';
import axios from 'axios';

const ContactDetailModal = ({ contact, isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: contact.status,
    priority: contact.priority,
    assignedTo: contact.assignedTo?._id || ''
  });

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setLoading(true);
      await axios.post(`/api/contact/admin/${contact._id}/notes`, {
        note: newNote.trim()
      });
      setNewNote('');
      onUpdate(); // Refresh contact data
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/contact/admin/${contact._id}/status`, editData);
      setEditing(false);
      onUpdate(); // Refresh contact data
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/contact/admin/${contact._id}/read`);
      onUpdate(); // Refresh contact data
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResponded = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/contact/admin/${contact._id}/responded`);
      onUpdate(); // Refresh contact data
    } catch (error) {
      console.error('Error marking as responded:', error);
    } finally {
      setLoading(false);
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

  const formatBudget = (budget) => {
    const budgetMap = {
      'under_10k': 'Under $10,000',
      '10k_25k': '$10,000 - $25,000',
      '25k_50k': '$25,000 - $50,000',
      '50k_100k': '$50,000 - $100,000',
      'over_100k': 'Over $100,000',
      'not_specified': 'Not specified'
    };
    return budgetMap[budget] || 'Not specified';
  };

  const formatTimeline = (timeline) => {
    const timelineMap = {
      'immediate': 'Immediate',
      '1_month': '1 Month',
      '3_months': '3 Months',
      '6_months': '6 Months',
      'flexible': 'Flexible',
      'not_specified': 'Not specified'
    };
    return timelineMap[timeline] || 'Not specified';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {React.createElement(getTypeIcon(contact.type), {
                  className: "text-blue-600 text-xl"
                })}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
                  <p className="text-gray-600">Submitted on {formatDate(contact.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <p className="text-gray-900 font-medium">{contact.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{contact.email}</p>
                      </div>
                      {contact.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <p className="text-gray-900">{contact.phone}</p>
                        </div>
                      )}
                      {contact.company && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                          <p className="text-gray-900">{contact.company}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <p className="text-gray-900 font-medium">{contact.subject}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Details (for hire_us and quote_request) */}
                  {(contact.type === 'hire_us' || contact.type === 'quote_request') && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contact.service && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                            <p className="text-gray-900">{contact.service}</p>
                          </div>
                        )}
                        {contact.budget && contact.budget !== 'not_specified' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                            <p className="text-gray-900">{formatBudget(contact.budget)}</p>
                          </div>
                        )}
                        {contact.timeline && contact.timeline !== 'not_specified' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                            <p className="text-gray-900">{formatTimeline(contact.timeline)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    
                    {/* Add Note Form */}
                    <form onSubmit={handleAddNote} className="mb-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={loading || !newNote.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                        </button>
                      </div>
                    </form>

                    {/* Notes List */}
                    <div className="space-y-3">
                      {contact.notes && contact.notes.length > 0 ? (
                        contact.notes.map((note, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-gray-900">{note.note}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                  <span>By {note.createdBy?.name || 'Unknown'}</span>
                                  <span>{formatDate(note.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No notes yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Status and Actions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Actions</h3>
                    
                    {editing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="responded">Responded</option>
                            <option value="closed">Closed</option>
                            <option value="spam">Spam</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <select
                            value={editData.priority}
                            onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            disabled={loading}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditing(false)}
                            className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                            {contact.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                            {contact.priority}
                          </span>
                        </div>
                        <button
                          onClick={() => setEditing(true)}
                          className="w-full px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center space-x-2"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      {!contact.isRead && (
                        <button
                          onClick={handleMarkAsRead}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          <FaCheck />
                          <span>Mark as Read</span>
                        </button>
                      )}
                      {contact.status !== 'responded' && (
                        <button
                          onClick={handleMarkAsResponded}
                          disabled={loading}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          <FaCheck />
                          <span>Mark as Responded</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <div className="flex items-center space-x-2">
                          {React.createElement(getTypeIcon(contact.type), {
                            className: "text-gray-400"
                          })}
                          <span className="text-gray-900 capitalize">{contact.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                        <span className="text-gray-900 capitalize">{contact.source}</span>
                      </div>
                      {contact.ipAddress && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                          <span className="text-gray-900">{contact.ipAddress}</span>
                        </div>
                      )}
                      {contact.assignedTo && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                          <span className="text-gray-900">{contact.assignedTo.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactDetailModal;
