'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaDesktop, 
  FaMobile, 
  FaTablet, 
  FaEye, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaCrosshairs,
  FaBullhorn,
  FaGlobe,
  FaCog,
  FaHandshake,
  FaStar,
  FaRocket,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaPalette,
  FaPencilAlt,
  FaMousePointer
} from 'react-icons/fa';

const UIUXDesign = () => {
  const features = [
    {
      icon: FaDesktop,
      title: "User-Centered Design",
      description: "Create intuitive and engaging user experiences that prioritize user needs and behaviors."
    },
    {
      icon: FaCrosshairs,
      title: "User Research",
      description: "Conduct comprehensive user research to understand your audience and their needs."
    },
    {
      icon: FaChartLine,
      title: "Usability Testing",
      description: "Test and optimize designs through user testing to ensure maximum usability and satisfaction."
    },
    {
      icon: FaEye,
      title: "Visual Design",
      description: "Create beautiful and functional visual designs that enhance user experience and brand perception."
    },
    {
      icon: FaRocket,
      title: "Responsive Design",
      description: "Design interfaces that work seamlessly across all devices and screen sizes."
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Improved User Experience",
      description: "Enhance user satisfaction and engagement through intuitive and user-friendly design."
    },
    {
      icon: FaChartLine,
      title: "Increased Conversions",
      description: "Boost conversion rates and user engagement through optimized user experience design."
    },
    {
      icon: FaCrosshairs,
      title: "Reduced User Friction",
      description: "Minimize user frustration and abandonment through streamlined user journeys."
    },
    {
      icon: FaLightbulb,
      title: "Competitive Advantage",
      description: "Gain a competitive edge with superior user experience and interface design."
    }
  ];

  const services = [
    {
      title: "User Interface Design",
      description: "Create visually appealing and functional interfaces that enhance user experience.",
      icon: FaPalette
    },
    {
      title: "User Experience Design",
      description: "Design intuitive user journeys and experiences that meet user needs and goals.",
      icon: FaMousePointer
    },
    {
      title: "Wireframing & Prototyping",
      description: "Develop wireframes and interactive prototypes to visualize and test design concepts.",
      icon: FaPencilAlt
    },
    {
      title: "Usability Testing",
      description: "Conduct user testing to validate designs and identify improvement opportunities.",
      icon: FaUsers
    }
  ];

  const strategies = [
    {
      title: "User Research & Analysis",
      description: "Understand your users through research, interviews, and behavioral analysis.",
      icon: FaCrosshairs
    },
    {
      title: "Information Architecture",
      description: "Organize content and functionality in a logical and user-friendly structure.",
      icon: FaCog
    },
    {
      title: "Interaction Design",
      description: "Design intuitive interactions and user flows that guide users toward their goals.",
      icon: FaMousePointer
    },
    {
      title: "Visual Design",
      description: "Create visually appealing designs that enhance usability and brand perception.",
      icon: FaPalette
    }
  ];

  const process = [
    {
      step: "01",
      title: "User Research",
      description: "Conduct user research to understand your target audience, their needs, and behaviors."
    },
    {
      step: "02",
      title: "Information Architecture",
      description: "Organize content and functionality in a logical and user-friendly structure."
    },
    {
      step: "03",
      title: "Wireframing & Prototyping",
      description: "Create wireframes and interactive prototypes to visualize design concepts."
    },
    {
      step: "04",
      title: "Testing & Iteration",
      description: "Test designs with users and iterate based on feedback to optimize user experience."
    }
  ];

  return (
    <>
      <Helmet>
        <title>UI/UX Design Services | Skyfalke</title>
        <meta name="description" content="Create exceptional user experiences with our comprehensive UI/UX design services. Enhance usability, increase conversions, and delight your users." />
        <meta name="keywords" content="UI/UX design, user experience, user interface, usability testing, wireframing, prototyping, user research, responsive design" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="UI/UX Design and user experience"
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
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                UI/UX Design
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Create exceptional user experiences that delight users and drive business results
              </p>
              <Link href="/schedule-consultation?service=UI/UX Design">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-colors"
                >
                  Get Started Today
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Floating Elements */}
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive UI/UX Design Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our UI/UX design services help you create exceptional user experiences that drive engagement and conversions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-500 text-4xl mb-4">
                  <feature.icon />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
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
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our UI/UX Design Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From user research to final design implementation, we provide end-to-end UI/UX design solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="text-primary-500 text-4xl mb-4">
                  <service.icon />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
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

      {/* Strategies Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              UI/UX Design Strategies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement proven strategies to create exceptional user experiences and interfaces.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {strategies.map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl shadow-lg"
              >
                <div className="text-primary-500 text-4xl mb-4">
                  <strategy.icon />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {strategy.title}
                </h3>
                <p className="text-gray-600">
                  {strategy.description}
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
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our UI/UX Design?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of exceptional user experience and interface design.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="text-primary-500 text-3xl mt-1">
                  <benefit.icon />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
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
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our UI/UX Design Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a strategic approach to ensure effective UI/UX design and user experience optimization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
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
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Exceptional UX?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Start your journey towards exceptional user experiences that delight users and drive results.
            </p>
            <Link href="/schedule-consultation?service=UI/UX Design">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary-500 text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-colors mr-4"
              >
                Schedule Consultation
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default UIUXDesign;
