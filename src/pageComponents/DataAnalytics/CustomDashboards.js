'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaDatabase, 
  FaUsers, 
  FaRocket, 
  FaShieldAlt, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaChartBar,
  FaEye,
  FaCog,
  FaMobile,
  FaDesktop,
  FaPalette
} from 'react-icons/fa';

const CustomDashboards = () => {
  const features = [
    {
      icon: FaPalette,
      title: "Custom Visualization Design",
      description: "Tailored dashboards with custom visualizations designed specifically for your business needs."
    },
    {
      icon: FaEye,
      title: "Interactive Data Exploration",
      description: "Interactive dashboards that allow users to drill down and explore data in real-time."
    },
    {
      icon: FaShieldAlt,
      title: "Role-Based Access Control",
      description: "Secure dashboards with role-based permissions ensuring users see only relevant data."
    },
    {
      icon: FaMobile,
      title: "Mobile-Responsive Design",
      description: "Access your dashboards anywhere with fully responsive mobile and tablet support."
    },
    {
      icon: FaCog,
      title: "Real-Time Data Integration",
      description: "Connect to multiple data sources for live, up-to-date information and insights."
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Improved Decision Making",
      description: "Get instant access to key metrics and insights for faster, more informed decisions."
    },
    {
      icon: FaRocket,
      title: "Enhanced Productivity",
      description: "Streamline workflows with centralized access to all critical business information."
    },
    {
      icon: FaShieldAlt,
      title: "Better Data Governance",
      description: "Ensure data security and compliance with controlled access and audit trails."
    },
    {
      icon: FaLightbulb,
      title: "Actionable Insights",
      description: "Transform complex data into clear, actionable insights with intuitive visualizations."
    }
  ];

  const dashboardTypes = [
    {
      title: "Executive Dashboards",
      description: "High-level overview dashboards for executives and senior management with key business metrics.",
      icon: FaChartBar
    },
    {
      title: "Operational Dashboards",
      description: "Real-time operational dashboards for monitoring day-to-day business processes and performance.",
      icon: FaCog
    },
    {
      title: "Analytical Dashboards",
      description: "Deep-dive analytical dashboards for data exploration and detailed analysis.",
      icon: FaEye
    },
    {
      title: "Departmental Dashboards",
      description: "Specialized dashboards tailored to specific departments and their unique needs.",
      icon: FaUsers
    }
  ];

  const process = [
    {
      step: "01",
      title: "Requirements Gathering",
      description: "Understand your business needs, data sources, and dashboard objectives."
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description: "Create custom dashboard designs and interactive prototypes for your review."
    },
    {
      step: "03",
      title: "Development & Integration",
      description: "Build and integrate dashboards with your data sources and systems."
    },
    {
      step: "04",
      title: "Deployment & Training",
      description: "Deploy dashboards and provide comprehensive training for your team."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Custom Dashboard Solutions | Skyfalke</title>
        <meta name="description" content="Tailored dashboards designed specifically for your business needs and objectives. Get custom visualizations, interactive data exploration, and mobile-responsive design." />
        <meta name="keywords" content="custom dashboards, data visualization, interactive dashboards, business intelligence, KPI dashboards, mobile dashboards" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Custom Dashboard with tailored visualizations"
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
              Custom Dashboards
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Tailored dashboards designed specifically for your business needs. Our custom solutions help organizations improve decision-making speed by 60%+ and provide real-time insights that drive measurable results.
            </p>
            <Link href="/schedule-consultation?service=Custom Dashboards">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Design Your Dashboard
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
              Custom Dashboard Features
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our custom dashboard solutions provide everything you need to visualize and interact with your data effectively, driving better business decisions.
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

      {/* Dashboard Types Section */}
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
              Types of Custom Dashboards
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We create specialized dashboards for different business needs and user roles, ensuring each stakeholder has access to the insights they need.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {dashboardTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-secondary-500 text-4xl mb-6">
                  <type.icon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {type.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {type.description}
                </p>
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
              Why Choose Our Custom Dashboards?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the benefits of tailored dashboard solutions designed specifically for your business needs and workflows.
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
                className="flex items-start space-x-4 bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors"
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
              Our Dashboard Development Process
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We follow a collaborative approach to ensure your custom dashboards meet all your requirements and deliver maximum value.
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
                className="text-center bg-white p-8 rounded-2xl hover:shadow-lg transition-all"
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
              Ready to Design Your Custom Dashboard?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Start your journey towards better data visualization with our custom dashboard solutions. Schedule a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule-consultation?service=Custom Dashboards">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Dashboard Project
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

export default CustomDashboards;
