'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaEye, 
  FaUsers, 
  FaRocket, 
  FaShieldAlt, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaMicrophone,
  FaBullhorn,
  FaGlobe,
  FaCog,
  FaHandshake,
  FaStar,
  FaChartLine,
  FaCrosshairs
} from 'react-icons/fa';

const BrandAwareness = () => {
  const features = [
    {
      icon: FaEye,
      title: "Brand Recognition",
      description: "Increase your brand's visibility and recognition across multiple channels and platforms."
    },
    {
      icon: FaCrosshairs,
      title: "Targeted Campaigns",
      description: "Develop targeted campaigns that reach your ideal audience and build brand awareness."
    },
    {
      icon: FaStar,
      title: "Brand Positioning",
      description: "Position your brand as a leader in your industry and establish thought leadership."
    },
    {
      icon: FaUsers,
      title: "Audience Engagement",
      description: "Build meaningful connections with your audience through consistent brand messaging."
    },
    {
      icon: FaRocket,
      title: "Growth Strategies",
      description: "Implement proven strategies to grow your brand presence and market share."
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Increased Market Share",
      description: "Expand your market presence and capture a larger share of your target market."
    },
    {
      icon: FaRocket,
      title: "Higher Brand Recognition",
      description: "Improve brand recall and recognition among your target audience and industry."
    },
    {
      icon: FaShieldAlt,
      title: "Competitive Advantage",
      description: "Establish a strong brand presence that differentiates you from competitors."
    },
    {
      icon: FaLightbulb,
      title: "Customer Trust & Loyalty",
      description: "Build trust and loyalty with customers through consistent brand messaging and values."
    }
  ];

  const services = [
    {
      title: "Brand Strategy Development",
      description: "Develop comprehensive brand strategies that align with your business objectives and target audience.",
      icon: FaEye
    },
    {
      title: "Multi-Channel Campaigns",
      description: "Create and execute brand awareness campaigns across multiple channels and platforms.",
      icon: FaCrosshairs
    },
    {
      title: "Content Marketing",
      description: "Create valuable content that builds brand awareness and establishes thought leadership.",
      icon: FaStar
    },
    {
      title: "Performance Tracking & Analytics",
      description: "Track brand awareness metrics and measure the effectiveness of your campaigns.",
      icon: FaChartLine
    }
  ];

  const strategies = [
    {
      title: "Content Marketing",
      description: "Create valuable, shareable content that increases brand visibility and establishes authority.",
      icon: FaStar
    },
    {
      title: "Social Media Marketing",
      description: "Leverage social media platforms to build brand awareness and engage with your audience.",
      icon: FaUsers
    },
    {
      title: "Public Relations",
      description: "Secure media coverage and build relationships with journalists to increase brand visibility.",
      icon: FaBullhorn
    },
    {
      title: "Influencer Partnerships",
      description: "Partner with influencers to reach new audiences and build brand credibility.",
      icon: FaHandshake
    }
  ];

  const process = [
    {
      step: "01",
      title: "Brand Analysis",
      description: "Analyze your current brand position, target audience, and competitive landscape."
    },
    {
      step: "02",
      title: "Strategy Development",
      description: "Develop comprehensive brand awareness strategies tailored to your business goals."
    },
    {
      step: "03",
      title: "Campaign Execution",
      description: "Execute multi-channel campaigns to increase brand visibility and recognition."
    },
    {
      step: "04",
      title: "Measurement & Optimization",
      description: "Track performance metrics and optimize strategies for better brand awareness results."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Brand Awareness Services | Skyfalke</title>
        <meta name="description" content="Increase your brand's visibility and recognition with our comprehensive brand awareness services. Build market presence, establish thought leadership, and grow your brand." />
        <meta name="keywords" content="brand awareness, brand recognition, brand visibility, brand marketing, brand strategy, market presence" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Brand Awareness and market presence building"
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
                Brand Awareness
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Increase your brand's visibility and recognition to build market presence and establish thought leadership
              </p>
              <Link href="/schedule-consultation?service=Brand Awareness">
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
              Comprehensive Brand Awareness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our brand awareness solutions help you increase visibility, build recognition, and establish market presence.
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
              Our Brand Awareness Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From strategy development to campaign execution, we provide end-to-end brand awareness solutions.
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
              Brand Awareness Strategies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement proven strategies to increase your brand's visibility and recognition.
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
              Why Choose Our Brand Awareness Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of strategic brand awareness and market presence building.
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
              Our Brand Awareness Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a strategic approach to ensure effective brand awareness and market presence building.
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
              Ready to Build Your Brand Awareness?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Start your journey towards increased brand visibility and market presence.
            </p>
            <Link href="/schedule-consultation?service=Brand Awareness">
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

export default BrandAwareness;
