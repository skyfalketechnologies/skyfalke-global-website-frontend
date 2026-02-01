'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaChartBar, 
  FaDatabase, 
  FaLightbulb, 
  FaChartLine,
  FaRocket,
  FaUsers,
  FaShieldAlt,
  FaCogs,
  FaCheckCircle,
  FaEye
} from 'react-icons/fa';

const BusinessIntelligence = () => {
  const features = [
    {
      icon: <FaChartBar className="text-3xl text-secondary-500" />,
      title: "Data Analytics",
      description: "Comprehensive data analysis to uncover insights and drive informed decision-making"
    },
    {
      icon: <FaDatabase className="text-3xl text-secondary-500" />,
      title: "Data Integration",
      description: "Seamless integration of data from multiple sources for unified reporting"
    },
    {
      icon: <FaLightbulb className="text-3xl text-secondary-500" />,
      title: "Insight Generation",
      description: "Transform raw data into actionable insights that drive business growth"
    },
    {
      icon: <FaChartLine className="text-3xl text-secondary-500" />,
      title: "Performance Tracking",
      description: "Monitor key performance indicators and track business metrics in real-time"
    }
  ];

  const services = [
    {
      icon: <FaRocket className="text-2xl text-accent-500" />,
      title: "Data Strategy",
      description: "Develop comprehensive data strategies aligned with your business objectives"
    },
    {
      icon: <FaUsers className="text-2xl text-accent-500" />,
      title: "User Training",
      description: "Train your team to effectively use BI tools and interpret data insights"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-accent-500" />,
      title: "Data Security",
      description: "Ensure data security and compliance with industry regulations"
    },
    {
      icon: <FaCogs className="text-2xl text-accent-500" />,
      title: "System Integration",
      description: "Integrate BI solutions with existing business systems and workflows"
    },
    {
      icon: <FaCheckCircle className="text-2xl text-accent-500" />,
      title: "Quality Assurance",
      description: "Implement data quality checks and validation processes"
    },
    {
      icon: <FaEye className="text-2xl text-accent-500" />,
      title: "Real-time Monitoring",
      description: "Set up real-time dashboards and alerts for proactive decision-making"
    }
  ];

  const benefits = [
    "Data-driven decision making",
    "Improved operational efficiency",
    "Better customer insights",
    "Competitive advantage",
    "Reduced costs and risks",
    "Enhanced strategic planning"
  ];

  const process = [
    {
      step: "01",
      title: "Data Assessment",
      description: "Evaluate your current data infrastructure and identify improvement opportunities"
    },
    {
      step: "02",
      title: "Strategy Development",
      description: "Create a comprehensive BI strategy tailored to your business needs"
    },
    {
      step: "03",
      title: "Implementation",
      description: "Deploy BI solutions with proper data integration and user training"
    },
    {
      step: "04",
      title: "Optimization",
      description: "Continuously monitor and optimize BI performance and user adoption"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Business Intelligence - Skyfalke</title>
        <meta name="description" content="Transform your business with powerful Business Intelligence solutions. Gain actionable insights from your data to drive informed decision-making and strategic growth." />
        <meta name="keywords" content="business intelligence, data analytics, BI tools, data insights, business analytics, data visualization, reporting" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Business Intelligence and data analytics"
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
                Business Intelligence
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Transform your data into actionable insights that drive business growth
              </p>
              <Link href="/schedule-consultation?service=Business Intelligence">
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
              BI Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive Business Intelligence tools to unlock the power of your data
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
              Our BI Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end Business Intelligence services to transform your data into insights
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
              Benefits of Business Intelligence
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Transform your business with data-driven insights and strategic intelligence
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
              Our BI Implementation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to implementing Business Intelligence in your organization
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
              Ready to Unlock Your Data's Potential?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Get started with our Business Intelligence solutions to transform your data into actionable insights
            </p>
            <Link href="/schedule-consultation?service=Business Intelligence">
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

export default BusinessIntelligence;
