'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaFacebook, 
  FaUsers, 
  FaRocket, 
  FaShieldAlt, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaMicrophone,
  FaBullhorn,
  FaEye,
  FaCog,
  FaGlobe,
  FaHandshake,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaChartLine
} from 'react-icons/fa';

const SocialMediaManagement = () => {
  const features = [
    {
      icon: FaFacebook,
      title: "Multi-Platform Management",
      description: "Manage all your social media platforms from one centralized dashboard for maximum efficiency."
    },
    {
      icon: FaInstagram,
      title: "Content Creation",
      description: "Create engaging, platform-specific content that resonates with your target audience."
    },
    {
      icon: FaChartLine,
      title: "Performance Analytics",
      description: "Track engagement, reach, and conversion metrics to optimize your social media strategy."
    },
    {
      icon: FaUsers,
      title: "Community Management",
      description: "Build and nurture your online community through active engagement and responsive communication."
    },
    {
      icon: FaRocket,
      title: "Growth Strategies",
      description: "Implement proven strategies to grow your social media following and increase brand awareness."
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Increased Brand Visibility",
      description: "Expand your brand's reach and visibility across multiple social media platforms."
    },
    {
      icon: FaRocket,
      title: "Higher Engagement Rates",
      description: "Achieve better engagement rates through strategic content and community management."
    },
    {
      icon: FaShieldAlt,
      title: "Consistent Brand Voice",
      description: "Maintain a consistent brand voice and messaging across all social media channels."
    },
    {
      icon: FaLightbulb,
      title: "Data-Driven Insights",
      description: "Make informed decisions based on comprehensive social media analytics and performance data."
    }
  ];

  const services = [
    {
      title: "Social Media Strategy",
      description: "Develop comprehensive social media strategies tailored to your business objectives and target audience.",
      icon: FaFacebook
    },
    {
      title: "Content Creation & Curation",
      description: "Create engaging, platform-specific content and curate relevant content for your audience.",
      icon: FaInstagram
    },
    {
      title: "Community Management",
      description: "Actively engage with your audience, respond to comments, and build meaningful relationships.",
      icon: FaUsers
    },
    {
      title: "Performance Analytics & Reporting",
      description: "Track key metrics, analyze performance, and provide detailed reports on social media ROI.",
      icon: FaChartLine
    }
  ];

  const platforms = [
    {
      title: "Facebook",
      description: "Build brand awareness and engage with your audience through Facebook pages and groups.",
      icon: FaFacebook
    },
    {
      title: "Instagram",
      description: "Showcase your products and services through visually appealing content and stories.",
      icon: FaInstagram
    },
    {
      title: "Twitter",
      description: "Share real-time updates, engage in conversations, and build thought leadership.",
      icon: FaTwitter
    },
    {
      title: "LinkedIn",
      description: "Establish professional credibility and connect with industry leaders and potential clients.",
      icon: FaLinkedin
    }
  ];

  const process = [
    {
      step: "01",
      title: "Strategy Development",
      description: "Define social media goals, target audience, and key performance indicators."
    },
    {
      step: "02",
      title: "Content Planning",
      description: "Create content calendars and develop engaging content for each platform."
    },
    {
      step: "03",
      title: "Community Engagement",
      description: "Actively manage and engage with your social media community."
    },
    {
      step: "04",
      title: "Analysis & Optimization",
      description: "Track performance metrics and optimize strategies for better results."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Social Media Management Services | Skyfalke</title>
        <meta name="description" content="Manage your social media presence effectively with our comprehensive social media management services. Build engagement, grow your audience, and drive results." />
        <meta name="keywords" content="social media management, social media marketing, content creation, community management, social media strategy" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Social Media Management and digital engagement"
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
                Social Media Management
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Manage your social media presence effectively and build meaningful connections with your audience
              </p>
              <Link href="/schedule-consultation?service=Social Media Management">
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
              Comprehensive Social Media Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our social media management solutions help you build engagement, grow your audience, and drive results.
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
              Our Social Media Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From strategy development to community management, we provide end-to-end social media solutions.
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

      {/* Platforms Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Social Media Platforms We Manage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We manage all major social media platforms to maximize your brand's online presence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl shadow-lg"
              >
                <div className="text-primary-500 text-4xl mb-4">
                  <platform.icon />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {platform.title}
                </h3>
                <p className="text-gray-600">
                  {platform.description}
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
              Why Choose Our Social Media Management?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of professional social media management and audience engagement.
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
              Our Social Media Management Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a strategic approach to ensure effective social media management and audience engagement.
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
              Ready to Transform Your Social Media?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Start your journey towards effective social media management and audience engagement.
            </p>
            <Link href="/schedule-consultation?service=Social Media Management">
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

export default SocialMediaManagement;
