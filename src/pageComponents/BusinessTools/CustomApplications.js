'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaCode, 
  FaDesktop, 
  FaMobile, 
  FaCloud,
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaShieldAlt,
  FaCogs,
  FaCheckCircle
} from 'react-icons/fa';

const CustomApplications = () => {
  const features = [
    {
      icon: <FaCode className="text-3xl text-secondary-500" />,
      title: "Custom Development",
      description: "Tailored software solutions designed specifically for your business needs and workflows"
    },
    {
      icon: <FaDesktop className="text-3xl text-secondary-500" />,
      title: "Web Applications",
      description: "Modern web applications with responsive design and intuitive user interfaces"
    },
    {
      icon: <FaMobile className="text-3xl text-secondary-500" />,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications for iOS and Android devices"
    },
    {
      icon: <FaCloud className="text-3xl text-secondary-500" />,
      title: "Cloud Solutions",
      description: "Scalable cloud-based applications with secure data storage and processing"
    }
  ];

  const services = [
    {
      icon: <FaRocket className="text-2xl text-accent-500" />,
      title: "Requirements Analysis",
      description: "Thorough analysis of your business requirements to design optimal solutions"
    },
    {
      icon: <FaLightbulb className="text-2xl text-accent-500" />,
      title: "Custom Design",
      description: "User-centered design approach to create intuitive and efficient applications"
    },
    {
      icon: <FaUsers className="text-2xl text-accent-500" />,
      title: "User Experience",
      description: "Focus on creating seamless user experiences that drive adoption and satisfaction"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-accent-500" />,
      title: "Security & Compliance",
      description: "Built-in security measures and compliance with industry standards"
    },
    {
      icon: <FaCogs className="text-2xl text-accent-500" />,
      title: "Integration Services",
      description: "Seamless integration with existing systems and third-party applications"
    },
    {
      icon: <FaCheckCircle className="text-2xl text-accent-500" />,
      title: "Quality Assurance",
      description: "Comprehensive testing and quality assurance to ensure reliable performance"
    }
  ];

  const benefits = [
    "Streamlined business processes",
    "Improved operational efficiency",
    "Enhanced user experience",
    "Competitive advantage",
    "Scalable and flexible solutions",
    "Reduced operational costs"
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "Understand your business needs and plan the optimal solution architecture"
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description: "Create detailed designs and interactive prototypes for user validation"
    },
    {
      step: "03",
      title: "Development",
      description: "Build the application using modern technologies and best practices"
    },
    {
      step: "04",
      title: "Testing & Deployment",
      description: "Thorough testing and smooth deployment with ongoing support"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Custom Applications - Skyfalke</title>
        <meta name="description" content="Build custom software applications tailored to your business needs. From web apps to mobile solutions, we create scalable and efficient applications that drive your business forward." />
        <meta name="keywords" content="custom applications, software development, web applications, mobile apps, business software, custom software solutions" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80"
            alt="Custom Applications and software development"
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
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Custom Applications
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto leading-relaxed">
              Build enterprise-grade software solutions tailored to your unique workflows. From web apps to mobile platforms, we deliver scalable applications that reduce operational costs by 40%+ and accelerate time-to-market.
            </p>
            <Link href="/schedule-consultation?service=Custom Applications">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              Application Solutions
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From responsive web platforms to native mobile apps, we build applications that scale with your business and integrate seamlessly with your existing infrastructure.
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
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-primary-800 mb-4">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              Our Development Services
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine technical expertise with business acumen to deliver applications that solve real problems and drive measurable results.
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
                className="bg-gray-50 p-8 rounded-2xl hover:bg-secondary-50 transition-all transform hover:-translate-y-2"
              >
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-primary-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Benefits of Custom Applications
            </h2>
            <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Experience the competitive advantage that comes with software built specifically for your business needs
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
                className="flex items-center space-x-4 bg-white/10 rounded-xl p-6 backdrop-blur-sm"
              >
                <div className="w-3 h-3 bg-secondary-500 rounded-full flex-shrink-0"></div>
                <span className="text-lg leading-relaxed">{benefit}</span>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              Our Development Process
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A proven methodology that ensures quality, efficiency, and alignment with your business objectives
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
                className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-20 h-20 bg-secondary-500 text-primary-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-primary-800 mb-4">
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
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Custom Application?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Let's discuss how a custom application can streamline your operations, reduce costs, and give you a competitive edge in your market.
            </p>
            <Link href="/schedule-consultation?service=Custom Applications">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

export default CustomApplications;
