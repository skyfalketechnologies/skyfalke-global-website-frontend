'use client';

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FaQuestionCircle, 
  FaEnvelope, 
  FaPhone, 
  FaComments,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaHeadset,
  FaVideo
} from 'react-icons/fa';

const Support = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: FaComments,
      action: 'Start Chat',
      available: '24/7',
      color: 'bg-blue-500'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: FaEnvelope,
      action: 'Send Email',
      available: 'Response in 2-4 hours',
      color: 'bg-green-500'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      icon: FaPhone,
      action: 'Call Now',
      available: 'Mon-Fri 9AM-6PM EAT',
      color: 'bg-purple-500'
    },
    {
      title: 'Video Call',
      description: 'Schedule a screen sharing session',
      icon: FaVideo,
      action: 'Schedule Call',
      available: 'By appointment',
      color: 'bg-orange-500'
    }
  ];

  const faqCategories = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'billing', name: 'Billing & Pricing', count: 6 },
    { id: 'technical', name: 'Technical Support', count: 8 },
    { id: 'services', name: 'Services', count: 5 },
    { id: 'account', name: 'Account Management', count: 5 }
  ];

  const faqs = [
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and M-Pesa mobile money payments. All payments are processed securely through our integrated payment system.'
    },
    {
      category: 'billing',
      question: 'Can I change my subscription plan?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the end of your current billing cycle for downgrades.'
    },
    {
      category: 'technical',
      question: 'How do I integrate your SEO tools with my website?',
      answer: 'Our SEO tools come with detailed integration guides and plugins for popular platforms like WordPress, Shopify, and custom websites. We also provide API documentation and technical support.'
    },
    {
      category: 'technical',
      question: 'What if I experience downtime with cloud services?',
      answer: 'We maintain 99.9% uptime SLA. In case of any issues, our monitoring systems alert our team immediately, and we provide real-time status updates on our status page.'
    },
    {
      category: 'services',
      question: 'Do you offer custom digital marketing strategies?',
      answer: 'Absolutely! We create tailored digital marketing strategies based on your industry, target audience, and business goals. Each strategy includes market research, competitor analysis, and performance metrics.'
    },
    {
      category: 'services',
      question: 'How long does it take to see results from SEO?',
      answer: 'SEO results typically begin showing within 3-6 months, with significant improvements visible after 6-12 months. However, some quick wins like technical SEO fixes can show results within weeks.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to reset your password. The link expires in 24 hours for security.'
    },
    {
      category: 'account',
      question: 'Can I have multiple users on my account?',
      answer: 'Yes, depending on your plan, you can add team members with different access levels. Our Business and Enterprise plans include multi-user support with role-based permissions.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Support Center - Skyfalke</title>
        <meta name="description" content="Get help with Skyfalke's digital marketing, cloud solutions, and business tools. 24/7 support available." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-primary-600 text-white py-20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <FaHeadset className="text-5xl mx-auto mb-4" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                How can we help you?
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-blue-100 mb-8"
              >
                Our support team is here to help you succeed with our digital solutions
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-md mx-auto"
              >
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Support Your Way</h2>
              <p className="text-lg text-gray-600">Choose the support option that works best for you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className={`w-16 h-16 ${option.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <option.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-4">
                    <FaClock />
                    <span>{option.available}</span>
                  </div>
                  <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300">
                    {option.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Find quick answers to common questions</p>
            </div>

            {/* FAQ Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="max-w-3xl mx-auto space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-300"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {expandedFaq === index ? (
                      <FaChevronUp className="text-primary-600" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <FaQuestionCircle className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No FAQs found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Our support team is ready to assist you with any questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@skyfalke.com"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300"
              >
                <FaEnvelope className="mr-2" />
                Email Support
              </a>
              <a
                href="tel:+254717797238"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                <FaPhone className="mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Support;
