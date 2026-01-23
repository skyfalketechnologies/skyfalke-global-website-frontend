'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaChartBar, 
  FaChartPie, 
  FaBrain, 
  FaChartLine, 
  FaDatabase,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaLightbulb,
  FaArrowRight
} from 'react-icons/fa';

const DataAnalytics = () => {
  const services = [
    {
      icon: FaChartBar,
      title: "Business Intelligence",
      description: "Transform raw data into actionable insights with our comprehensive business intelligence solutions.",
      features: [
        "Interactive dashboards and reports",
        "Real-time data visualization",
        "KPI tracking and monitoring",
        "Custom analytics solutions"
      ]
    },
    {
      icon: FaChartPie,
      title: "Data Analytics",
      description: "Unlock the power of your data with advanced analytics and predictive modeling.",
      features: [
        "Advanced statistical analysis",
        "Data mining and exploration",
        "Performance optimization insights",
        "Trend analysis and forecasting"
      ]
    },
    {
      icon: FaBrain,
      title: "Predictive Analytics",
      description: "Anticipate future trends and make data-driven decisions with AI-powered predictive analytics.",
      features: [
        "Machine learning models",
        "Risk assessment and mitigation",
        "Customer behavior prediction",
        "Market trend forecasting"
      ]
    },
    {
      icon: FaChartLine,
      title: "Performance Tracking",
      description: "Monitor and optimize your business performance with comprehensive tracking solutions.",
      features: [
        "Real-time performance monitoring",
        "Automated reporting systems",
        "Goal tracking and alerts",
        "Performance optimization recommendations"
      ]
    },
    {
      icon: FaDatabase,
      title: "Custom Dashboards",
      description: "Tailored dashboards designed specifically for your business needs and objectives.",
      features: [
        "Custom visualization design",
        "Interactive data exploration",
        "Role-based access control",
        "Mobile-responsive dashboards"
      ]
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Data-Driven Decisions",
      description: "Make informed decisions based on real data and insights rather than assumptions."
    },
    {
      icon: FaRocket,
      title: "Improved Efficiency",
      description: "Streamline operations and identify optimization opportunities through data analysis."
    },
    {
      icon: FaShieldAlt,
      title: "Risk Mitigation",
      description: "Identify potential risks early and develop strategies to mitigate them effectively."
    },
    {
      icon: FaLightbulb,
      title: "Innovation Insights",
      description: "Discover new opportunities and innovative approaches through data-driven insights."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Data Analytics & Business Intelligence Services | Skyfalke - Transform Data into Actionable Insights</title>
        <meta name="description" content="Transform your business with Skyfalke's comprehensive data analytics and business intelligence solutions. Get actionable insights, predictive analytics, and custom dashboards." />
        <meta name="keywords" content="data analytics, business intelligence, predictive analytics, data visualization, custom dashboards, performance tracking" />
        <meta property="og:title" content="Data Analytics & Business Intelligence Services | Skyfalke - Transform Data into Actionable Insights" />
        <meta property="og:description" content="Transform your business with comprehensive data analytics and business intelligence solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/data-analytics" />
        <meta property="og:image" content="/favicon.ico" />
        <link rel="canonical" href="https://skyfalke.com/services/data-analytics" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
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
                Data & Analytics
                <span className="block text-secondary-500 mt-3">That Drive Decisions</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto mb-8 leading-relaxed">
                Unlock the hidden potential in your data with advanced analytics, AI-powered insights, and predictive modeling. Our solutions help companies increase revenue by 25%+ and reduce operational costs through intelligent data strategies.
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
                Our Data & Analytics Services
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From real-time dashboards to machine learning models, we transform raw data into strategic advantages that fuel growth and innovation.
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
                Why Choose Our Data Analytics?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join industry leaders who trust us to turn their data into competitive advantages and measurable business outcomes.
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
                Ready to Unlock Your Data's Potential?
              </h2>
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover how our analytics solutions can reveal hidden opportunities, predict trends, and transform your decision-making process.
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

export default DataAnalytics;
