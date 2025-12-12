import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  FaGlobe
} from 'react-icons/fa';

const Services = () => {
  const [activeService, setActiveService] = useState('digital-marketing');

  const services = {
    'digital-marketing': {
      id: 'digital-marketing',
      title: 'Digital Marketing Solutions',
      subtitle: 'Amplify Your Brand & Drive Growth',
      description: 'Comprehensive digital marketing strategies that increase visibility, engage your audience, and drive measurable business results across all digital channels.',
      icon: FaChartLine,
      color: 'from-blue-500 to-purple-600',
      features: [
        'Search Engine Optimization (SEO)',
        'Pay-Per-Click Advertising (PPC)',
        'Social Media Marketing',
        'Content Marketing Strategy',
        'Email Marketing Campaigns',
        'Marketing Analytics & Reporting',
        'Brand Strategy & Development',
        'Conversion Rate Optimization'
      ],
      benefits: [
        'Increase online visibility by up to 300%',
        'Generate qualified leads consistently',
        'Build strong brand recognition',
        'Improve customer engagement rates',
        'Achieve measurable ROI on marketing spend'
      ],
    },
    'cloud-solutions': {
      id: 'cloud-solutions',
      title: 'Cloud Solutions',
      subtitle: 'Scale with Confidence & Security',
      description: 'Secure, scalable, and cost-effective cloud infrastructure solutions that enable your business to operate efficiently and scale seamlessly.',
      icon: FaCloud,
      color: 'from-green-500 to-teal-600',
      features: [
        'Cloud Migration Services',
        'Infrastructure as a Service (IaaS)',
        'Platform as a Service (PaaS)',
        'Cloud Security & Compliance',
        'Backup & Disaster Recovery',
        '24/7 Monitoring & Support',
        'Cost Optimization',
        'Multi-Cloud Strategy'
      ],
      benefits: [
        'Reduce IT infrastructure costs by up to 40%',
        'Achieve 99.9% uptime reliability',
        'Scale resources on-demand',
        'Enhanced security and compliance',
        'Improve business continuity'
      ],
    },
    'business-tools': {
      id: 'business-tools',
      title: 'Business Tools & Optimization',
      subtitle: 'Streamline Operations & Boost Efficiency',
      description: 'Powerful business optimization tools including our flagship SEO platform and custom solutions tailored to streamline your operations.',
      icon: FaCogs,
      color: 'from-orange-500 to-red-600',
      features: [
        'Skyfalke Optimizer (SEO Tool)',
        'Business Intelligence Dashboard',
        'Process Automation Tools',
        'Custom Software Development',
        'CRM Integration',
        'Analytics & Reporting',
        'Workflow Optimization',
        'API Development'
      ],
      benefits: [
        'Increase operational efficiency by 150%',
        'Reduce manual processes by 80%',
        'Gain real-time business insights',
        'Improve decision-making speed',
        'Enhance customer experience'
      ],
    },
    'technology': {
      id: 'technology',
      title: 'Technology Consulting',
      subtitle: 'Expert Guidance for Digital Transformation',
      description: 'Strategic technology consulting services to help you make informed decisions and implement the right solutions for sustainable business growth.',
      icon: FaSearch,
      color: 'from-purple-500 to-pink-600',
      features: [
        'Digital Transformation Strategy',
        'Technology Audit & Assessment',
        'Solution Architecture Design',
        'Implementation Planning',
        'Change Management',
        'Training & Support',
        'Performance Optimization',
        'Security Assessment'
      ],
      benefits: [
        'Make informed technology decisions',
        'Reduce implementation risks',
        'Optimize technology investments',
        'Accelerate digital transformation',
        'Ensure scalable solutions'
      ],
    }
  };

  const stats = [
    { icon: FaUsers, number: "500+", label: "Projects Completed" },
    { icon: FaGlobe, number: "25+", label: "Countries Served" },
    { icon: FaRocket, number: "98%", label: "Client Satisfaction" },
    { icon: FaShieldAlt, number: "24/7", label: "Support Available" }
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
      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-primary-500 to-primary-800 relative overflow-hidden">
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
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container-custom px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setActiveService(key)}
                className={`flex items-center space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                  activeService === key
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <service.icon className="text-sm sm:text-base" />
                <span className="hidden sm:inline">{service.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
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
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                  {React.createElement(services[activeService].icon, { className: "text-2xl sm:text-3xl text-white" })}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                  {services[activeService].title}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-primary-600 font-semibold mb-4 sm:mb-6 px-4">
                  {services[activeService].subtitle}
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                  {services[activeService].description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16">
                {/* Features */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">What's Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {services[activeService].features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <FaCheck className="text-green-500 flex-shrink-0 text-sm sm:text-base" />
                        <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Key Benefits</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {services[activeService].benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 sm:p-4 bg-white rounded-lg border border-gray-200"
                      >
                        <FaArrowRight className="text-primary-500 mt-1 flex-shrink-0 text-sm sm:text-base" />
                        <span className="text-gray-700 text-sm sm:text-base">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>


              {/* CTA for Current Service */}
              <div className="text-center">
                <div className={`bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 md:p-12 text-white`}>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 px-4">
                    Ready to Get Started with {services[activeService].title}?
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-4">
                    Let's discuss how we can help transform your business with our {services[activeService].title.toLowerCase()}.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 group text-sm sm:text-base"
                    >
                      <span>Start Your Project</span>
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <Link
                      to="/case-studies"
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm sm:text-base"
                    >
                      View Success Stories
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <stat.icon className="text-lg sm:text-2xl text-white" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Need a Custom Solution?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Every business is unique. Let's create a tailored solution that perfectly fits your needs and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-primary-900 font-bold rounded-xl hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 group text-sm sm:text-base"
              >
                <span>Get Custom Quote</span>
                <FaArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a
                href="https://cloud.skyfalke.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary-900 transition-all duration-300 text-sm sm:text-base"
              >
                <span>Visit Cloud Platform</span>
                <FaExternalLinkAlt className="ml-2 sm:ml-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
