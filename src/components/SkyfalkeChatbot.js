'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaChevronDown, FaMagic } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { apiPost } from '@/utils/api';

const WELCOME =
  "Hi there — I'm Skyfalke's AI assistant (beta). I draw on our published Skyfalke Insights and how we work with clients. Replies may be incomplete or change as we improve the experience. Ask me anything about services, automation, cloud, data, or marketing — or how to reach the team.";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-0.5 py-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-slate-400"
          animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

/** AI mark for the chat header (magic icon only, no company logo). */
function ChatAiHeaderLogo() {
  return (
    <div
      className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#303661] text-[#e0ae00] shadow-md ring-2 ring-white"
      aria-hidden
    >
      <FaMagic className="h-[22px] w-[22px]" />
    </div>
  );
}

/** Compact AI avatar for message rows */
function ChatAiBubbleAvatar() {
  return (
    <div
      className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#303661] text-[#e0ae00] shadow-sm ring-2 ring-white"
      aria-hidden
    >
      <FaMagic className="h-4 w-4" />
    </div>
  );
}

export default function SkyfalkeChatbot() {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => [
    { id: 'welcome', role: 'assistant', text: WELCOME },
  ]);
  const [awaiting, setAwaiting] = useState(false);
  const listRef = useRef(null);
  const sendLockRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  /** Bumps when user navigates to home so attention animations replay */
  const [homeAttentionKey, setHomeAttentionKey] = useState(0);
  const [homeCueActive, setHomeCueActive] = useState(false);
  const prevPathRef = useRef(null);

  const hidden = pathname.startsWith('/system');
  const isHome = pathname === '/' || pathname === '';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;
    if (!isHome || hidden) return;
    if (prev === null || (prev !== '/' && prev !== '')) {
      setHomeAttentionKey((k) => k + 1);
    }
  }, [pathname, isHome, hidden]);

  useEffect(() => {
    if (!isHome || hidden || open || reduceMotion) {
      setHomeCueActive(false);
      return;
    }
    setHomeCueActive(false);
    const start = window.setTimeout(() => setHomeCueActive(true), 1100);
    return () => window.clearTimeout(start);
  }, [isHome, hidden, open, reduceMotion, homeAttentionKey]);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, awaiting, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const requestReply = useCallback(async (snapshotWithUser) => {
    const apiMessages = snapshotWithUser
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.text }));

    setAwaiting(true);
    try {
      const { data } = await apiPost('/api/chat/insights', { messages: apiMessages }, { timeout: 65000 });
      if (!data?.success || !data.reply) {
        throw new Error(data?.message || 'Unexpected response from assistant.');
      }
      const botId = `b-${Date.now()}`;
      setMessages((prev) => [...prev, { id: botId, role: 'assistant', text: data.reply }]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Could not reach the assistant. Check your connection and try again.';
      const errId = `e-${Date.now()}`;
      setMessages((prev) => [...prev, { id: errId, role: 'assistant', text: msg }]);
    } finally {
      setAwaiting(false);
    }
  }, []);

  const send = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || awaiting || sendLockRef.current) return;
    sendLockRef.current = true;
    const userId = `u-${Date.now()}`;
    const userMsg = { id: userId, role: 'user', text: trimmed };

    setInput('');
    setMessages((prev) => {
      const next = [...prev, userMsg];
      queueMicrotask(async () => {
        try {
          await requestReply(next);
        } finally {
          sendLockRef.current = false;
        }
      });
      return next;
    });
  }, [input, awaiting, requestReply]);

  const sendQuick = useCallback(
    (q) => {
      if (awaiting || sendLockRef.current) return;
      sendLockRef.current = true;
      const userId = `u-${Date.now()}`;
      const userMsg = { id: userId, role: 'user', text: q };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        queueMicrotask(async () => {
          try {
            await requestReply(next);
          } finally {
            sendLockRef.current = false;
          }
        });
        return next;
      });
    },
    [awaiting, requestReply]
  );

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex flex-col items-end gap-0 p-4 sm:p-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            id="skyfalke-chat-panel"
            className="pointer-events-auto mb-2 flex max-h-[min(82vh,34rem)] w-[min(100vw-1.5rem,22.5rem)] flex-col overflow-hidden rounded-[20px] border border-slate-200/90 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.14),0_0_1px_rgba(15,23,42,0.08)]"
            role="dialog"
            aria-label="Skyfalke assistant chat, beta"
            aria-busy={awaiting}
          >
            {/* Sheet-style grab hint */}
            <div className="flex shrink-0 justify-center bg-white pb-1 pt-2">
              <span className="h-1 w-9 rounded-full bg-slate-200" aria-hidden />
            </div>

            <header className="flex shrink-0 items-start gap-3 border-b border-slate-100 bg-white px-4 pb-3 pt-0.5">
              <ChatAiHeaderLogo />
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="truncate text-[15px] font-semibold leading-tight text-slate-900">
                    Skyfalke
                  </p>
                  <span className="inline-flex shrink-0 items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800 ring-1 ring-amber-200/80">
                    Beta
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-slate-500">
                  AI assistant (beta) · answers from Skyfalke Insights
                </p>
                <p className="mt-1 text-[11px] text-slate-400">We aim to reply to project enquiries within one business day.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close chat"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </header>

            <div
              ref={listRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-50 px-3 py-3"
            >
              {messages.map((m) =>
                m.role === 'user' ? (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[88%] rounded-2xl rounded-br-md bg-[#303661] px-3.5 py-2.5 text-[13px] leading-relaxed text-white shadow-sm">
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    className="flex max-w-[95%] justify-start gap-2"
                  >
                    <ChatAiBubbleAvatar />
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="inline-block max-w-full rounded-2xl rounded-tl-md border border-slate-200/90 bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700 shadow-sm">
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
              {awaiting && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex max-w-[95%] justify-start gap-2"
                >
                  <ChatAiBubbleAvatar />
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-200/90 bg-white px-3 py-2 shadow-sm">
                    <span className="text-[11px] font-medium text-slate-500">Typing</span>
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white px-3 pb-1 pt-2">
              <p className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Suggested
              </p>
              <div className="-mx-1 flex gap-2 overflow-x-auto pb-2 pl-1 pr-3 pt-0.5 [scrollbar-width:thin]">
                {[
                  { label: 'Services', q: 'What does Skyfalke offer across services and industries?' },
                  { label: 'Automation', q: 'How does Skyfalke approach workflow automation and AI responsibly?' },
                  { label: 'Contact', q: 'What is the best way to contact Skyfalke for a project discussion?' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    disabled={awaiting}
                    onClick={() => sendQuick(chip.q)}
                    className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white px-3 pb-3 pt-2">
              <div className="flex items-end gap-2 rounded-[18px] border border-slate-200 bg-slate-50 p-1.5 pl-3 shadow-inner">
                <textarea
                  rows={1}
                  value={input}
                  disabled={awaiting}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Write a message…"
                  className="max-h-24 min-h-[2.5rem] flex-1 resize-none bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-55"
                  aria-label="Your message"
                />
                <motion.button
                  type="button"
                  onClick={send}
                  disabled={awaiting || !input.trim()}
                  className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#303661] text-[#e0ae00] shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                  aria-label="Send message"
                  whileTap={awaiting || !input.trim() ? undefined : { scale: 0.92 }}
                  whileHover={awaiting || !input.trim() ? undefined : { scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                >
                  <FaPaperPlane className="h-3.5 w-3.5 translate-x-px" />
                </motion.button>
              </div>
              <p className="mt-2 px-1 text-center text-[10px] leading-relaxed text-slate-400">
                Beta feature — AI-generated from Skyfalke Insights; responses may vary. Verify important details on our{' '}
                <Link href="/contact" className="font-medium text-[#303661] underline-offset-2 hover:underline">
                  contact page
                </Link>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher: rounded-square + home-only attention layer */}
      <div className="pointer-events-auto relative">
        {isHome && !open && !hidden && homeCueActive && !reduceMotion && (
          <>
            <motion.span
              key={`ripple-a-${homeAttentionKey}`}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl bg-[#e0ae00]/30"
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0, 0.55, 0],
                scale: [1, 1.45, 1.65],
              }}
              transition={{
                duration: 1.35,
                repeat: 2,
                ease: [0.22, 0.61, 0.36, 1],
                delay: 0.15,
              }}
            />
            <motion.span
              key={`ripple-b-${homeAttentionKey}`}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#e0ae00]/50"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0.88, 1.12, 1.28],
              }}
              transition={{
                duration: 1.35,
                repeat: 2,
                ease: [0.22, 0.61, 0.36, 1],
                delay: 0.45,
              }}
            />
            <motion.span
              key={`badge-${homeAttentionKey}`}
              aria-hidden
              className="pointer-events-none absolute -right-0.5 -top-0.5 z-20 flex h-[11px] min-w-[11px] rounded-full bg-[#e0ae00] shadow-[0_1px_3px_rgba(0,0,0,0.2)] ring-[3px] ring-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 520, damping: 18, delay: 0.35 }}
            />
            <motion.span
              key={`badge-pulse-${homeAttentionKey}`}
              aria-hidden
              className="pointer-events-none absolute -right-0.5 -top-0.5 z-10 h-[11px] w-[11px] rounded-full bg-[#e0ae00]/50"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: [1, 2.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 1.4,
                repeat: 4,
                delay: 0.8,
                ease: 'easeOut',
              }}
            />
          </>
        )}

        <motion.button
          type="button"
          layout
          onClick={() => setOpen((v) => !v)}
          className="relative z-[15] flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-slate-200/90 bg-[#303661] text-[#e0ae00] shadow-[0_10px_26px_rgba(48,54,97,0.28),0_0_0_1px_rgba(255,255,255,0.06)_inset] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#303661] focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls="skyfalke-chat-panel"
          aria-label={open ? 'Close Skyfalke assistant (beta)' : 'Open Skyfalke assistant (beta)'}
          title={open ? 'Close chat' : 'Skyfalke assistant — beta'}
          animate={
            isHome && !open && homeCueActive && !reduceMotion
              ? { y: [0, -5, 0, -3, 0, -2, 0] }
              : { y: 0 }
          }
          transition={
            isHome && !open && homeCueActive && !reduceMotion
              ? { duration: 2.8, repeat: 1, ease: 'easeInOut', delay: 0.2 }
              : { type: 'spring', stiffness: 450, damping: 22 }
          }
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.04 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
              >
                <FaChevronDown className="h-5 w-5 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.15 }}
              >
                <motion.span
                  key={`icon-nudge-${homeAttentionKey}`}
                  animate={
                    isHome && homeCueActive && !reduceMotion
                      ? { rotate: [0, -8, 8, -5, 5, 0] }
                      : { rotate: 0 }
                  }
                  transition={{
                    duration: 0.85,
                    delay: 1.25,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <HiChatBubbleLeftRight className="h-[26px] w-[26px]" strokeWidth={1.75} aria-hidden />
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
