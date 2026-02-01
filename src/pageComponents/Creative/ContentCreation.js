'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaPen, 
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
  FaCamera,
  FaNewspaper,
  FaBlog
} from 'react-icons/fa';

const ContentCreation = () => {
  const features = [
    {
      icon: FaPen,
      title: "Strategic Content Creation",
      description: "Create compelling and valuable content that resonates with your audience and drives business objectives."
    },
    {
      icon: FaCrosshairs,
      title: "Audience-Focused Content",
      description: "Develop content strategies that target your ideal audience and address their specific needs and interests."
    },
    {
      icon: FaChartLine,
      title: "SEO-Optimized Content",
      description: "Create content that ranks well in search engines and drives organic traffic to your website."
    },
    {
      icon: FaEye,
      title: "Engaging Storytelling",
      description: "Craft compelling narratives that capture attention and build meaningful connections with your audience."
    },
    {
      icon: FaRocket,
      title: "Multi-Format Content",
      description: "Produce content across various formats including blogs, social media, videos, and infographics."
    }
  ];

  const benefits = [
    {
      icon: FaStar,
      title: "Increased Brand Authority",
      description: "Establish your brand as a thought leader and industry expert through valuable content creation."
    },
    {
      icon: FaChartLine,
      title: "Higher Engagement Rates",
      description: "Boost audience engagement and interaction through compelling and relevant content."
    },
    {
      icon: FaCrosshairs,
      title: "Improved SEO Performance",
      description: "Enhance your search engine rankings and drive more organic traffic with optimized content."
    },
    {
      icon: FaLightbulb,
      title: "Better Customer Relationships",
      description: "Build stronger relationships with your audience through consistent and valuable content."
    }
  ];

  const services = [
    {
      title: "Blog Content Creation",
      description: "Create engaging blog posts and articles that educate, inform, and entertain your audience.",
      icon: FaBlog
    },
    {
      title: "Social Media Content",
      description: "Develop compelling social media content that drives engagement and builds community.",
      icon: FaGlobe
    },
    {
      title: "Email Marketing Content",
      description: "Create persuasive email campaigns that nurture leads and drive conversions.",
      icon: FaNewspaper
    },
    {
      title: "Website Content",
      description: "Develop compelling website copy that converts visitors into customers.",
      icon: FaPen
    }
  ];

  const strategies = [
    {
      title: "Content Strategy Development",
      description: "Develop comprehensive content strategies that align with your business goals and target audience.",
      icon: FaCrosshairs
    },
    {
      title: "Content Planning & Calendar",
      description: "Create organized content calendars and plans to ensure consistent content delivery.",
      icon: FaCog
    },
    {
      title: "Content Optimization",
      description: "Optimize content for search engines and user engagement to maximize reach and impact.",
      icon: FaChartLine
    },
    {
      title: "Content Distribution",
      description: "Implement effective content distribution strategies across multiple platforms and channels.",
      icon: FaBullhorn
    }
  ];

  const process = [
    {
      step: "01",
      title: "Content Strategy",
      description: "Develop a comprehensive content strategy based on your business goals and audience needs."
    },
    {
      step: "02",
      title: "Content Planning",
      description: "Plan and organize your content calendar with topics, formats, and publishing schedules."
    },
    {
      step: "03",
      title: "Content Creation",
      description: "Create high-quality, engaging content that provides value to your target audience."
    },
    {
      step: "04",
      title: "Content Optimization",
      description: "Optimize and distribute your content for maximum reach, engagement, and impact."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Content Creation Services | Skyfalke</title>
        <meta name="description" content="Create compelling and valuable content with our professional content creation services. Engage your audience and drive results with strategic content marketing." />
        <meta name="keywords" content="content creation, content marketing, blog writing, social media content, email marketing, website copy, SEO content" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2028&q=80" 
            alt="Content Creation and writing"
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
                Content Creation
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Create compelling and valuable content that engages your audience and drives business results
              </p>
              <Link href="/schedule-consultation?service=Content Creation">
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
              Comprehensive Content Creation Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our content creation services help you create valuable and engaging content that drives results.
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
              Our Content Creation Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From blogs to social media, we provide comprehensive content creation solutions for all your needs.
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
              Content Creation Strategies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement proven strategies to create compelling and effective content that drives results.
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
              Why Choose Our Content Creation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of strategic content creation and compelling storytelling.
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
              Our Content Creation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a strategic approach to ensure effective content creation and audience engagement.
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
              Ready to Create Compelling Content?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Start your journey towards engaging content that captivates your audience and drives results.
            </p>
            <Link href="/schedule-consultation?service=Content Creation">
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

export default ContentCreation;
