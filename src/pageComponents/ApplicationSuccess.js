'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaEnvelope, FaArrowLeft, FaHome } from 'react-icons/fa';

const ApplicationSuccess = () => {
  const params = useParams();
  const id = params?.id;

  return (
    <>
      <Helmet>
        <title>Application Submitted - Skyfalke Careers</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-primary-600 text-white pt-16 md:pt-20">
          {/* Breadcrumb */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
            <nav className="flex items-center space-x-2 text-sm text-white/80 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
              <span>/</span>
              <span className="text-white font-medium">Application Submitted</span>
            </nav>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center mb-6"
                >
                  <FaCheckCircle className="text-4xl md:text-5xl text-white" />
                </motion.div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Application Submitted Successfully!
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                  Thank you for your interest in joining our team. We've received your application and will review it carefully.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-soft p-6 md:p-8"
          >

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-50 rounded-lg p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Application Review</p>
                    <p className="text-gray-600 text-sm">Our team will review your application within 3-5 business days.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Email Confirmation</p>
                    <p className="text-gray-600 text-sm">You'll receive a confirmation email with your application details.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Interview Process</p>
                    <p className="text-gray-600 text-sm">If selected, we'll contact you to schedule an interview.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 rounded-lg p-6 mb-8"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <FaEnvelope className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Questions?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                If you have any questions about your application or the hiring process, feel free to reach out to our HR team.
              </p>
              <Link href="/contact"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                Contact HR Team
              </Link>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/careers"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                <FaArrowLeft className="mr-2" />
                View More Jobs
              </Link>
              <Link href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all duration-300"
              >
                <FaHome className="mr-2" />
                Back to Home
              </Link>
            </motion.div>

            {/* Application ID */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500">
                Application ID: <span className="font-mono font-medium">{Date.now().toString(36).toUpperCase()}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Please keep this ID for your records
              </p>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationSuccess;


