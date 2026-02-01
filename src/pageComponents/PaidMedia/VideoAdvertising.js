'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaPlay, 
  FaVideo, 
  FaYoutube, 
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
  FaFilm,
  FaMobile
} from 'react-icons/fa';

const VideoAdvertising = () => {
  const features = [
    {
      icon: FaVideo,
      title: "Multi-Platform Video",
      description: "Reach your audience across YouTube, social media, and streaming platforms with engaging video ads."
    },
    {
      icon: FaCrosshairs,
      title: "Precise Targeting",
      description: "Target your ideal audience with demographic, interest, and behavior-based video advertising."
    },
    {
      icon: FaChartLine,
      title: "Performance Tracking",
      description: "Track views, engagement, and conversions with comprehensive video advertising analytics."
    },
    {
      icon: FaEye,
      title: "High Engagement",
      description: "Capture attention and drive engagement with compelling video content and storytelling."
    },
    {
      icon: FaRocket,
      title: "Scalable Reach",
      description: "Scale your video campaigns to reach millions of viewers across multiple platforms."
    }
  ];

  const benefits = [
    {
      icon: FaYoutube,
      title: "Massive Reach",
      description: "Reach billions of viewers across YouTube, social media, and streaming platforms."
    },
    {
      icon: FaChartLine,
      title: "Measurable Results",
      description: "Track video views, watch time, engagement, and conversions with detailed analytics."
    },
    {
      icon: FaCrosshairs,
      title: "Targeted Advertising",
      description: "Reach your ideal audience with precise targeting based on viewing habits and interests."
    },
    {
      icon: FaLightbulb,
      title: "High Engagement",
      description: "Drive higher engagement rates with compelling video content and storytelling."
    }
  ];

  const services = [
    {
      title: "YouTube Advertising",
      description: "Create and manage YouTube video ads to reach millions of viewers on the world's largest video platform.",
      icon: FaYoutube
    },
    {
      title: "Social Media Video Ads",
      description: "Create engaging video ads for Facebook, Instagram, TikTok, and other social media platforms.",
      icon: FaVideo
    },
    {
      title: "Streaming Platform Ads",
      description: "Reach cord-cutters and streaming audiences with ads on platforms like Hulu, Roku, and more.",
      icon: FaPlay
    },
    {
      title: "Video Production",
      description: "Create professional video content that captivates your audience and drives conversions.",
      icon: FaFilm
    }
  ];

  const strategies = [
    {
      title: "Audience Targeting",
      description: "Identify and target your ideal audience with advanced video advertising targeting options.",
      icon: FaCrosshairs
    },
    {
      title: "Creative Development",
      description: "Create compelling video content that captures attention and drives engagement.",
      icon: FaFilm
    },
    {
      title: "Platform Optimization",
      description: "Optimize video campaigns for different platforms and audience behaviors.",
      icon: FaGlobe
    },
    {
      title: "Performance Analysis",
      description: "Analyze video performance metrics to optimize for better results and ROI.",
      icon: FaChartLine
    }
  ];

  const process = [
    {
      step: "01",
      title: "Video Strategy",
      description: "Develop comprehensive video advertising strategies aligned with your business goals."
    },
    {
      step: "02",
      title: "Content Creation",
      description: "Create compelling video content that resonates with your target audience."
    },
    {
      step: "03",
      title: "Campaign Launch",
      description: "Launch optimized video advertising campaigns across multiple platforms."
    },
    {
      step: "04",
      title: "Performance Optimization",
      description: "Monitor performance and optimize campaigns for better engagement and conversions."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Video Advertising Services | Skyfalke</title>
        <meta name="description" content="Reach millions of viewers with our comprehensive video advertising services. Drive engagement, increase brand awareness, and boost conversions with strategic video campaigns." />
        <meta name="keywords" content="video advertising, YouTube ads, social media video, streaming ads, video marketing, digital video advertising" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Video Advertising and digital marketing"
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
                Video Advertising
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Reach millions of viewers with engaging video content and strategic advertising campaigns
              </p>
              <Link href="/schedule-consultation?service=Video Advertising">
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
              Comprehensive Video Advertising
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our video advertising services help you reach your audience, build brand awareness, and drive conversions.
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
              Our Video Advertising Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From YouTube ads to social media video, we provide comprehensive video advertising solutions.
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
              Video Advertising Strategies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement proven strategies to maximize your video advertising performance and engagement.
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
              Why Choose Our Video Advertising?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of strategic video advertising and audience engagement.
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
              Our Video Advertising Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a strategic approach to ensure effective video advertising and audience engagement.
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
              Ready to Dominate Video Advertising?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Start your journey towards increased engagement, brand awareness, and conversions with video advertising.
            </p>
            <Link href="/schedule-consultation?service=Video Advertising">
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

export default VideoAdvertising;
