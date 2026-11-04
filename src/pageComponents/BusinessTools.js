'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaSearch, 
  FaCogs, 
  FaCode, 
  FaLightbulb, 
  FaTools,
  FaRocket,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaArrowRight
} from 'react-icons/fa';

const BusinessTools = () => {
  const services = [
    {
      icon: FaSearch,
      title: "SEO Tools & Analytics",
      description: "Optimize your online presence and improve search engine rankings with advanced SEO tools.",
      features: [
        "Keyword research and analysis",
        "On-page SEO optimization",
        "Technical SEO audits",
        "Performance tracking and reporting"
      ]
    },
    {
      icon: FaCogs,
      title: "Process Automation",
      description: "Streamline your business operations with intelligent automation solutions.",
      features: [
        "Workflow automation design",
        "Business process optimization",
        "Integration and API development",
        "Automated reporting systems"
      ]
    },
    {
      icon: FaCode,
      title: "Custom Applications",
      description: "Build tailored software solutions that address your specific business needs.",
      features: [
        "Custom web applications",
        "Mobile app development",
        "Database design and management",
        "Third-party integrations"
      ]
    },
    {
      icon: FaLightbulb,
      title: "Business Intelligence",
      description: "Transform data into actionable insights for better decision-making.",
      features: [
        "Data analysis and visualization",
        "KPI dashboard development",
        "Predictive analytics",
        "Business reporting automation"
      ]
    },
    {
      icon: FaTools,
      title: "Performance Optimization",
      description: "Optimize your business performance and maximize efficiency across all operations.",
      features: [
        "Performance monitoring and analysis",
        "Efficiency improvement strategies",
        "Resource optimization",
        "Continuous improvement processes"
      ]
    }
  ];

  const benefits = [
    {
      icon: FaRocket,
      title: "Increased Efficiency",
      description: "Streamline operations and reduce manual work with automation and optimization."
    },
    {
      icon: FaChartLine,
      title: "Better Performance",
      description: "Improve business metrics and achieve better results with data-driven insights."
    },
    {
      icon: FaShieldAlt,
      title: "Competitive Advantage",
      description: "Stay ahead of the competition with advanced tools and optimized processes."
    },
    {
      icon: FaUsers,
      title: "Enhanced Productivity",
      description: "Empower your team with better tools and streamlined workflows."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Business Tools & Automation Services | Skyfalke - Optimize Operations & Maximize Efficiency</title>
        <meta name="description" content="Optimize your business operations with Skyfalke's business tools and automation solutions. From SEO tools to custom applications, we help you work smarter." />
        <meta name="keywords" content="business tools, SEO tools, process automation, custom applications, business intelligence, performance optimization" />
        <meta property="og:title" content="Business Tools & Automation Services | Skyfalke - Optimize Operations & Maximize Efficiency" />
        <meta property="og:description" content="Optimize your business operations with our business tools and automation solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/business-tools" />
        <meta property="og:image" content="/favicon.ico" />
        <link rel="canonical" href="https://skyfalke.com/services/business-tools" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/95 to-primary-800/95"></div>
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Business Tools
                <span className="block text-secondary-500 mt-3">That Drive Results</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto mb-8 leading-relaxed">
                Transform your operations with intelligent automation, custom applications, and data-driven insights. We build tools that eliminate bottlenecks, reduce costs by up to 40%, and accelerate your path to digital excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-secondary-500 hover:bg-secondary-400 text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Get Started Today
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                  View Case Studies
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
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
                Our Business Tools Services
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From SEO optimization to custom software development, we deliver enterprise-grade solutions that integrate seamlessly with your existing infrastructure.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our Business Tools?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join hundreds of companies that have transformed their operations with our proven business tools and automation solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4 bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-14 h-14 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Operations?
              </h2>
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Schedule a free consultation to discover how our business tools can eliminate inefficiencies, reduce costs, and accelerate your growth trajectory.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-secondary-500 text-primary-900 hover:bg-secondary-400 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1">
                  <span>Get Free Consultation</span>
                  <FaArrowRight className="ml-2" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                  View Our Portfolio
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BusinessTools;
