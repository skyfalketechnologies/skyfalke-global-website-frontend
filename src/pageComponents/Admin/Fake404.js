'use client';

import React from 'react';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FaExclamationTriangle,
  FaHome,
  FaSearch,
  FaArrowLeft
} from 'react-icons/fa';

const Fake404 = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Skyfalke</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center"
        >
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          {/* Search Suggestions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Try these pages instead:</h3>
            <div className="space-y-3">
              <Link href="/"
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-left"
              >
                <div className="flex items-center">
                  <FaHome className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-700">Homepage</div>
                    <div className="text-sm text-gray-500">Return to the main site</div>
                  </div>
                </div>
              </Link>
              
              <Link href="/services"
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-left"
              >
                <div className="flex items-center">
                  <FaSearch className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-700">Our Services</div>
                    <div className="text-sm text-gray-500">Explore what we offer</div>
                  </div>
                </div>
              </Link>
              
              <Link href="/contact"
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-left"
              >
                <div className="flex items-center">
                  <FaSearch className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-700">Contact Us</div>
                    <div className="text-sm text-gray-500">Get in touch with our team</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Go Back Home
            </Link>
            
            <div className="text-sm text-gray-500">
              <p>If you believe this is an error, please contact our support team.</p>
              {/* Hidden hint for authorized users */}
              <p className="mt-2 text-xs text-gray-400 opacity-50">
                System access: /system/portal/access
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Fake404;
