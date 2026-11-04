'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaChartBar, 
  FaUsers, 
  FaRocket, 
  FaShieldAlt, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaDatabase,
  FaChartLine,
  FaEye,
  FaCog
} from 'react-icons/fa';

const BusinessIntelligence = () => {
  const features = [
    {
      icon: FaChartBar,
      title: "Interactive Dashboards",
      description: "Real-time, interactive dashboards that provide instant insights into your business performance."
    },
    {
      icon: FaDatabase,
      title: "Data Integration",
      description: "Seamlessly integrate data from multiple sources for comprehensive business intelligence."
    },
    {
      icon: FaChartLine,
      title: "KPI Tracking",
      description: "Monitor key performance indicators with automated tracking and alerting systems."
    },
    {
      icon: FaEye,
      title: "Visual Analytics",
      description: "Transform complex data into clear, actionable visualizations and reports."
    },
    {
      icon: FaCog,
      title: "Custom Solutions",
      description: "Tailored business intelligence solutions designed for your specific industry and needs."
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Informed Decision Making",
      description: "Make strategic decisions based on real-time data and comprehensive insights."
    },
    {
      icon: FaRocket,
      title: "Operational Efficiency",
      description: "Identify bottlenecks and optimization opportunities to streamline operations."
    },
    {
      icon: FaShieldAlt,
      title: "Risk Management",
      description: "Proactively identify and mitigate risks through data-driven analysis."
    },
    {
      icon: FaLightbulb,
      title: "Strategic Planning",
      description: "Develop data-backed strategies for growth and competitive advantage."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Data Assessment",
      description: "Evaluate your current data infrastructure and identify improvement opportunities."
    },
    {
      step: "02",
      title: "Solution Design",
      description: "Design custom BI solutions tailored to your business objectives and requirements."
    },
    {
      step: "03",
      title: "Implementation",
      description: "Deploy and configure your business intelligence platform with expert guidance."
    },
    {
      step: "04",
      title: "Training & Support",
      description: "Provide comprehensive training and ongoing support for your BI solution."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Business Intelligence Solutions | Skyfalke</title>
        <meta name="description" content="Transform your business with comprehensive business intelligence solutions. Get real-time insights, interactive dashboards, and data-driven decision making capabilities." />
        <meta name="keywords" content="business intelligence, BI, data analytics, dashboards, KPI tracking, data visualization" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Business Intelligence Dashboard with charts and analytics"
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
              Business Intelligence Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Transform raw data into actionable insights that drive strategic decisions. Our BI solutions help organizations increase operational efficiency by 40%+ and improve decision-making speed by 60%+.
            </p>
            <Link href="/schedule-consultation?service=Business Intelligence">
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
              Powerful Business Intelligence Features
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive BI solutions provide everything you need to make data-driven decisions and drive measurable business growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-secondary-500 text-4xl mb-6">
                  <feature.icon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why Choose Our Business Intelligence?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the transformative power of data-driven decision making with our advanced BI solutions that deliver measurable results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-white p-6 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                <div className="text-secondary-500 text-3xl mt-1 flex-shrink-0">
                  <benefit.icon />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our Implementation Process
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We follow a proven methodology to ensure successful BI implementation and maximum ROI for your organization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="bg-secondary-500 text-primary-900 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Start your journey towards data-driven success with our comprehensive business intelligence solutions. Schedule a free consultation to discover how we can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule-consultation?service=Business Intelligence">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Schedule Consultation
                </motion.button>
              </Link>
              <Link href="/services/data-analytics">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-900 transition-all"
                >
                  View All Analytics Services
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BusinessIntelligence;
