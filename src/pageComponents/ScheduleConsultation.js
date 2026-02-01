'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAnalytics } from '../hooks/useAnalytics';
import { apiPost } from '../utils/api';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaEnvelope, 
  FaPhone,
  FaBuilding,
  FaComments,
  FaCheckCircle,
  FaArrowRight,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';

const ScheduleConsultation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trackContactFormSubmission, trackLeadGeneration } = useAnalytics();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  // Get service from URL params or default
  const serviceFromUrl = searchParams?.get('service') ? decodeURIComponent(searchParams.get('service')) : '';

  // Initialize service from URL params
  useEffect(() => {
    if (serviceFromUrl) {
      setFormData(prev => ({
        ...prev,
        service: serviceFromUrl
      }));
    }
  }, [serviceFromUrl]);

  const services = [
    'Data & Analytics',
    'Business Intelligence',
    'Data Analytics',
    'Predictive Analytics',
    'Performance Tracking',
    'Custom Dashboards',
    'Earned Media',
    'Paid Media',
    'Google Ads',
    'Social Media Ads',
    'Display Advertising',
    'Video Advertising',
    'Retargeting Campaigns',
    'Creative',
    'Brand Design',
    'UI/UX Design',
    'Graphic Design',
    'Video Production',
    'Content Creation',
    'Business Tools',
    'SEO Tools & Analytics',
    'Process Automation',
    'Custom Applications',
    'Performance Optimization',
    'Cloud Solutions',
    'ICT Strategy'
  ];

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

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
    setError('');
    setIsSubmitted(false);

    try {
      // Format data for API
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const subject = formData.service 
        ? `Consultation Request - ${formData.service}`
        : 'Consultation Request';
      
      // Build message with consultation details
      let message = formData.message || '';
      if (formData.preferredDate || formData.preferredTime) {
        message += '\n\n--- Consultation Preferences ---\n';
        if (formData.preferredDate) {
          message += `Preferred Date: ${new Date(formData.preferredDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}\n`;
        }
        if (formData.preferredTime) {
          message += `Preferred Time: ${formData.preferredTime}\n`;
        }
      }
      if (!message.trim()) {
        message = 'I would like to schedule a consultation to discuss my business needs.';
      }

      const response = await apiPost('/api/contact/submit', {
        name,
        email: formData.email,
        phone: formData.phone || '',
        company: formData.company || '',
        subject,
        message: message.trim(),
        type: 'consultation',
        service: formData.service || '',
        budget: 'not_specified',
        timeline: 'not_specified'
      });

      if (response.data.success) {
        // Store submitted data for success message
        setSubmittedData({ ...formData });
        setIsSubmitted(true);
        
        // Track analytics events
        trackContactFormSubmission('consultation');
        trackLeadGeneration('consultation', null);
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: '',
          preferredDate: '',
          preferredTime: ''
        });
      }
    } catch (error) {
      console.error('Consultation submission error:', error);
      
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors.map(err => err.message).join(', ');
        setError(validationErrors);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: FaUser,
      title: "Expert Consultation",
      description: "Get personalized advice from our industry experts"
    },
    {
      icon: FaClock,
      title: "Flexible Scheduling",
      description: "Choose a time that works best for your schedule"
    },
    {
      icon: FaComments,
      title: "Free Assessment",
      description: "Receive a comprehensive evaluation of your needs"
    },
    {
      icon: FaCheckCircle,
      title: "No Obligation",
      description: "Free consultation with no commitment required"
    }
  ];

  if (isSubmitted) {
    return (
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white pt-32 pb-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="text-6xl text-secondary-500 mb-6">
                <FaCheckCircle />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Consultation Scheduled!
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
                Thank you for scheduling a consultation with us. We'll be in touch within 24 hours to confirm your appointment.
              </p>
              {submittedData && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
                  <h3 className="text-2xl font-semibold mb-6">Consultation Details</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="space-y-3">
                      <p className="text-lg"><strong>Name:</strong> {submittedData.firstName} {submittedData.lastName}</p>
                      <p className="text-lg"><strong>Service:</strong> {submittedData.service || 'Not specified'}</p>
                      <p className="text-lg"><strong>Date:</strong> {
                        submittedData.preferredDate 
                          ? new Date(submittedData.preferredDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          : 'Not specified'
                      }</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-lg"><strong>Time:</strong> {submittedData.preferredTime || 'Not specified'}</p>
                      <p className="text-lg"><strong>Email:</strong> {submittedData.email}</p>
                      <p className="text-lg"><strong>Phone:</strong> {submittedData.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="bg-secondary-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Return to Home
              </motion.button>
            </motion.div>
          </div>
        </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Schedule a Consultation
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Get expert advice and discover how we can help transform your business
            </p>
            {formData.service && (
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 mb-4">
                <p className="text-lg">
                  <span className="font-semibold">Service:</span> {formData.service}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Schedule a Consultation?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get personalized insights and expert guidance to help your business grow and succeed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-secondary-500 text-4xl mb-4">
                  <benefit.icon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Book Your Free Consultation
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Fill out the form below and we'll get back to you within 24 hours to confirm your appointment.
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start"
              >
                <FaTimesCircle className="text-red-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaUser className="inline mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaUser className="inline mr-2" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaBuilding className="inline mr-2" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaComments className="inline mr-2" />
                    Service of Interest *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                    {/* Allow custom service from URL if not in list */}
                    {serviceFromUrl && !services.includes(serviceFromUrl) && (
                      <option value={serviceFromUrl}>{serviceFromUrl}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaClock className="inline mr-2" />
                    Preferred Time *
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">Select a time slot</option>
                    {timeSlots.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaComments className="inline mr-2" />
                  Additional Information
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white resize-none"
                  placeholder="Tell us about your business needs, challenges, or any specific questions you have..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-3 h-5 w-5 text-white" />
                    Scheduling Consultation...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Schedule Consultation
                    <FaArrowRight className="ml-2" />
                  </span>
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ScheduleConsultation;
