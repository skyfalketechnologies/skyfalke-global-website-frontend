'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiPost } from '../../utils/api';
import {
  FaArrowRight,
  FaHandshake,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaBuilding,
  FaDollarSign,
  FaCog,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

const services = [
  'Digital Marketing',
  'Cloud Solutions',
  'Business Tools',
  'Data & Analytics',
  'Earned Media',
  'Paid Media',
  'Creative Services',
  'Custom Development',
];

const companyTypes = [
  'Startup',
  'Small Business',
  'Medium Business',
  'Large Enterprise',
  'Non-Profit',
  'Government',
  'Educational Institution',
  'Other',
];

const budgetRanges = [
  { label: 'Under $10,000', value: 'under_10k' },
  { label: '$10,000 - $25,000', value: '10k_25k' },
  { label: '$25,000 - $50,000', value: '25k_50k' },
  { label: '$50,000 - $100,000', value: '50k_100k' },
  { label: 'Over $100,000', value: 'over_100k' },
  { label: 'Not specified', value: 'not_specified' },
];

const INTENT_COPY = {
  strategy: {
    title: 'Book a Free Strategy Call',
    subtitle: 'Tell us about your goals — we’ll follow up with a clear next step.',
    subject: 'Free Strategy Call Request',
  },
  audit: {
    title: 'Free Business Growth Audit',
    subtitle: 'Request your audit — we’ll outline priorities and opportunities.',
    subject: 'Free Business Growth Audit Request',
  },
};

export default function StrategyCallModalDialog({ open, intent, onClose }) {
  const copy = INTENT_COPY[intent] || INTENT_COPY.strategy;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: copy.subject,
    message: '',
    service: '',
    budget: 'not_specified',
    companyType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (open) {
      const c = INTENT_COPY[intent] || INTENT_COPY.strategy;
      setFormData((prev) => ({ ...prev, subject: c.subject }));
    }
  }, [open, intent]);

  const resetForm = () => {
    const c = INTENT_COPY[intent] || INTENT_COPY.strategy;
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: c.subject,
      message: '',
      service: '',
      budget: 'not_specified',
      companyType: '',
    });
    setSubmitStatus(null);
    setErrorMessage('');
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.companyType) {
        throw new Error('Please fill in all required fields');
      }

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const budgetLabel = budgetRanges.find((range) => range.value === formData.budget)?.label || formData.budget;
      const messageContent = `Service Required: ${formData.service}
Company Type: ${formData.companyType}
Budget Range: ${budgetLabel}
Company: ${formData.company || 'Not specified'}

Additional Message: ${formData.message || 'No additional message provided.'}`;

      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: messageContent,
        service: formData.service,
        budget: formData.budget,
        type: 'hire_us',
      };

      const response = await apiPost('/api/contact/submit', submitData);

      if (response.data.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          closeModal();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);

      if (error.response?.status === 429) {
        setErrorMessage('Too many attempts. Please wait a few minutes before trying again.');
      } else {
        setSubmitStatus('error');
        if (error.message) {
          setErrorMessage(error.message);
        } else if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else if (error.response?.data?.errors) {
          setErrorMessage(error.response.data.errors.map((err) => err.message).join(', '));
        } else {
          setErrorMessage('Something went wrong. Please try again.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          style={{ minHeight: '100vh' }}
          onClick={isSubmitting ? undefined : closeModal}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-auto shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="strategy-modal-title"
          >
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Submitting your request...</p>
                </div>
              </div>
            )}
            <div className="bg-primary-600 text-white p-6 relative">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
                aria-label="Close dialog"
              >
                <FaTimes className="text-xl" />
              </button>

              <div className="flex items-center gap-3 pr-10">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center shrink-0" aria-hidden>
                  <FaHandshake className="text-2xl" />
                </div>
                <div>
                  <h2 id="strategy-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight">
                    {copy.title}
                  </h2>
                  <p className="text-primary-100 text-sm mt-1">{copy.subtitle}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="inline mr-2" aria-hidden />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" aria-hidden />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" aria-hidden />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+254-717-797-238"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaBuilding className="inline mr-2" aria-hidden />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaBuilding className="inline mr-2" aria-hidden />
                    Company Type *
                  </label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select company type</option>
                    {companyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaCog className="inline mr-2" aria-hidden />
                    Service Required *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaDollarSign className="inline mr-2" aria-hidden />
                    Budget Range *
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {budgetRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" aria-hidden />
                  Additional Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Tell us more about your goals..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 p-4 flex items-center gap-3">
                  <FaCheckCircle className="text-green-500 text-xl shrink-0" aria-hidden />
                  <div>
                    <h4 className="text-green-800 font-semibold">Request submitted</h4>
                    <p className="text-green-700 text-sm">We&apos;ll get back to you shortly.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 p-4 flex items-center gap-3">
                  <FaTimesCircle className="text-red-500 text-xl shrink-0" aria-hidden />
                  <div>
                    <h4 className="text-red-800 font-semibold">Submission failed</h4>
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'success'}
                  className="w-full bg-primary-600 text-white font-semibold py-3 px-6 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      Submitting...
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <FaCheckCircle aria-hidden />
                      Submitted
                    </>
                  ) : (
                    <>
                      <FaHandshake aria-hidden />
                      Submit request
                      <FaArrowRight className="text-sm" aria-hidden />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
