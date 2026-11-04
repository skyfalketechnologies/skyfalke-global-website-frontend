'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaTachometerAlt, 
  FaRocket, 
  FaChartLine, 
  FaCogs,
  FaLightbulb,
  FaUsers,
  FaShieldAlt,
  FaSync,
  FaCheckCircle,
  FaEye
} from 'react-icons/fa';

const PerformanceOptimization = () => {
  const features = [
    {
      icon: <FaTachometerAlt className="text-3xl text-secondary-500" />,
      title: "Speed Optimization",
      description: "Improve system performance and response times for better user experience"
    },
    {
      icon: <FaRocket className="text-3xl text-secondary-500" />,
      title: "Efficiency Boost",
      description: "Optimize processes and workflows to maximize productivity and output"
    },
    {
      icon: <FaChartLine className="text-3xl text-secondary-500" />,
      title: "Performance Monitoring",
      description: "Real-time monitoring and analytics to track system performance metrics"
    },
    {
      icon: <FaCogs className="text-3xl text-secondary-500" />,
      title: "System Tuning",
      description: "Fine-tune systems and applications for optimal performance and reliability"
    }
  ];

  const services = [
    {
      icon: <FaLightbulb className="text-2xl text-accent-500" />,
      title: "Performance Analysis",
      description: "Comprehensive analysis of current performance bottlenecks and optimization opportunities"
    },
    {
      icon: <FaUsers className="text-2xl text-accent-500" />,
      title: "User Experience Optimization",
      description: "Optimize user interfaces and workflows for better usability and satisfaction"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-accent-500" />,
      title: "Security Optimization",
      description: "Enhance security measures while maintaining optimal performance levels"
    },
    {
      icon: <FaSync className="text-2xl text-accent-500" />,
      title: "Continuous Improvement",
      description: "Ongoing optimization and refinement based on performance data and user feedback"
    },
    {
      icon: <FaCheckCircle className="text-2xl text-accent-500" />,
      title: "Quality Assurance",
      description: "Ensure optimized systems maintain quality standards and reliability"
    },
    {
      icon: <FaEye className="text-2xl text-accent-500" />,
      title: "Performance Testing",
      description: "Comprehensive testing to validate optimization improvements and system stability"
    }
  ];

  const benefits = [
    "Improved system performance",
    "Enhanced user experience",
    "Increased productivity",
    "Reduced operational costs",
    "Better resource utilization",
    "Competitive advantage"
  ];

  const process = [
    {
      step: "01",
      title: "Performance Assessment",
      description: "Analyze current performance metrics and identify optimization opportunities"
    },
    {
      step: "02",
      title: "Optimization Strategy",
      description: "Develop comprehensive optimization strategies tailored to your specific needs"
    },
    {
      step: "03",
      title: "Implementation",
      description: "Execute optimization improvements with proper testing and validation"
    },
    {
      step: "04",
      title: "Monitoring & Maintenance",
      description: "Continuous monitoring and maintenance to sustain optimal performance levels"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Performance Optimization - Skyfalke</title>
        <meta name="description" content="Optimize your business systems and processes for maximum performance and efficiency. Improve speed, productivity, and user experience with our performance optimization solutions." />
        <meta name="keywords" content="performance optimization, system optimization, speed optimization, efficiency improvement, performance monitoring, system tuning" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Performance Optimization and system tuning"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-800/80"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-400 to-accent-500"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Performance Optimization
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Optimize your systems and processes for maximum performance and efficiency
              </p>
              <Link href="/schedule-consultation?service=Performance Optimization">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-colors"
                >
                  Get Started Today
                </motion.button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </motion.div>
          </div>
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
              Optimization Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive performance optimization tools to maximize your system efficiency
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
              Our Optimization Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end performance optimization services to maximize your system efficiency
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
              Benefits of Performance Optimization
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Transform your business with optimized systems and processes
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
              Our Optimization Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to optimizing your systems and processes for maximum performance
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
              Ready to Optimize Your Performance?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Get started with our performance optimization services to maximize your system efficiency
            </p>
            <Link href="/schedule-consultation?service=Performance Optimization">
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

export default PerformanceOptimization;
