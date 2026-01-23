'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FaExclamationTriangle,
  FaShieldAlt,
  FaArrowLeft,
  FaLock,
  FaServer,
  FaEye
} from 'react-icons/fa';

const AccessDenied = () => {
  const router = useRouter();

  useEffect(() => {
    // Log unauthorized access attempt
    console.warn('Unauthorized access attempt to admin area:', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      path: window.pathname
    });

    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push('/', { replace: true });
    }, 10000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Access Denied - Skyfalke</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full space-y-8 relative z-10"
        >
          {/* Header */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Warning Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 flex items-center justify-center p-3 bg-red-500 bg-opacity-20 rounded-2xl backdrop-blur-sm border border-red-400">
                <FaExclamationTriangle className="h-12 w-12 text-red-400" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Access Denied
            </h1>
            <p className="text-red-200 text-lg font-medium">
              Unauthorized access attempt
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2 text-red-300">
              <FaLock className="h-4 w-4" />
              <span className="text-sm font-medium">Restricted Area</span>
            </div>
          </motion.div>

          {/* Warning Message */}
          <motion.div 
            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-red-400 border-opacity-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="space-y-6">
              {/* Security Alert */}
              <div className="p-4 bg-red-500 bg-opacity-20 rounded-xl border border-red-400">
                <div className="flex items-start space-x-3">
                  <FaShieldAlt className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Security Alert</h4>
                    <p className="text-xs text-red-200 leading-relaxed">
                      This access attempt has been logged and reported for security review.
                    </p>
                  </div>
                </div>
              </div>

              {/* Access Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white">
                  <FaServer className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Access Level: Restricted</span>
                </div>
                <div className="flex items-center space-x-3 text-white">
                  <FaEye className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Activity: Logged & Monitored</span>
                </div>
                <div className="flex items-center space-x-3 text-white">
                  <FaLock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Status: Unauthorized</span>
                </div>
              </div>

              {/* Warning Message */}
              <div className="p-4 bg-yellow-500 bg-opacity-20 rounded-xl border border-yellow-400">
                <p className="text-sm text-yellow-200 text-center">
                  <strong>Warning:</strong> Repeated unauthorized access attempts may result in IP blocking and legal action.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <FaArrowLeft className="mr-2 h-4 w-4" />
                  Return to Homepage
                </Link>
                
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    Redirecting automatically in 10 seconds...
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-gray-400 text-sm font-medium">
              © 2024 Skyfalke. All rights reserved.
            </p>
            <p className="text-red-400 text-xs mt-1">
              Security • Protection • Monitoring
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </>
  );
};

export default AccessDenied;

