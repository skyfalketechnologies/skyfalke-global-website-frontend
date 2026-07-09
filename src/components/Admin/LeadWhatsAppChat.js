'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  FaWhatsapp,
  FaSpinner,
  FaPaperPlane,
  FaCheck,
  FaCheckDouble,
  FaExclamationCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { apiGet, apiPost } from '../../utils/api';

const POLL_INTERVAL = 20000;

const timeOf = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

const StatusTicks = ({ status }) => {
  if (status === 'failed') return <FaExclamationCircle className="text-red-500" title="Failed" />;
  if (status === 'read') return <FaCheckDouble className="text-[#53bdeb]" title="Read" />;
  if (status === 'delivered') return <FaCheckDouble className="text-gray-400" title="Delivered" />;
  if (status === 'sent') return <FaCheck className="text-gray-400" title="Sent" />;
  return null;
};

// Embedded WhatsApp conversation panel for a Lead. Sends via the lead-scoped
// endpoint so messages are linked to the lead and logged as activities.
const LeadWhatsAppChat = ({ leadId, phone, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const fetchConversation = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await apiGet(`/api/whatsapp/admin/leads/${leadId}/conversation`);
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Error fetching lead conversation:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchConversation();
    const interval = setInterval(() => fetchConversation(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    try {
      setSending(true);
      setError('');
      await apiPost(`/api/whatsapp/admin/leads/${leadId}/send`, { message: text });
      setDraft('');
      await fetchConversation(true);
      if (onMessageSent) onMessageSent();
    } catch (err) {
      console.error('Error sending WhatsApp message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaWhatsapp className="text-[#25D366]" />
          WhatsApp
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">{phone}</span>
          <Link
            href="/system/dashboard/whatsapp"
            className="text-xs text-[#25D366] hover:underline flex items-center gap-1"
          >
            Open inbox <FaExternalLinkAlt className="text-[9px]" />
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto px-4 py-3 bg-[#efeae2] dark:bg-gray-900 space-y-1.5"
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <FaSpinner className="animate-spin text-xl text-[#25D366]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <FaWhatsapp className="text-3xl mb-2 opacity-40" />
            <p className="text-sm">No WhatsApp conversation yet.</p>
            <p className="text-xs mt-1">Send a message below to start one.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const outbound = msg.direction === 'outbound';
            return (
              <div key={msg._id} className={`flex ${outbound ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm text-sm ${
                    outbound
                      ? 'bg-[#d9fdd3] dark:bg-emerald-900 text-gray-900 dark:text-gray-100 rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {msg.body || msg.caption || (msg.type !== 'text' ? `[${msg.type}]` : '')}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{timeOf(msg.timestamp)}</span>
                    {outbound && <span className="text-[10px]"><StatusTicks status={msg.status} /></span>}
                  </div>
                  {msg.status === 'failed' && msg.errorMessage && (
                    <p className="text-[11px] text-red-500 mt-1">{msg.errorMessage}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        {error && (
          <p className="text-xs text-red-500 mb-1.5 flex items-center gap-1"><FaExclamationCircle /> {error}</p>
        )}
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Message this lead on WhatsApp..."
            rows={1}
            className="flex-1 resize-none px-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-[#25D366] focus:ring-0 focus:outline-none dark:text-white"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="w-10 h-10 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#1fb355] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? <FaSpinner className="animate-spin text-sm" /> : <FaPaperPlane className="text-xs -ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadWhatsAppChat;
