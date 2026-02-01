'use client';

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FaChartLine,
  FaCloud,
  FaCogs,
  FaSearch,
  FaArrowRight,
  FaCheck,
  FaExternalLinkAlt,
  FaMobile,
  FaShieldAlt,
  FaRocket,
  FaBullhorn,
  FaUsers,
  FaGlobe,
  FaChartBar,
  FaPalette,
  FaNewspaper,
  FaBrain,
  FaCode,
  FaLaptop,
  FaDatabase,
  FaNetworkWired
} from 'react-icons/fa';

const Services = () => {
  const [activeService, setActiveService] = useState('data-analytics');
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' or 'grid'

  const services = {
    'data-analytics': {
      id: 'data-analytics',
      title: 'Data & Analytics',
      subtitle: 'Transform Data into Strategic Insights',
      description: 'Unlock the power of your data with advanced analytics, AI-powered insights, and predictive modeling. Our solutions help companies increase revenue by 25%+ and reduce operational costs through intelligent data strategies.',
      icon: FaChartBar,
      color: 'from-blue-500 to-indigo-600',
      link: '/services/data-analytics',
      features: [
        'Business Intelligence & Dashboards',
        'Predictive Analytics & Machine Learning',
        'Data Visualization & Reporting',
        'Custom Analytics Solutions',
        'Performance Tracking & KPIs',
        'Data Mining & Exploration',
        'Real-time Data Processing',
        'Advanced Statistical Analysis'
      ],
      benefits: [
        'Increase revenue by 25%+ through data-driven decisions',
        'Reduce operational costs with predictive insights',
        'Identify trends and opportunities before competitors',
        'Improve decision-making speed by 60%',
        'Achieve measurable ROI on analytics investments'
      ],
    },
    'paid-media': {
      id: 'paid-media',
      title: 'Paid Media & Advertising',
      subtitle: 'Maximize ROI with Strategic Campaigns',
      description: 'Drive targeted traffic and conversions with data-driven campaigns across Google, social media, and display networks. Our clients see average ROAS improvements of 3:1+ and cost-per-acquisition reductions of 35%+.',
      icon: FaBullhorn,
      color: 'from-orange-500 to-red-600',
      link: '/services/paid-media',
      features: [
        'Google Ads Management & Optimization',
        'Social Media Advertising (Meta, LinkedIn, TikTok)',
        'Display & Programmatic Advertising',
        'Video Advertising & YouTube Campaigns',
        'Retargeting & Remarketing Strategies',
        'Shopping Ads & E-commerce Campaigns',
        'Performance Max Campaigns',
        'Conversion Rate Optimization'
      ],
      benefits: [
        'Achieve ROAS improvements of 3:1+ on average',
        'Reduce cost-per-acquisition by 35%+',
        'Reach the right audience at the perfect moment',
        'Scale campaigns based on performance data',
        'Track every dollar spent with comprehensive analytics'
      ],
    },
    'earned-media': {
      id: 'earned-media',
      title: 'Earned Media & PR',
      subtitle: 'Build Authentic Brand Trust',
      description: 'Cultivate authentic brand relationships through strategic PR, influencer partnerships, and content that resonates. Our earned media campaigns generate 5x more trust than paid ads and drive sustainable, long-term growth.',
      icon: FaNewspaper,
      color: 'from-green-500 to-emerald-600',
      link: '/services/earned-media',
      features: [
        'Public Relations & Media Relations',
        'Influencer Marketing & Partnerships',
        'Content Marketing Strategy',
        'Social Media Management',
        'Brand Awareness Campaigns',
        'Thought Leadership Development',
        'Crisis Communication Management',
        'Community Building & Engagement'
      ],
      benefits: [
        'Generate 5x more trust than paid advertising',
        'Build sustainable, long-term brand value',
        'Create authentic relationships with your audience',
        'Enhance brand credibility and authority',
        'Drive organic growth through word-of-mouth'
      ],
    },
    'creative': {
      id: 'creative',
      title: 'Creative Services',
      subtitle: 'Visual Experiences That Captivate & Convert',
      description: 'From brand identity to video production, we craft visual experiences that resonate deeply with audiences. Our designs have helped brands increase engagement by 60%+ and boost conversion rates through compelling storytelling.',
      icon: FaPalette,
      color: 'from-pink-500 to-purple-600',
      link: '/services/creative',
      features: [
        'Brand Design & Identity Development',
        'UI/UX Design & User Experience',
        'Graphic Design & Visual Content',
        'Video Production & Animation',
        'Content Creation & Copywriting',
        'Marketing Collateral Design',
        'Social Media Graphics & Templates',
        'Infographics & Data Visualization'
      ],
      benefits: [
        'Increase engagement rates by 60%+',
        'Boost conversion rates through compelling visuals',
        'Build distinctive brand recognition',
        'Create emotional connections with your audience',
        'Stand out in competitive markets'
      ],
    },
    'business-tools': {
      id: 'business-tools',
      title: 'Business Tools & Automation',
      subtitle: 'Streamline Operations & Maximize Efficiency',
      description: 'Transform your operations with intelligent automation, custom applications, and data-driven insights. We build tools that eliminate bottlenecks, reduce costs by up to 40%, and accelerate your path to digital excellence.',
      icon: FaCogs,
      color: 'from-amber-500 to-orange-600',
      link: '/services/business-tools',
      features: [
        'SEO Tools & Analytics Platform',
        'Process Automation & Workflows',
        'Custom Application Development',
        'Business Intelligence Solutions',
        'Performance Optimization Tools',
        'API Development & Integration',
        'CRM & System Integration',
        'Workflow Management Systems'
      ],
      benefits: [
        'Reduce operational costs by up to 40%',
        'Eliminate bottlenecks and manual processes',
        'Increase efficiency by 150%+',
        'Gain real-time business insights',
        'Accelerate time-to-market for initiatives'
      ],
    },
    'cloud-solutions': {
      id: 'cloud-solutions',
      title: 'Cloud Solutions & Infrastructure',
      subtitle: 'Scale with Confidence & Security',
      description: 'Secure, scalable, and cost-effective cloud infrastructure solutions that enable your business to operate efficiently and scale seamlessly. Achieve 99.9% uptime reliability while reducing IT costs by up to 40%.',
      icon: FaCloud,
      color: 'from-cyan-500 to-blue-600',
      link: '/services/cloud-solutions',
      features: [
        'Cloud Migration & Strategy',
        'Infrastructure as a Service (IaaS)',
        'Platform as a Service (PaaS)',
        'Cloud Security & Compliance',
        'Backup & Disaster Recovery',
        '24/7 Monitoring & Support',
        'Cost Optimization & Management',
        'Multi-Cloud & Hybrid Solutions'
      ],
      benefits: [
        'Reduce IT infrastructure costs by up to 40%',
        'Achieve 99.9% uptime reliability',
        'Scale resources on-demand instantly',
        'Enhanced security and compliance',
        'Improve business continuity and resilience'
      ],
    },
    'ict-strategy': {
      id: 'ict-strategy',
      title: 'ICT & AI Strategy',
      subtitle: 'Strategic Technology Leadership',
      description: 'Transform your organization with comprehensive ICT and AI strategies that align technology with business goals, ensure compliance, and drive sustainable digital transformation. Our frameworks help organizations achieve 40%+ efficiency improvements.',
      icon: FaBrain,
      color: 'from-violet-500 to-purple-600',
      link: '/services/ict-strategy',
      features: [
        'AI Strategy & Governance Frameworks',
        'ICT Policy Development & Implementation',
        'Data Strategy & Governance',
        'Cybersecurity Policy & Frameworks',
        'Digital Transformation Roadmaps',
        'Technology Assessment & Audits',
        'Compliance & Risk Management',
        'Change Management & Training'
      ],
      benefits: [
        'Achieve 40%+ efficiency improvements',
        'Ensure regulatory compliance',
        'Reduce implementation risks',
        'Optimize technology investments',
        'Accelerate digital transformation'
      ],
    },
    'custom-development': {
      id: 'custom-development',
      title: 'Custom Software Development',
      subtitle: 'Tailored Solutions for Your Business',
      description: 'Build enterprise-grade software solutions tailored to your unique workflows. From web apps to mobile platforms, we deliver scalable applications that reduce operational costs by 40%+ and accelerate time-to-market.',
      icon: FaCode,
      color: 'from-teal-500 to-green-600',
      link: '/services/business-tools/custom-applications',
      features: [
        'Custom Web Applications',
        'Mobile App Development (iOS & Android)',
        'Enterprise Software Solutions',
        'API Development & Integration',
        'Database Design & Management',
        'Cloud-Native Applications',
        'Legacy System Modernization',
        'Quality Assurance & Testing'
      ],
      benefits: [
        'Reduce operational costs by 40%+',
        'Accelerate time-to-market',
        'Perfect fit for your business processes',
        'Scalable solutions that grow with you',
        'Competitive advantage through innovation'
      ],
    }
  };

  const stats = [
    { icon: FaUsers, number: "10+", label: "Projects Completed", color: "from-blue-500 to-blue-600" },
    { icon: FaGlobe, number: "5+", label: "Countries Served", color: "from-green-500 to-green-600" },
    { icon: FaRocket, number: "98%", label: "Client Satisfaction", color: "from-orange-500 to-orange-600" },
    { icon: FaShieldAlt, number: "24/7", label: "Support Available", color: "from-purple-500 to-purple-600" }
  ];

  return (
    <>
      <Helmet>
        <title>Services - Digital Marketing, Cloud Solutions & Business Tools | Skyfalke</title>
        <meta name="description" content="Comprehensive technology services including digital marketing, cloud solutions, business tools, and consulting. Transform your business with Skyfalke's expert solutions." />
        <meta name="keywords" content="digital marketing services, cloud solutions, business tools, technology consulting, SEO, PPC, social media marketing" />
        <link rel="canonical" href="https://skyfalke.com/services" />
      </Helmet>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-800 relative overflow-hidden pt-32">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4 sm:px-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Comprehensive Solutions for
              <span className="block text-secondary-500 mt-2">
                Modern Businesses
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed px-4">
              From digital marketing to cloud infrastructure, we provide end-to-end solutions 
              that drive growth, efficiency, and competitive advantage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Navigation */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Services</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'detailed'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Detailed View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grid View
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setActiveService(key)}
                className={`flex items-center space-x-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base shadow-sm hover:shadow-md ${
                  activeService === key
                    ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <service.icon className="text-base sm:text-lg" />
                <span className="hidden sm:inline">{service.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(services).map(([key, service]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className={`bg-gradient-to-br ${service.color} p-6 text-white`}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                      {React.createElement(service.icon, { className: "text-3xl text-white" })}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-white/90 text-sm">{service.subtitle}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    <div className="space-y-2 mb-6">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={service.link || '/contact'}
                      className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all group"
                    >
                      <span>Learn More</span>
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                {/* Service Header */}
                <div className="text-center mb-12 sm:mb-16">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${services[activeService].color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    {React.createElement(services[activeService].icon, { className: "text-3xl sm:text-4xl text-white" })}
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 px-4 leading-tight">
                    {services[activeService].title}
                  </h2>
                  <p className="text-xl sm:text-2xl md:text-3xl text-primary-600 font-semibold mb-6 px-4">
                    {services[activeService].subtitle}
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                    {services[activeService].description}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
                  {/* Features */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <FaCheck className="text-green-500 mr-3" />
                      What's Included
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services[activeService].features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <FaRocket className="text-secondary-500 mr-3" />
                      Key Benefits
                    </h3>
                    <div className="space-y-4">
                      {services[activeService].benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border-l-4 border-primary-500"
                        >
                          <FaArrowRight className="text-primary-600 mt-1 flex-shrink-0 font-bold" />
                          <span className="text-gray-800 text-sm sm:text-base font-medium leading-relaxed">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>


                {/* CTA for Current Service */}
                <div className="text-center">
                  <div className={`bg-gradient-to-br ${services[activeService].color} rounded-2xl p-8 sm:p-10 md:p-12 text-white shadow-2xl`}>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4">
                      Ready to Get Started with {services[activeService].title}?
                    </h3>
                    <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-95 px-4 leading-relaxed">
                      Let's discuss how we can help transform your business with our {services[activeService].title.toLowerCase()}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                      <Link 
                        href={`/schedule-consultation?service=${encodeURIComponent(services[activeService].title)}`}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                      >
                        <span>Schedule Consultation</span>
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                      {services[activeService].link && (
                        <Link 
                          href={services[activeService].link}
                          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Learn More
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our track record speaks for itself. Join hundreds of companies that have transformed their business with our solutions.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon className="text-2xl text-white" />
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-semibold text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Need a Custom Solution?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Every business is unique. Let's create a tailored solution that perfectly fits your needs and drives measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/schedule-consultation"
                className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 bg-secondary-500 text-primary-900 font-bold rounded-xl hover:bg-secondary-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                <span>Schedule Free Consultation</span>
                <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary-900 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Custom Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
