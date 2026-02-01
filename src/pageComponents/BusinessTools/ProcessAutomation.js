'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaCogs, 
  FaRobot, 
  FaChartLine, 
  FaClock,
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaShieldAlt,
  FaSync,
  FaCheckCircle
} from 'react-icons/fa';

const ProcessAutomation = () => {
  const features = [
    {
      icon: <FaCogs className="text-3xl text-secondary-500" />,
      title: "Workflow Automation",
      description: "Streamline business processes with intelligent workflow automation solutions"
    },
    {
      icon: <FaRobot className="text-3xl text-secondary-500" />,
      title: "RPA Solutions",
      description: "Robotic Process Automation to handle repetitive tasks and improve efficiency"
    },
    {
      icon: <FaChartLine className="text-3xl text-secondary-500" />,
      title: "Performance Analytics",
      description: "Monitor and optimize automated processes with real-time analytics"
    },
    {
      icon: <FaClock className="text-3xl text-secondary-500" />,
      title: "Time Optimization",
      description: "Reduce manual processing time and increase productivity across your organization"
    }
  ];

  const services = [
    {
      icon: <FaRocket className="text-2xl text-accent-500" />,
      title: "Process Mapping",
      description: "Analyze and map existing processes to identify automation opportunities"
    },
    {
      icon: <FaLightbulb className="text-2xl text-accent-500" />,
      title: "Automation Strategy",
      description: "Develop comprehensive automation strategies tailored to your business needs"
    },
    {
      icon: <FaUsers className="text-2xl text-accent-500" />,
      title: "Team Training",
      description: "Train your team to work effectively with automated systems and processes"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-accent-500" />,
      title: "Security Integration",
      description: "Ensure automated processes maintain security and compliance standards"
    },
    {
      icon: <FaSync className="text-2xl text-accent-500" />,
      title: "Continuous Improvement",
      description: "Ongoing optimization and refinement of automated processes"
    },
    {
      icon: <FaCheckCircle className="text-2xl text-accent-500" />,
      title: "Quality Assurance",
      description: "Implement quality checks and validation in automated workflows"
    }
  ];

  const benefits = [
    "Increased operational efficiency",
    "Reduced manual errors and costs",
    "Faster process completion times",
    "Improved employee productivity",
    "Enhanced data accuracy and consistency",
    "Scalable business operations"
  ];

  const process = [
    {
      step: "01",
      title: "Process Assessment",
      description: "Analyze current processes to identify automation opportunities and bottlenecks"
    },
    {
      step: "02",
      title: "Automation Design",
      description: "Design automated workflows and integration points with existing systems"
    },
    {
      step: "03",
      title: "Implementation",
      description: "Deploy automation solutions with proper testing and validation"
    },
    {
      step: "04",
      title: "Optimization",
      description: "Monitor performance and continuously improve automated processes"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Process Automation - Skyfalke</title>
        <meta name="description" content="Streamline your business operations with intelligent process automation solutions. Reduce manual work, improve efficiency, and scale your business with RPA and workflow automation." />
        <meta name="keywords" content="process automation, RPA, workflow automation, business efficiency, robotic process automation, process optimization" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Process Automation and workflow optimization"
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
                Process Automation
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Streamline your business operations with intelligent automation solutions
              </p>
              <Link href="/schedule-consultation?service=Process Automation">
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
              Automation Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive process automation tools to optimize your business operations
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
              Our Automation Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end process automation services to transform your business operations
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
              Benefits of Process Automation
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Transform your business with intelligent automation solutions
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
              Our Automation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to implementing process automation in your business
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
              Ready to Automate Your Processes?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Get started with our process automation solutions to streamline your business operations
            </p>
            <Link href="/schedule-consultation?service=Process Automation">
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

export default ProcessAutomation;

