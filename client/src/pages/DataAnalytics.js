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
        <section className="relative bg-slate-900 text-white py-16 sm:py-20 md:py-24">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Data & Analytics
                <span className="block text-secondary-500 mt-2">Solutions</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
                Transform your business with actionable insights, predictive analytics, and comprehensive data intelligence solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-secondary-500 hover:bg-secondary-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">
                  Get Started
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base">
                  View Case Studies
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Our Data & Analytics Services
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Comprehensive data solutions designed to unlock insights, drive decisions, and accelerate your business growth.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <service.icon className="text-white text-lg sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{service.description}</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 text-sm sm:text-base">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Why Choose Our Data Analytics?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Experience the transformative power of data-driven decision making with our comprehensive analytics solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-white text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Transform Your Business with Data?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Let's discuss how our data analytics solutions can help you make better decisions, optimize operations, and drive growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-secondary-500 text-white hover:bg-secondary-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base">
                  <span>Get Free Consultation</span>
                  <FaArrowRight className="ml-2" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base">
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
