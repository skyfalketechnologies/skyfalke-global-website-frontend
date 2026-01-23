'use client';

import React, { useState } from 'react';
import SEOHead from '../components/SEO/SEOHead';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaBuilding,
  FaUsers,
  FaRocket,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import { apiPost } from '../utils/api';

const Contact = () => {
  const { trackContactFormSubmission, trackLeadGeneration } = useAnalytics();
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    service: '',
    budget: 'not_specified',
    timeline: 'not_specified'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await apiPost('/api/contact/submit', {
        ...formData,
        type: activeTab
      });

      if (response.data.success) {
        setSuccess(true);
        
        // Track analytics events
        trackContactFormSubmission(activeTab);
        trackLeadGeneration(activeTab, formData.budget !== 'not_specified' ? 100 : null);
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          service: '',
          budget: 'not_specified',
          timeline: 'not_specified'
        });
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email Us',
      details: 'info@skyfalke.com',
      description: 'Send us an email anytime'
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      details: '071 779 7238',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: 'Mon - Fri: 8:00 AM - 6:00 PM',
      description: 'EAT (East Africa Time)'
    }
  ];

  const services = [
    'Digital Marketing',
    'Cloud Solutions',
    'Business Tools',
    'Technology Consulting',
    'Web Development',
    'Mobile App Development',
    'Data Analytics',
    'AI & Machine Learning',
    'Cybersecurity',
    'Other'
  ];

  const budgets = [
    { value: 'under_10k', label: 'Under $10,000' },
    { value: '10k_25k', label: '$10,000 - $25,000' },
    { value: '25k_50k', label: '$25,000 - $50,000' },
    { value: '50k_100k', label: '$50,000 - $100,000' },
    { value: 'over_100k', label: 'Over $100,000' },
    { value: 'not_specified', label: 'Not specified' }
  ];

  const timelines = [
    { value: 'immediate', label: 'Immediate' },
    { value: '1_month', label: '1 Month' },
    { value: '3_months', label: '3 Months' },
    { value: '6_months', label: '6 Months' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'not_specified', label: 'Not specified' }
  ];

  return (
    <>
      <SEOHead
        pageType="contact"
        title="Contact Skyfalke - Get In Touch"
        description="Get in touch with Skyfalke for sustainable cloud solutions and digital marketing services. Free consultation available."
        keywords="contact skyfalke, get quote, consultation, support, customer service, digital marketing, cloud solutions"
        canonical="https://skyfalke.com/contact"
      />

      {/* Hero Section */}
      <section className="section-padding bg-[#303661] pt-32">
        <div className="container-custom max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Ready to transform your business? Contact our team of experts 
              and let's discuss how we can help you achieve your goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-gray-50 border-2 border-gray-200 p-8 text-center hover:border-[#e0ae00] transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#303661] flex items-center justify-center mx-auto mb-6">
                  <info.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-[#303661] mb-3">{info.title}</h3>
                <p className="text-[#e0ae00] font-semibold text-lg mb-2">{info.details}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#303661] mb-4">
              How Can We Help You?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the best way to get in touch with us based on your needs
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { id: 'contact', label: 'General Contact', icon: FaEnvelope },
              { id: 'hire_us', label: 'Hire Us', icon: FaUsers },
              { id: 'quote_request', label: 'Get Quote', icon: FaBuilding },
              { id: 'partnership', label: 'Partnership', icon: FaRocket }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-all duration-200 border-2 ${
                  activeTab === tab.id
                    ? 'bg-[#e0ae00] text-white border-[#e0ae00]'
                    : 'bg-white text-[#303661] border-gray-300 hover:border-[#e0ae00]'
                }`}
              >
                <tab.icon className="text-sm" />
                <span>{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-green-50 border-2 border-green-500 flex items-center space-x-3"
            >
              <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">Message Sent Successfully!</h3>
                <p className="text-green-700">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 border-2 border-red-500 flex items-center space-x-3"
            >
              <FaTimesCircle className="text-red-600 text-xl flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#303661] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#303661] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] transition-all duration-200"
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#303661] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] transition-all duration-200"
                    placeholder="0717797238"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#303661] mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] transition-all duration-200"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#303661] mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] transition-all duration-200"
                  placeholder="What's this about?"
                />
              </div>

              {/* Service-specific fields */}
              {(activeTab === 'hire_us' || activeTab === 'quote_request') && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#303661] mb-2">
                    Service of Interest
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] transition-all duration-200"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'hire_us' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#303661] mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] transition-all duration-200"
                    >
                      {budgets.map((budget) => (
                        <option key={budget.value} value={budget.value}>
                          {budget.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#303661] mb-2">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] transition-all duration-200"
                    >
                      {timelines.map((timeline) => (
                        <option key={timeline.value} value={timeline.value}>
                          {timeline.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm font-semibold text-[#303661] mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#e0ae00] resize-none transition-all duration-200"
                  placeholder="Tell us more about your project or inquiry..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-8 py-4 bg-[#e0ae00] text-white font-bold hover:bg-[#c99a00] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#303661] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about working with us
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-6"
          >
            {[
              {
                question: "How quickly can you start working on my project?",
                answer: "We typically begin projects within 1-2 weeks of contract signing. For urgent projects, we can start immediately depending on our current capacity."
              },
              {
                question: "What is your typical project timeline?",
                answer: "Project timelines vary based on complexity. Small projects take 2-4 weeks, medium projects 1-3 months, and large projects 3-6 months or more."
              },
              {
                question: "Do you work with international clients?",
                answer: "Yes! We work with clients globally and have experience serving businesses across different time zones and cultures."
              },
              {
                question: "What payment terms do you offer?",
                answer: "We offer flexible payment terms including milestone-based payments, monthly retainers, and project-based pricing. We accept various payment methods."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="bg-gray-50 border-l-4 border-[#e0ae00] p-6"
              >
                <h3 className="text-lg font-semibold text-[#303661] mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;