'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationContext';

const AUTO_DISMISS_MS = 8000;

// Listens for real-time 'new-notification' socket events of type "whatsapp"
// and pops a transient toast so admins notice incoming messages immediately,
// on top of the existing bell/badge update.
const WhatsAppToast = () => {
  const { socket } = useNotifications();
  const router = useRouter();
  const [toasts, setToasts] = useState([]);
  const audioRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Browsers block audio.play() until the page has seen a user gesture.
  // "Unlock" the audio element on the first click/keypress anywhere in the
  // admin panel so later programmatic play() calls from socket events work.
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/notification.wav');
      audioRef.current.volume = 0.6;
    }

    const unlock = () => {
      if (audioUnlockedRef.current) return;
      const audio = audioRef.current;
      const originalVolume = audio.volume;
      audio.volume = 0;
      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = originalVolume;
          audioUnlockedRef.current = true;
        })
        .catch(() => {
          audio.volume = originalVolume;
        });
    };

    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      const { notification } = data || {};
      if (notification?.type !== 'whatsapp') return;

      const id = notification._id || `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [
        {
          id,
          title: notification.title || 'New WhatsApp Message',
          message: notification.message || '',
          actionUrl: notification.actionUrl || '/system/dashboard/whatsapp',
          from: notification.data?.from
        },
        ...prev
      ].slice(0, 4));

      // Best-effort notification sound; log (dev only) if autoplay is still blocked
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio('/sounds/notification.wav');
          audioRef.current.volume = 0.6;
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('WhatsApp notification sound blocked (needs a page click first):', err.message);
          }
        });
      } catch (e) {
        // ignore
      }

      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    };

    socket.on('new-notification', handleNotification);
    return () => socket.off('new-notification', handleNotification);
  }, [socket, dismiss]);

  const handleClick = (toast) => {
    dismiss(toast.id);
    const phone = toast.from ? `?phone=${encodeURIComponent(toast.from)}` : '';
    router.push(toast.actionUrl?.startsWith('/system/dashboard/whatsapp') ? `/system/dashboard/whatsapp${phone}` : toast.actionUrl);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
            onClick={() => handleClick(toast)}
          >
            <div className="flex items-start gap-3 p-4">
              <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <FaWhatsapp className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {toast.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); dismiss(toast.id); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
              >
                <FaTimes className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="h-1 bg-[#25D366]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WhatsAppToast;
