'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  FaWhatsapp,
  FaSearch,
  FaSpinner,
  FaPaperPlane,
  FaCheck,
  FaCheckDouble,
  FaImage,
  FaFile,
  FaVideo,
  FaMicrophone,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaUserTie,
  FaExclamationCircle,
  FaComments,
  FaArrowLeft,
  FaClock,
  FaLayerGroup
} from 'react-icons/fa';
import { apiGet, apiPost, apiPatch } from '../../utils/api';
import { useNotifications } from '../../contexts/NotificationContext';

const POLL_INTERVAL = 30000;

// ---------- helpers ----------

const initialsOf = (name, phone) => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }
  return (phone || '??').replace(/\D/g, '').slice(-2);
};

const avatarColor = (key) => {
  const colors = ['#00897b', '#5c6bc0', '#8e24aa', '#d81b60', '#e65100', '#2e7d32', '#0277bd', '#6d4c41'];
  let hash = 0;
  for (let i = 0; i < (key || '').length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 997;
  return colors[hash % colors.length];
};

const displayPhone = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) {
    return `+254 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return digits ? `+${digits}` : '';
};

const timeOf = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const listTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  if (dayDiff === 0) return timeOf(timestamp);
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString();
};

const dayLabel = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const typeIcon = (type) => {
  switch (type) {
    case 'image': return <FaImage className="inline mr-1" />;
    case 'video': return <FaVideo className="inline mr-1" />;
    case 'document': return <FaFile className="inline mr-1" />;
    case 'audio': return <FaMicrophone className="inline mr-1" />;
    case 'location': return <FaMapMarkerAlt className="inline mr-1" />;
    default: return null;
  }
};

const StatusTicks = ({ status }) => {
  if (status === 'failed') return <FaExclamationCircle className="text-red-500" title="Failed" />;
  if (status === 'read') return <FaCheckDouble className="text-[#53bdeb]" title="Read" />;
  if (status === 'delivered') return <FaCheckDouble className="text-gray-400" title="Delivered" />;
  if (status === 'sent') return <FaCheck className="text-gray-400" title="Sent" />;
  return <FaSpinner className="animate-spin text-gray-400 text-[10px]" title="Pending" />;
};

// Returns ms remaining in the 24-hour window from the last inbound message, or 0 if expired/none
const getWindowMs = (messages) => {
  const lastInbound = [...messages].reverse().find(m => m.direction === 'inbound');
  if (!lastInbound) return 0;
  const elapsed = Date.now() - new Date(lastInbound.timestamp).getTime();
  return Math.max(0, 24 * 60 * 60 * 1000 - elapsed);
};

const WindowBanner = ({ messages }) => {
  const [remaining, setRemaining] = useState(() => getWindowMs(messages));

  useEffect(() => {
    setRemaining(getWindowMs(messages));
    const interval = setInterval(() => setRemaining(getWindowMs(messages)), 60000);
    return () => clearInterval(interval);
  }, [messages]);

  if (remaining <= 0) {
    return (
      <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
        <FaClock className="shrink-0" />
        <span>
          <strong>24-hour window closed.</strong> Use a template message to reach this contact.
        </span>
      </div>
    );
  }

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const urgent = remaining < 3 * 3600000;

  return (
    <div className={`mx-3 mb-2 px-3 py-2 rounded-lg border flex items-center gap-2 text-xs ${
      urgent
        ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300'
        : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
    }`}>
      <FaClock className="shrink-0" />
      <span>
        Window open — <strong>{hours}h {minutes}m</strong> remaining to send free-form messages.
      </span>
    </div>
  );
};

// Approved Meta templates — add new ones here as they get approved
const META_TEMPLATES = [
  {
    name: 'welcome_skyfalke',
    label: 'Welcome — Skyfalke',
    preview: 'Hello {{customer_name}}\n\nWelcome to Skyfalke!\nReinvent What\'s Possible for Your Business\n\nHow can we assist you today?',
    params: ['Customer name']
  },
  {
    name: 'invoice_ready',
    label: 'Invoice Ready',
    preview: 'Hello {{customer_name}},\n\nYour invoice for {{invoice}} has been generated.\n\nAmount: {{amount}}\n\nIf you have any questions regarding your invoice, we\'re happy to help.',
    params: ['Customer name', 'Invoice number (e.g. INV-001)', 'Amount (e.g. KSh 5,000.00 KES)']
  }
];

// Template send modal
const TemplateSendModal = ({ phone, onClose, onSent }) => {
  const [selected, setSelected] = useState(null);
  const [paramValues, setParamValues] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (tpl) => {
    setSelected(tpl);
    setParamValues(tpl.params.map(() => ''));
    setError('');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      setSending(true);
      setError('');
      await apiPost('/api/whatsapp/admin/send/template', {
        to: phone,
        templateName: selected.name,
        templateParams: paramValues.map(v => v.trim()).filter(Boolean),
        language: 'en'
      });
      onSent();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send template');
    } finally {
      setSending(false);
    }
  };

  const canSend = selected && paramValues.every(v => v.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 bg-[#25D366] text-white flex items-center justify-between rounded-t-xl">
          <h3 className="font-semibold flex items-center gap-2"><FaLayerGroup /> Send Template Message</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded"><FaTimes /></button>
        </div>
        <form onSubmit={handleSend} className="p-5 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2">
            Use this when the 24-hour window is closed. Only Meta-approved templates can be sent.
          </p>

          {/* Template picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Choose a template</label>
            {META_TEMPLATES.map(tpl => (
              <button
                key={tpl.name}
                type="button"
                onClick={() => handleSelect(tpl)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  selected?.name === tpl.name
                    ? 'border-[#25D366] bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-gray-600 hover:border-[#25D366] text-gray-700 dark:text-gray-300'
                }`}
              >
                <p className="font-medium">{tpl.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{tpl.name}</p>
              </button>
            ))}
          </div>

          {/* Template preview + param inputs */}
          {selected && (
            <>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Preview</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selected.preview}</p>
              </div>
              <div className="space-y-3">
                {selected.params.map((label, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={paramValues[i]}
                      onChange={e => {
                        const next = [...paramValues];
                        next[i] = e.target.value;
                        setParamValues(next);
                      }}
                      placeholder={label}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {error && <p className="text-xs text-red-500 flex items-center gap-1"><FaExclamationCircle /> {error}</p>}
          <button
            type="submit"
            disabled={sending || !canSend}
            className="w-full py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#1fb355] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane className="text-xs" />}
            Send Template
          </button>
        </form>
      </div>
    </div>
  );
};

// ---------- component ----------

const WhatsApp = () => {
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [stats, setStats] = useState({});
  const [showNewChat, setShowNewChat] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [newChat, setNewChat] = useState({ phone: '', message: '' });
  const [newChatMode, setNewChatMode] = useState('text'); // 'text' | 'template'
  const [newChatTemplate, setNewChatTemplate] = useState(null);
  const [newChatParamValues, setNewChatParamValues] = useState([]);
  const messagesEndRef = useRef(null);
  const selectedPhoneRef = useRef(null);
  selectedPhoneRef.current = selectedPhone;

  const { socket } = useNotifications();

  const fetchConversations = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoadingConversations(true);
      const response = await apiGet('/api/whatsapp/admin/conversations?limit=50');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      if (!silent) setLoadingConversations(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiGet('/api/whatsapp/admin/stats');
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const fetchConversation = useCallback(async (phone, silent = false) => {
    if (!phone) return;
    try {
      if (!silent) setLoadingMessages(true);
      const response = await apiGet(`/api/whatsapp/admin/conversation/${encodeURIComponent(phone)}`);
      if (selectedPhoneRef.current === phone) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  const markConversationRead = useCallback(async (phone) => {
    try {
      await apiPatch(`/api/whatsapp/admin/conversation/${encodeURIComponent(phone)}/read`);
      setConversations(prev => prev.map(c => (c._id === phone ? { ...c, unreadCount: 0 } : c)));
      fetchStats();
    } catch (error) {
      console.error('Error marking conversation read:', error);
    }
  }, [fetchStats]);

  // WebSocket: refresh when a new WhatsApp message arrives
  useEffect(() => {
    if (!socket) return;
    const handleNotification = (data) => {
      const { notification } = data;
      if (notification?.type !== 'whatsapp') return;
      fetchConversations(true);
      fetchStats();
      // If the incoming message is from the currently open conversation, refresh it
      const from = notification?.data?.from;
      if (from && selectedPhoneRef.current) {
        const fromDigits = String(from).replace(/\D/g, '');
        const selectedDigits = String(selectedPhoneRef.current).replace(/\D/g, '');
        if (fromDigits === selectedDigits || fromDigits.endsWith(selectedDigits.slice(-9)) || selectedDigits.endsWith(fromDigits.slice(-9))) {
          fetchConversation(selectedPhoneRef.current, true);
          markConversationRead(selectedPhoneRef.current);
        }
      }
    };
    socket.on('new-notification', handleNotification);
    return () => socket.off('new-notification', handleNotification);
  }, [socket, fetchConversations, fetchStats, fetchConversation, markConversationRead]);

  // Fallback polling (slower since websocket handles real-time)
  useEffect(() => {
    fetchConversations();
    fetchStats();
    const interval = setInterval(() => {
      fetchConversations(true);
      fetchStats();
      if (selectedPhoneRef.current) fetchConversation(selectedPhoneRef.current, true);
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchConversations, fetchStats, fetchConversation]);

  useEffect(() => {
    if (selectedPhone) {
      fetchConversation(selectedPhone);
      markConversationRead(selectedPhone);
    }
  }, [selectedPhone, fetchConversation, markConversationRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConversation = conversations.find(c => c._id === selectedPhone);

  const conversationName = (conv) => {
    if (!conv) return displayPhone(selectedPhone);
    if (conv.lead) return `${conv.lead.firstName || ''} ${conv.lead.lastName || ''}`.trim();
    return conv.contact?.name || conv.contactName || displayPhone(conv._id);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      conversationName(conv).toLowerCase().includes(q) ||
      (conv._id || '').includes(q.replace(/\D/g, '') || ' ') ||
      (conv.lastMessage?.body || '').toLowerCase().includes(q)
    );
  });

  const windowOpen = getWindowMs(messages) > 0;

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !selectedPhone || sending) return;
    try {
      setSending(true);
      setSendError('');
      await apiPost('/api/whatsapp/admin/send/text', { to: selectedPhone, message: text });
      setDraft('');
      await fetchConversation(selectedPhone, true);
      fetchConversations(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleStartNewChat = async (e) => {
    e.preventDefault();
    const phone = newChat.phone.trim();
    if (!phone || sending) return;
    if (newChatMode === 'text' && !newChat.message.trim()) return;
    if (newChatMode === 'template' && (!newChatTemplate || newChatParamValues.some(v => !v.trim()))) return;
    try {
      setSending(true);
      setSendError('');
      if (newChatMode === 'template') {
        await apiPost('/api/whatsapp/admin/send/template', {
          to: phone,
          templateName: newChatTemplate.name,
          templateParams: newChatParamValues.map(v => v.trim()),
          language: 'en'
        });
      } else {
        await apiPost('/api/whatsapp/admin/send/text', {
          to: phone,
          message: newChat.message.trim()
        });
      }
      const digits = phone.replace(/\D/g, '');
      const normalized = digits.startsWith('254') ? digits : `254${digits.replace(/^0/, '')}`;
      setShowNewChat(false);
      setNewChat({ phone: '', message: '' });
      setNewChatMode('text');
      setNewChatTemplate(null);
      setNewChatParamValues([]);
      await fetchConversations(true);
      setSelectedPhone(normalized);
    } catch (error) {
      console.error('Error starting chat:', error);
      setSendError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const label = dayLabel(msg.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(msg);
    } else {
      groups.push({ label, items: [msg] });
    }
    return groups;
  }, []);

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xl shadow">
            <FaWhatsapp />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">WhatsApp</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Business messaging &amp; lead conversations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {socket?.connected && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
            </span>
          )}
          <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {stats.total || 0} messages
          </span>
          <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            {stats.inbound || 0} received
          </span>
          <span className="px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300">
            {stats.outbound || 0} sent
          </span>
          {(stats.unread || 0) > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-[#25D366] text-white font-semibold">
              {stats.unread} unread
            </span>
          )}
        </div>
      </div>

      {/* Chat shell */}
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex">
        {/* Sidebar */}
        <div className={`${selectedPhone ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] lg:w-[380px] flex-col border-r border-gray-200 dark:border-gray-700`}>
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search or start new chat"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-[#25D366] focus:ring-0 focus:outline-none dark:text-white"
              />
            </div>
            <button
              onClick={() => { setShowNewChat(true); setSendError(''); }}
              title="New chat"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#1fb355] transition-colors shadow-sm"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="flex justify-center py-10">
                <FaSpinner className="animate-spin text-2xl text-[#25D366]" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12 px-6">
                <FaComments className="text-4xl mx-auto mb-3 opacity-40" />
                <p className="text-sm">{search ? 'No conversations match your search' : 'No conversations yet. Start a new chat to reach out.'}</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const name = conversationName(conv);
                const active = selectedPhone === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedPhone(conv._id)}
                    className={`w-full text-left px-3 py-3 flex items-center gap-3 border-b border-gray-50 dark:border-gray-700/50 transition-colors ${
                      active ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/60'
                    }`}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                      style={{ backgroundColor: avatarColor(conv._id) }}
                    >
                      {initialsOf(name.match(/[a-zA-Z]/) ? name : '', conv._id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">{name}</p>
                        <span className={`text-[11px] shrink-0 ${conv.unreadCount > 0 ? 'text-[#25D366] font-semibold' : 'text-gray-400'}`}>
                          {listTime(conv.lastMessage?.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {conv.lastMessage?.direction === 'outbound' && (
                            <span className="mr-1 inline-block align-middle"><StatusTicks status={conv.lastMessage?.status} /></span>
                          )}
                          {typeIcon(conv.lastMessage?.type)}
                          {conv.lastMessage?.body || conv.lastMessage?.caption || (conv.lastMessage?.type !== 'text' ? conv.lastMessage?.type : '')}
                        </p>
                        <span className="flex items-center gap-1 shrink-0">
                          {conv.lead && (
                            <span title="Linked to lead" className="text-amber-500 text-[11px]"><FaUserTie /></span>
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat pane */}
        <div className={`${selectedPhone ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0 bg-[#efeae2] dark:bg-gray-900`}>
          {selectedPhone ? (
            <>
              {/* Chat header */}
              <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <button
                  onClick={() => setSelectedPhone(null)}
                  className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 p-1"
                >
                  <FaArrowLeft />
                </button>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: avatarColor(selectedPhone) }}
                >
                  {initialsOf(conversationName(selectedConversation).match(/[a-zA-Z]/) ? conversationName(selectedConversation) : '', selectedPhone)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {conversationName(selectedConversation)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{displayPhone(selectedPhone)}</p>
                </div>
                {selectedConversation?.lead && (
                  <Link
                    href={`/system/dashboard/leads/${selectedConversation.lead._id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    <FaUserTie /> View Lead
                  </Link>
                )}
              </div>

              {/* 24-hour window banner */}
              {!loadingMessages && messages.length > 0 && (
                <div className="pt-2">
                  <WindowBanner messages={messages} />
                </div>
              )}

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-4 md:px-10 py-4 space-y-1"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")'
                }}
              >
                {loadingMessages ? (
                  <div className="flex justify-center py-10">
                    <FaSpinner className="animate-spin text-2xl text-[#25D366]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12 text-sm">No messages yet in this conversation</div>
                ) : (
                  groupedMessages.map((group) => (
                    <div key={group.label}>
                      <div className="flex justify-center my-3">
                        <span className="px-3 py-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          {group.label}
                        </span>
                      </div>
                      {group.items.map((msg) => {
                        const outbound = msg.direction === 'outbound';
                        return (
                          <div key={msg._id} className={`flex ${outbound ? 'justify-end' : 'justify-start'} mb-1`}>
                            <div
                              className={`relative max-w-[85%] md:max-w-[65%] px-3 py-2 rounded-lg shadow-sm text-sm ${
                                outbound
                                  ? 'bg-[#d9fdd3] dark:bg-emerald-900 text-gray-900 dark:text-gray-100 rounded-tr-none'
                                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
                              }`}
                            >
                              {msg.type === 'template' && (
                                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">Template</p>
                              )}
                              {msg.type !== 'text' && msg.type !== 'template' && (
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 capitalize">
                                  {typeIcon(msg.type)}{msg.type}
                                </p>
                              )}
                              <p className="whitespace-pre-wrap break-words">
                                {msg.body || msg.caption || msg.templateName || (msg.type !== 'text' ? 'Media message' : '')}
                              </p>
                              <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">{timeOf(msg.timestamp)}</span>
                                {outbound && <span className="text-[11px]"><StatusTicks status={msg.status} /></span>}
                              </div>
                              {msg.status === 'failed' && msg.errorMessage && (
                                <p className="text-[11px] text-red-500 mt-1">{msg.errorMessage}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {sendError && (
                  <p className="text-xs text-red-500 mb-1.5 flex items-center gap-1"><FaExclamationCircle /> {sendError}</p>
                )}
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowTemplate(true); setSendError(''); }}
                    title="Send template message"
                    className="w-9 h-9 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/40 dark:hover:text-amber-400 transition-colors"
                  >
                    <FaLayerGroup className="text-xs" />
                  </button>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    placeholder={windowOpen ? 'Type a message' : 'Window closed — use template button to send'}
                    rows={1}
                    disabled={!windowOpen && messages.length > 0}
                    className="flex-1 resize-none px-4 py-2.5 text-sm rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-[#25D366] focus:ring-0 focus:outline-none dark:text-white max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim() || (!windowOpen && messages.length > 0)}
                    className="w-11 h-11 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#1fb355] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
                  >
                    {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane className="text-sm -ml-0.5" />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-gray-50 dark:bg-gray-900">
              <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-4">
                <FaWhatsapp className="text-4xl text-[#25D366]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">WhatsApp Business</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                Select a conversation from the list, or start a new chat to message a customer or lead directly.
              </p>
              <button
                onClick={() => { setShowNewChat(true); setSendError(''); }}
                className="mt-5 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#1fb355] transition-colors shadow flex items-center gap-2"
              >
                <FaPlus className="text-xs" /> New Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New chat modal */}
      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowNewChat(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-[#25D366] text-white flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><FaWhatsapp /> New Chat</h3>
              <button onClick={() => setShowNewChat(false)} className="p-1 hover:bg-white/20 rounded">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleStartNewChat} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone number</label>
                <input
                  type="text"
                  value={newChat.phone}
                  onChange={(e) => setNewChat({ ...newChat, phone: e.target.value })}
                  placeholder="0712 345 678 or +254712345678"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Mode toggle */}
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden text-sm">
                <button
                  type="button"
                  onClick={() => { setNewChatMode('text'); setNewChatTemplate(null); setNewChatParamValues([]); }}
                  className={`flex-1 py-2 font-medium transition-colors ${newChatMode === 'text' ? 'bg-[#25D366] text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Free text
                </button>
                <button
                  type="button"
                  onClick={() => setNewChatMode('template')}
                  className={`flex-1 py-2 font-medium transition-colors flex items-center justify-center gap-1.5 ${newChatMode === 'template' ? 'bg-[#25D366] text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <FaLayerGroup className="text-xs" /> Template
                </button>
              </div>

              {newChatMode === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                  <textarea
                    value={newChat.message}
                    onChange={(e) => setNewChat({ ...newChat, message: e.target.value })}
                    placeholder="Type your message..."
                    rows={4}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    If this number hasn&apos;t messaged you in the last 24 hours, switch to Template mode.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {META_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.name}
                      type="button"
                      onClick={() => { setNewChatTemplate(tpl); setNewChatParamValues(tpl.params.map(() => '')); }}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                        newChatTemplate?.name === tpl.name
                          ? 'border-[#25D366] bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white'
                          : 'border-gray-200 dark:border-gray-600 hover:border-[#25D366] text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <p className="font-medium">{tpl.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">{tpl.name}</p>
                    </button>
                  ))}
                  {newChatTemplate && (
                    <div className="space-y-3 pt-1">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Preview</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{newChatTemplate.preview}</p>
                      </div>
                      {newChatTemplate.params.map((label, i) => (
                        <div key={i}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                          <input
                            type="text"
                            value={newChatParamValues[i] || ''}
                            onChange={e => {
                              const next = [...newChatParamValues];
                              next[i] = e.target.value;
                              setNewChatParamValues(next);
                            }}
                            placeholder={label}
                            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {sendError && (
                <p className="text-xs text-red-500 flex items-center gap-1"><FaExclamationCircle /> {sendError}</p>
              )}
              <button
                type="submit"
                disabled={
                  sending || !newChat.phone.trim() ||
                  (newChatMode === 'text' && !newChat.message.trim()) ||
                  (newChatMode === 'template' && (!newChatTemplate || newChatParamValues.some(v => !v.trim())))
                }
                className="w-full py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#1fb355] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane className="text-xs" />}
                {newChatMode === 'template' ? 'Send Template' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Template send modal */}
      {showTemplate && selectedPhone && (
        <TemplateSendModal
          phone={selectedPhone}
          onClose={() => setShowTemplate(false)}
          onSent={() => {
            fetchConversation(selectedPhone, true);
            fetchConversations(true);
          }}
        />
      )}
    </div>
  );
};

export default WhatsApp;
