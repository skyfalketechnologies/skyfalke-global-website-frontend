import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaDownload, 
  FaTimes, 
  FaWifi, 
  FaExclamationTriangle
} from 'react-icons/fa';

const PWAService = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [registration, setRegistration] = useState(null);


  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Register service worker
    registerServiceWorker();



    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowUpdatePrompt(true);
            }
          });
        });

        // Handle service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

        // Service Worker registered successfully
      } catch (error) {
      }
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        // User accepted the install prompt
      } else {
        // User dismissed the install prompt
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleUpdateClick = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const sendTestNotification = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Skyfalke', {
          body: 'Welcome to Skyfalke! This is a test notification.',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: [
            {
              action: 'explore',
              title: 'View',
              icon: '/favicon.ico'
            },
            {
              action: 'close',
              title: 'Close',
              icon: '/favicon.ico'
            }
          ]
        });
      });
    }
  };

  return (
    <>
      {/* Connection Status Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
                         <FaExclamationTriangle />
            <span>You're offline</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E0AE00] rounded-lg flex items-center justify-center">
                  <FaDownload className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Install Skyfalke</h3>
                  <p className="text-sm text-gray-600">Get the app for a better experience</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-[#E0AE00] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#f4c430] transition-colors"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Prompt */}
      <AnimatePresence>
        {showUpdatePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaDownload className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Update Available</h3>
                  <p className="text-sm text-gray-600">A new version is ready to install</p>
                </div>
              </div>
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateClick}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>




    </>
  );
};

export default PWAService;
