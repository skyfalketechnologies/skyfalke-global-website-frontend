'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaWhatsapp,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaPaperPlane,
  FaClock,
  FaUser,
  FaArrowUp,
  FaArrowDown,
  FaInbox,
  FaReply,
  FaImage,
  FaFile,
  FaVideo,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { apiGet, apiPost, apiPatch } from '../../utils/api';

const WhatsApp = () => {
  const [activeTab, setActiveTab] = useState('conversations'); // conversations, messages, send
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    direction: '',
    status: '',
    search: ''
  });
  const [sendForm, setSendForm] = useState({
    to: '',
    message: '',
    type: 'text'
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (activeTab === 'conversations') {
      fetchConversations();
    } else if (activeTab === 'messages') {
      fetchMessages();
    }
    fetchStats();
  }, [activeTab, currentPage, filters]);

  useEffect(() => {
    if (selectedPhone) {
      fetchConversation();
    }
  }, [selectedPhone]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/api/whatsapp/admin/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 50,
        ...filters
      });
      const response = await apiGet(`/api/whatsapp/admin/messages?${params}`);
      setMessages(response.data.messages || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async () => {
    try {
      const response = await apiGet(`/api/whatsapp/admin/conversation/${selectedPhone}`);
      setConversationMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiGet('/api/whatsapp/admin/stats');
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!sendForm.to || !sendForm.message) return;

    try {
      setSending(true);
      await apiPost('/api/whatsapp/admin/send/text', {
        to: sendForm.to,
        message: sendForm.message
      });
      setSendForm({ to: '', message: '', type: 'text' });
      alert('Message sent successfully!');
      if (selectedPhone === sendForm.to) {
        fetchConversation();
      }
      fetchStats();
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleReply = (phone) => {
    setSelectedPhone(phone);
    setSendForm(prev => ({ ...prev, to: phone }));
    setActiveTab('conversations');
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace('+', '');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'image': return <FaImage className="text-blue-500" />;
      case 'video': return <FaVideo className="text-purple-500" />;
      case 'document': return <FaFile className="text-gray-500" />;
      case 'audio': return <FaPhone className="text-green-500" />;
      default: return <FaEnvelope className="text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaWhatsapp className="text-green-500" />
            WhatsApp Communications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer communications via WhatsApp
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
            </div>
            <FaInbox className="text-3xl text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.unread || 0}</p>
            </div>
            <FaEnvelope className="text-3xl text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inbound</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inbound || 0}</p>
            </div>
            <FaArrowDown className="text-3xl text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Outbound</p>
              <p className="text-2xl font-bold text-green-600">{stats.outbound || 0}</p>
            </div>
            <FaArrowUp className="text-3xl text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'conversations'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Conversations
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'messages'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              All Messages
            </button>
            <button
              onClick={() => setActiveTab('send')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'send'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Send Message
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Conversations Tab */}
          {activeTab === 'conversations' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <div className="lg:col-span-1">
                <div className="mb-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-primary-500" />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {conversations.map((conv) => (
                      <motion.div
                        key={conv._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedPhone(conv._id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedPhone === conv._id
                            ? 'bg-primary-50 dark:bg-primary-900 border-2 border-primary-500'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400" />
                              <p className="font-medium text-gray-900 dark:text-white">
                                {conv.contact?.[0]?.name || formatPhone(conv._id)}
                              </p>
                              {conv.unreadCount > 0 && (
                                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                              {conv.lastMessage?.body || 'No messages'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {formatTime(conv.lastMessage?.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {conversations.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No conversations yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Conversation View */}
              <div className="lg:col-span-2">
                {selectedPhone ? (
                  <div className="flex flex-col h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg">
                    {/* Conversation Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatPhone(selectedPhone)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleReply(selectedPhone)}
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
                        >
                          <FaReply /> Reply
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {conversationMessages.map((msg) => (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.direction === 'outbound'
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {getMessageIcon(msg.type)}
                              <div className="flex-1">
                                <p className="text-sm">{msg.body || msg.caption || 'Media message'}</p>
                                <div className="flex items-center justify-end gap-2 mt-2">
                                  <span className="text-xs opacity-75">
                                    {formatTime(msg.timestamp)}
                                  </span>
                                  {msg.direction === 'outbound' && (
                                    <span className="text-xs">
                                      {msg.status === 'read' && <FaCheck className="text-blue-300" />}
                                      {msg.status === 'delivered' && <FaCheck />}
                                      {msg.status === 'sent' && <FaCheck className="opacity-50" />}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {conversationMessages.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No messages in this conversation</p>
                      )}
                    </div>

                    {/* Send Message Form */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={sendForm.message}
                          onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          type="submit"
                          disabled={sending || !sendForm.message}
                          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                          Send
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <p className="text-gray-500">Select a conversation to view messages</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              {/* Filters */}
              <div className="mb-4 flex gap-4">
                <select
                  value={filters.direction}
                  onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Directions</option>
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="read">Read</option>
                  <option value="failed">Failed</option>
                </select>
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Messages Table */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <FaSpinner className="animate-spin text-2xl text-primary-500" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">From/To</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Message</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Direction</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {messages.map((msg) => (
                        <tr key={msg._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {formatPhone(msg.direction === 'inbound' ? msg.from : msg.to)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              {getMessageIcon(msg.type)}
                              <span className="truncate max-w-xs">{msg.body || msg.caption || 'Media message'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">{msg.type}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              msg.direction === 'inbound'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {msg.direction}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                              msg.status === 'read' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              msg.status === 'delivered' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              msg.status === 'sent' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {msg.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(msg.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {messages.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No messages found</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Send Message Tab */}
          {activeTab === 'send' && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={sendForm.to}
                    onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
                    placeholder="e.g., 0712345678 or +254712345678"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">Phone number will be automatically formatted</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={sendForm.message}
                    onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                    placeholder="Type your message here..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending || !sendForm.to || !sendForm.message}
                  className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsApp;

