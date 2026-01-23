'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiPost } from '../../utils/api';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCloud,
  FaChartLine,
  FaCogs,
  FaArrowRight,
  FaPaperPlane,
  FaShieldAlt,
  FaFileContract,
  FaQuestionCircle,
  FaBook,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');
    
    try {
      // Basic validation
      if (!email) {
        throw new Error('Email address is required');
      }

      // Email validation
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await apiPost('/api/subscriptions/subscribe', {
        email,
        source: 'footer'
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setEmail('');
        // Reset success status after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubmitStatus('error');
      
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        setErrorMessage('Too many attempts. Please wait a few minutes before trying again.');
      } else if (error.message) {
        setErrorMessage(error.message);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      // Reset error status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerSections = [
    {
      title: 'Services',
      useBullets: true,
      links: [
        { name: 'Digital Marketing', href: '/services#digital-marketing' },
        { name: 'Cloud Solutions', href: 'https://skyfalke.co.ke', external: true },
        { name: 'Business Tools', href: '/services#business-tools' },
        { name: 'ICT Strategy', href: '/services/ict-strategy' },
        { name: 'SEO Optimization', href: '/services#seo' },
        { name: 'Technology Consulting', href: '/services#technology' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Shop', href: '/shop'},
        { name: 'Contact', href: '/contact' },
        { name: 'News & Insights', href: '/blog' },
        { name: 'Careers', href: '/careers', badge: 'We\'re hiring!' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Support Center', href: '/support'},
        { name: 'Skyfalke Academy', href: '/academy'},
        { name: 'For Partners', href: '/partners'},
        { name: 'Case Studies', href: '/case-studies'},
        { name: 'Events', href: '/events'},
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com/skyfalke', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/skyfalke', color: 'hover:bg-sky-500' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com/company/skyfalke', color: 'hover:bg-blue-700' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/skyfalkecloud', color: 'hover:bg-pink-600' }
  ];

  const contactInfo = [
    {
      icon: FaPhone,
      text: '+254 (0) 717 797 238',
      href: 'tel:+254717797238',
      label: 'Call us'
    },
    {
      icon: FaEnvelope,
      text: 'info@skyfalke.com',
      href: 'mailto:info@skyfalke.com',
      label: 'Email us'
    },
    {
      icon: FaMapMarkerAlt,
      text: 'Nairobi, Kenya',
      href: 'https://maps.google.com/?q=Nairobi,Kenya',
      label: 'Visit us'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="container-custom pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
                <img
                  src="/images/logos/logo.svg"
                  alt="Skyfalke Logo"
                  className="h-10 w-auto filter brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : '_self'}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary-500/30 transition-colors duration-300">
                      <item.icon className="text-primary-400 group-hover:text-primary-300" />
                    </div>
                    <div>
                      <div className="font-medium">{item.text}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, index) => (
              <div key={section.title} className="lg:col-span-1">
                <h3 className="text-lg font-bold mb-6 text-white relative">
                  {section.title}
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#e0ae00]"></div>
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => {
                    // Skip links without href
                    if (!link.href) return null;
                    
                    return (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          target={link.external ? '_blank' : '_self'}
                          rel={link.external ? 'noopener noreferrer' : ''}
                          className="flex items-center justify-between text-gray-300 hover:text-white transition-all duration-300 group"
                        >
                          <div className="flex items-center space-x-3">
                            {section.useBullets ? (
                              <div className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0 group-hover:bg-primary-300 transition-colors duration-300" />
                            ) : link.icon && (
                              <link.icon className="text-primary-400 group-hover:text-primary-300 transition-colors duration-300" size={16} />
                            )}
                            <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                              {link.name}
                            </span>
                          </div>
                          {link.badge && (
                            <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full font-semibold">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 pt-8 border-t border-gray-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-white">Stay Ahead of the Curve</h3>
                <p className="text-gray-300 text-lg">
                  Get exclusive insights, industry trends, and expert tips delivered to your inbox.
                </p>
              </div>
              <div>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                        required
                        disabled={isSubmitting}
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        submitStatus === 'success'
                          ? 'bg-green-600 text-white'
                          : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-2xl hover:scale-105'
                      }`}
                      whileHover={{ scale: submitStatus === 'success' ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSubmitting || submitStatus === 'success'}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <FaCheckCircle />
                          <span>Subscribed!</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <FaPaperPlane className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 flex items-center gap-3"
                    >
                      <FaCheckCircle className="text-green-400 text-lg" />
                      <div>
                        <h4 className="text-green-300 font-semibold">Successfully Subscribed!</h4>
                        <p className="text-green-200 text-sm">Thank you for subscribing to our newsletter.</p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-3"
                    >
                      <FaTimesCircle className="text-red-400 text-lg" />
                      <div>
                        <h4 className="text-red-300 font-semibold">Subscription Failed</h4>
                        <p className="text-red-200 text-sm">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="container-custom py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Copyright */}
              <div className="text-gray-400 text-center lg:text-left">
                <p className="mb-2">
                  © {currentYear} <span className="font-semibold text-white">Skyfalke Limited</span>. All rights reserved.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>

              {/* Legal Links */}
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <Link 
                  href="/privacy" 
                  className="hover:text-white transition-colors duration-300 flex items-center space-x-1"
                >
                  <span>Privacy</span>
                </Link>
                <Link 
                  href="/terms" 
                  className="hover:text-white transition-colors duration-300 flex items-center space-x-1"
                >
                  <span>Terms</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;