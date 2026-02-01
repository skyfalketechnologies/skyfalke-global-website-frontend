'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaSearch, 
  FaChartLine, 
  FaGlobe, 
  FaBullseye,
  FaRocket,
  FaCogs,
  FaLightbulb,
  FaUsers,
  FaArrowUp,
  FaShieldAlt
} from 'react-icons/fa';

const SEOToolsAnalytics = () => {
  const features = [
    {
      icon: <FaSearch className="text-3xl text-secondary-500" />,
      title: "Keyword Research",
      description: "Advanced keyword research tools to identify high-value search terms and opportunities"
    },
    {
      icon: <FaChartLine className="text-3xl text-secondary-500" />,
      title: "Performance Analytics",
      description: "Comprehensive analytics to track rankings, traffic, and conversion metrics"
    },
    {
      icon: <FaGlobe className="text-3xl text-secondary-500" />,
      title: "Competitive Analysis",
      description: "Monitor competitors' strategies and identify gaps in your SEO approach"
    },
    {
      icon: <FaBullseye className="text-3xl text-secondary-500" />,
      title: "Technical SEO",
      description: "Technical optimization tools for site speed, mobile-friendliness, and crawlability"
    }
  ];

  const services = [
    {
      icon: <FaRocket className="text-2xl text-accent-500" />,
      title: "Ranking Optimization",
      description: "Improve search engine rankings through targeted optimization strategies"
    },
    {
      icon: <FaCogs className="text-2xl text-accent-500" />,
      title: "On-Page SEO",
      description: "Optimize individual pages for better search visibility and user experience"
    },
    {
      icon: <FaLightbulb className="text-2xl text-accent-500" />,
      title: "Content Strategy",
      description: "Data-driven content strategies that align with search intent and user needs"
    },
    {
      icon: <FaUsers className="text-2xl text-accent-500" />,
      title: "Local SEO",
      description: "Optimize for local search results and improve local business visibility"
    },
    {
      icon: <FaArrowUp className="text-2xl text-accent-500" />,
      title: "Link Building",
      description: "Strategic link building campaigns to improve domain authority and rankings"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-accent-500" />,
      title: "SEO Audits",
      description: "Comprehensive website audits to identify and fix SEO issues"
    }
  ];

  const benefits = [
    "Increased organic traffic and visibility",
    "Higher search engine rankings",
    "Better user experience and engagement",
    "Competitive advantage in search results",
    "Data-driven optimization decisions",
    "Long-term sustainable growth"
  ];

  const process = [
    {
      step: "01",
      title: "SEO Audit",
      description: "Comprehensive analysis of your current SEO performance and opportunities"
    },
    {
      step: "02",
      title: "Strategy Development",
      description: "Custom SEO strategy tailored to your business goals and target audience"
    },
    {
      step: "03",
      title: "Implementation",
      description: "Execute optimization strategies across technical, on-page, and off-page elements"
    },
    {
      step: "04",
      title: "Monitoring & Optimization",
      description: "Continuous monitoring and refinement based on performance data and trends"
    }
  ];

  return (
    <>
      <Helmet>
        <title>SEO Tools & Analytics - Skyfalke</title>
        <meta name="description" content="Advanced SEO tools and analytics to improve your search rankings, drive organic traffic, and optimize your digital presence with data-driven insights." />
        <meta name="keywords" content="SEO tools, analytics, keyword research, performance tracking, competitive analysis, technical SEO" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
            alt="SEO Tools and Analytics dashboard"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/95 to-primary-800/95"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              SEO Tools & Analytics
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Advanced SEO tools and analytics to improve your search rankings and drive organic traffic. Our solutions help businesses increase organic visibility by 50%+ and improve conversion rates by 30%+.
            </p>
            <Link href="/schedule-consultation?service=SEO Tools & Analytics">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Powerful SEO Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive SEO tools and analytics to optimize your website's search performance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Our SEO Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive SEO services to improve your search rankings and drive organic growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-primary-800 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our SEO Tools?
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Experience the benefits of data-driven SEO optimization
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4"
              >
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Our SEO Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to improving your search engine rankings
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-secondary-500 text-primary-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Improve Your SEO?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Get started with our advanced SEO tools and analytics to boost your search rankings
            </p>
            <Link href="/schedule-consultation?service=SEO Tools & Analytics">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary-500 text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-colors"
              >
                Schedule Your Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SEOToolsAnalytics;

