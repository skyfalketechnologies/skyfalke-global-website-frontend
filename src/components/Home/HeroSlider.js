'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiPost } from '../../utils/api';
import { 
  FaArrowRight,
  FaChevronDown,
  FaHandshake,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaBuilding,
  FaDollarSign,
  FaCog,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const HeroSlider = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Free Digital Systems Audit Request',
    message: '',
    service: '',
    budget: 'not_specified',
    companyType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  const backgroundImage = "https://ik.imagekit.io/g3nahgeeu/hero/digital-marketing-min.JPG";

  const services = [
    "Digital Marketing",
    "Cloud Solutions", 
    "Business Tools",
    "Data & Analytics",
    "Earned Media",
    "Paid Media",
    "Creative Services",
    "Custom Development"
  ];

  const companyTypes = [
    "Startup",
    "Small Business",
    "Medium Business", 
    "Large Enterprise",
    "Non-Profit",
    "Government",
    "Educational Institution",
    "Other"
  ];

  const budgetRanges = [
    { label: "Under $10,000", value: "under_10k" },
    { label: "$10,000 - $25,000", value: "10k_25k" },
    { label: "$25,000 - $50,000", value: "25k_50k" },
    { label: "$50,000 - $100,000", value: "50k_100k" },
    { label: "Over $100,000", value: "over_100k" },
    { label: "Not specified", value: "not_specified" }
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: 'Free Digital Systems Audit Request',
      message: '',
      service: '',
      budget: 'not_specified',
      companyType: ''
    });
    setSubmitStatus(null);
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');
    
    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.companyType) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Prepare the message content
      const budgetLabel = budgetRanges.find(range => range.value === formData.budget)?.label || formData.budget;
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
        type: 'hire_us'
      };

      const response = await apiPost('/api/contact/submit', submitData);

      if (response.data.success) {
        setSubmitStatus('success');
        // Auto close after 3 seconds
        setTimeout(() => {
          closeModal();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        setErrorMessage('Too many attempts. Please wait a few minutes before trying again.');
      } else
      setSubmitStatus('error');
      if (error.message) {
        setErrorMessage(error.message);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative min-h-screen h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center sm:items-end pb-0 sm:pb-20 md:pb-24 lg:pb-32 xl:pb-40">
          <div className="container-custom w-full">
            <div className="flex items-center sm:items-end justify-start w-full">
              {/* Text Content */}
              <div className="text-white max-w-4xl w-full text-left">
                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight sm:leading-tight"
                >
                  Digital Growth & Automation Systems for Modern Organizations
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl"
                >
                  We help businesses simplify operations, automate workflows, and make better decisions by combining technology, AI, cloud, data, and digital marketing.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
                >
                  <button 
                    onClick={openModal}
                    className="inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group text-sm sm:text-base rounded-sm sm:rounded"
                  >
                    <span className="text-center">Book a Free Digital Systems Audit</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                  </button>
                  
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 border-2 border-white/80 text-white font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 backdrop-blur-sm group text-sm sm:text-base rounded-sm sm:rounded"
                  >
                    <span>See How It Works</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Down Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-white cursor-pointer"
            >
              <FaChevronDown className="text-2xl sm:text-3xl opacity-80 hover:opacity-100 transition-opacity" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hire Us Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            style={{ minHeight: '100vh' }}
            onClick={isSubmitting ? undefined : closeModal}
          >
                          <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-auto"
                style={{ transform: 'translateY(0)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {isSubmitting && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-600">Submitting your request...</p>
                    </div>
                  </div>
                )}
              {/* Header */}
              <div className="bg-primary-600 text-white p-6 relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                    <FaHandshake className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Book a Free Digital Systems Audit</h2>
                    <p className="text-primary-100">Fill out the form below to get started.</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
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
                      <FaEnvelope className="inline mr-2" />
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

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
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

                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaBuilding className="inline mr-2" />
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
                      <FaBuilding className="inline mr-2" />
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
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Service and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaCog className="inline mr-2" />
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
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2" />
                      Budget Range *
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about your project requirements..."
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <div>
                      <h4 className="text-green-800 font-semibold">Request Submitted Successfully!</h4>
                      <p className="text-green-700 text-sm">Thank you for your interest. We'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <FaTimesCircle className="text-red-500 text-xl" />
                    <div>
                      <h4 className="text-red-800 font-semibold">Submission Failed</h4>
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="w-full bg-primary-600 text-white font-semibold py-3 px-6 hover:bg-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                        Submitting...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <FaCheckCircle />
                        Submitted Successfully
                      </>
                    ) : (
                      <>
                        <FaHandshake />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSlider;