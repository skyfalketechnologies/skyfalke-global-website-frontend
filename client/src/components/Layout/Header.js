'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaChevronDown,
  FaChartLine,
  FaBullhorn,
  FaAd,
  FaPalette,
  FaTools,
  FaBrain,
  FaCloud,
  FaArrowRight
} from 'react-icons/fa';
import HireUsModal from '../HireUsModal';
import useMobileDetection from '../../hooks/useMobileDetection';
import { getAnimationProps, getTransitionProps } from '../../utils/animationUtils';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showHireUsModal, setShowHireUsModal] = useState(false);
  const { isMobile, shouldAnimate } = useMobileDetection();

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const solutionsData = {
    'Data & Analytics': {
      href: '/services/data-analytics',
      icon: FaChartLine,
      description: 'Transform data into actionable insights',
      subItems: [
        { name: 'Business Intelligence', href: '/services/data-analytics/business-intelligence' },
        { name: 'Data Analytics', href: '/services/data-analytics/data-analytics' },
        { name: 'Predictive Analytics', href: '/services/data-analytics/predictive-analytics' },
        { name: 'Performance Tracking', href: '/services/data-analytics/performance-tracking' },
        { name: 'Custom Dashboards', href: '/services/data-analytics/custom-dashboards' }
      ]
    },
    'Earned Media': {
      href: '/services/earned-media',
      icon: FaBullhorn,
      description: 'Build authentic brand relationships',
      subItems: [
        { name: 'Public Relations', href: '/services/earned-media/public-relations' },
        { name: 'Influencer Marketing', href: '/services/earned-media/influencer-marketing' },
        { name: 'Content Marketing', href: '/services/earned-media/content-marketing' },
        { name: 'Social Media Management', href: '/services/earned-media/social-media-management' },
        { name: 'Brand Awareness', href: '/services/earned-media/brand-awareness' }
      ]
    },
    'Paid Media': {
      href: '/services/paid-media',
      icon: FaAd,
      description: 'Maximize ROI with strategic advertising',
      subItems: [
        { name: 'Google Ads', href: '/services/paid-media/google-ads' },
        { name: 'Social Media Ads', href: '/services/paid-media/social-media-ads' },
        { name: 'Display Advertising', href: '/services/paid-media/display-advertising' },
        { name: 'Video Advertising', href: '/services/paid-media/video-advertising' },
        { name: 'Retargeting Campaigns', href: '/services/paid-media/retargeting-campaigns' }
      ]
    },
    'Creative': {
      href: '/services/creative',
      icon: FaPalette,
      description: 'Bring your vision to life with stunning design',
      subItems: [
        { name: 'Brand Design', href: '/services/creative/brand-design' },
        { name: 'UI/UX Design', href: '/services/creative/ui-ux-design' },
        { name: 'Graphic Design', href: '/services/creative/graphic-design' },
        { name: 'Video Production', href: '/services/creative/video-production' },
        { name: 'Content Creation', href: '/services/creative/content-creation' }
      ]
    },
    'Business Tools': {
      href: '/services/business-tools',
      icon: FaTools,
      description: 'Streamline operations with powerful tools',
      subItems: [
        { name: 'SEO Tools & Analytics', href: '/services/business-tools/seo-tools-analytics' },
        { name: 'Process Automation', href: '/services/business-tools/process-automation' },
        { name: 'Custom Applications', href: '/services/business-tools/custom-applications' },
        { name: 'Business Intelligence', href: '/services/business-tools/business-intelligence' },
        { name: 'Performance Optimization', href: '/services/business-tools/performance-optimization' }
      ]
    },
    'ICT Strategy': {
      href: '/services/ict-strategy',
      icon: FaBrain,
      description: 'Strategic ICT & AI policy development',
      subItems: []
    },
    'Cloud Solutions': {
      href: '/cloud-solutions',
      icon: FaCloud,
      description: 'Secure, efficient, and future-ready cloud solutions',
      subItems: []
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { 
      name: 'Solutions', 
      href: '/services',
      hasDropdown: true
    },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Blog', href: '/blog' },
    // { name: 'Resources', href: '/resources' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActivePage = (href) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <motion.header 
      {...getAnimationProps({
        initial: { y: -100 },
        animate: { y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
      }, shouldAnimate)}
      className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg transform translate-y-0' 
          : 'bg-transparent transform translate-y-0'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              {...getAnimationProps({}, shouldAnimate)}
              className="flex items-center"
            >
              <img
                src="/images/logos/logo.svg"
                alt="Skyfalke Logo"
                className={`h-8 md:h-10 w-auto transition-all duration-500 ${
                  isScrolled ? 'filter brightness-0' : 'filter brightness-0 invert'
                }`}
                loading="eager"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-bold transition-colors duration-200 ${
                        isActivePage(item.href)
                          ? 'text-[#e0ae00]'
                          : isScrolled 
                            ? 'text-gray-700 hover:text-[#e0ae00]' 
                            : 'text-white hover:text-[#e0ae00]'
                      }`}
                    >
                      <span>{item.name}</span>
                      <FaChevronDown className={`text-xs transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </Link>

                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="fixed top-20 left-0 w-full bg-white shadow-2xl border-t-2 border-primary-600 py-6 z-50"
                        >
                          <div className="container-custom">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
                              {Object.entries(solutionsData).map(([category, data]) => {
                                const IconComponent = data.icon;
                                return (
                                  <div key={category} className="group">
                                    <div className="p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 group-hover:bg-gray-50">
                                      <div className="flex items-center space-x-2 mb-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                                          <IconComponent className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 leading-tight">
                                            {category}
                                          </h3>
                                        </div>
                                      </div>
                                      
                                      {data.subItems.length > 0 ? (
                                        <>
                                          <div className="space-y-0.5">
                                            {data.subItems.map((subItem, index) => (
                                              subItem.href ? (
                                                <Link
                                                  key={subItem.name}
                                                  href={subItem.href}
                                                  target={subItem.external ? '_blank' : '_self'}
                                                  rel={subItem.external ? 'noopener noreferrer' : ''}
                                                  className="block py-1 px-2 rounded text-xs text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                                                >
                                                  {subItem.name}
                                                </Link>
                                              ) : (
                                                <span key={subItem.name} className="block py-1 px-2 rounded text-xs text-gray-400">
                                                  {subItem.name}
                                                </span>
                                              )
                                            ))}
                                          </div>
                                          
                                          {data.href && (
                                            <div className="mt-2">
                                              <Link
                                                href={data.href}
                                                className="inline-flex items-center text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                              >
                                                View all
                                                <FaArrowRight className="w-2 h-2 ml-1" />
                                              </Link>
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        data.href && (
                                          <div className="mt-2">
                                            <Link
                                              href={data.href}
                                              className="inline-flex items-center text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                            >
                                              Learn more
                                              <FaArrowRight className="w-2 h-2 ml-1" />
                                            </Link>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-bold transition-colors duration-200 ${
                      isActivePage(item.href)
                        ? 'text-[#e0ae00]'
                        : isScrolled 
                          ? 'text-gray-700 hover:text-[#e0ae00]' 
                          : 'text-white hover:text-[#e0ae00]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="px-3 py-2 rounded-md text-sm font-bold text-gray-400">
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setShowHireUsModal(true)}
              className={`inline-flex items-center px-4 xl:px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isScrolled
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              Hire Us
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isScrolled 
                  ? 'text-slate-700 hover:text-[#303661]' 
                  : 'text-white hover:text-[#303661]'
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                {...getAnimationProps({
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.2 }
                }, shouldAnimate)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Mobile Menu */}
            <motion.div
              {...getAnimationProps({
                initial: { opacity: 0, x: '100%' },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: '100%' },
                transition: { duration: 0.3, ease: "easeInOut" }
              }, shouldAnimate)}
              className="lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                
                {/* Mobile Menu Content */}
                <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`block px-4 py-4 rounded-xl text-base font-bold transition-all duration-200 ${
                          isActivePage(item.href)
                            ? 'text-[#e0ae00] bg-[#e0ae00]/10 border border-[#e0ae00]/20'
                            : 'text-slate-700 hover:text-[#e0ae00] hover:bg-slate-50'
                        }`}
                        onClick={() => !item.hasDropdown && setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="block px-4 py-4 rounded-xl text-base font-bold text-gray-400">
                        {item.name}
                      </span>
                    )}
                    {item.hasDropdown && (
                      <div className="ml-4 mt-2 space-y-3">
                        {Object.entries(solutionsData).map(([category, data]) => {
                          const IconComponent = data.icon;
                          return (
                            <div key={category} className="bg-gray-50 rounded-lg p-3">
                              {data.href ? (
                                <Link
                                  href={data.href}
                                  target={data.external ? '_blank' : '_self'}
                                  rel={data.external ? 'noopener noreferrer' : ''}
                                  className="flex items-center space-x-2 mb-2"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                <div className="w-6 h-6 bg-[#e0ae00] rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs font-semibold text-gray-900 block">{category}</span>
                                </div>
                              </Link>
                              ) : (
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-6 h-6 bg-gray-300 rounded-lg flex items-center justify-center">
                                    <IconComponent className="w-3 h-3 text-gray-500" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-xs font-semibold text-gray-500 block">{category}</span>
                                  </div>
                                </div>
                              )}
                              {data.subItems.length > 0 && (
                                <div className="space-y-0.5">
                                  {data.subItems.map((subItem) => (
                                    subItem.href ? (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        target={subItem.external ? '_blank' : '_self'}
                                        rel={subItem.external ? 'noopener noreferrer' : ''}
                                        className="block py-1 px-2 text-xs text-gray-700 hover:text-[#e0ae00] hover:bg-white rounded transition-all duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        {subItem.name}
                                      </Link>
                                    ) : (
                                      <span key={subItem.name} className="block py-1 px-2 text-xs text-gray-400">
                                        {subItem.name}
                                      </span>
                                    )
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200 px-6 pb-6">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to get started?</h3>
                    <p className="text-sm text-slate-600 mb-4">Let's discuss your project requirements</p>
                    <button
                      onClick={() => {
                        setShowHireUsModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-[#303661] text-white px-6 py-3 font-semibold hover:bg-[#e0ae00] transition-all duration-200 shadow-lg rounded-lg flex items-center justify-center space-x-2"
                    >
                      <span>Hire Us</span>
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Hire Us Modal */}
      <HireUsModal 
        isOpen={showHireUsModal} 
        onClose={() => setShowHireUsModal(false)} 
      />
    </motion.header>
  );
};

export default Header;
