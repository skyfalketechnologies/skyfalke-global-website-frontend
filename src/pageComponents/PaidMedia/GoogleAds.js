'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaGoogle, 
  FaSearch, 
  FaChartLine, 
  FaShieldAlt, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaCrosshairs,
  FaBullhorn,
  FaGlobe,
  FaCog,
  FaHandshake,
  FaStar,
  FaRocket
} from 'react-icons/fa';

const GoogleAds = () => {
  const features = [
    {
      icon: FaSearch,
      title: "Search Engine Marketing",
      description: "Dominate search results with strategic Google Ads campaigns that drive qualified traffic to your website."
    },
    {
      icon: FaCrosshairs,
      title: "Precise Targeting",
      description: "Reach your ideal audience with advanced targeting options including keywords, demographics, and interests."
    },
    {
      icon: FaChartLine,
      title: "Performance Optimization",
      description: "Continuously optimize campaigns for maximum ROI with data-driven insights and A/B testing."
    },
    {
      icon: FaShieldAlt,
      title: "Quality Score Management",
      description: "Improve your Quality Score to reduce costs and increase ad visibility in search results."
    },
    {
      icon: FaRocket,
      title: "Conversion Focused",
      description: "Drive measurable conversions with landing page optimization and conversion tracking."
    }
  ];

  const benefits = [
    {
      icon: FaGoogle,
      title: "Increased Visibility",
      description: "Appear at the top of search results and reach customers actively searching for your products or services."
    },
    {
      icon: FaChartLine,
      title: "Measurable Results",
      description: "Track every click, conversion, and dollar spent with comprehensive Google Ads analytics."
    },
    {
      icon: FaCrosshairs,
      title: "Targeted Reach",
      description: "Reach your ideal customers with precise targeting based on search intent and user behavior."
    },
    {
      icon: FaLightbulb,
      title: "Cost Control",
      description: "Set budgets and bids to control costs while maximizing your advertising ROI."
    }
  ];

  const services = [
    {
      title: "Search Network Campaigns",
      description: "Create and manage Google Search Network campaigns to capture high-intent search traffic.",
      icon: FaSearch
    },
    {
      title: "Display Network Advertising",
      description: "Expand your reach with Google Display Network campaigns across millions of websites.",
      icon: FaGlobe
    },
    {
      title: "Shopping Campaigns",
      description: "Showcase your products in Google Shopping results to drive e-commerce sales.",
      icon: FaStar
    },
    {
      title: "Performance Max Campaigns",
      description: "Leverage Google's AI to optimize across all Google properties for maximum performance.",
      icon: FaRocket
    }
  ];

  const strategies = [
    {
      title: "Keyword Research & Optimization",
      description: "Identify high-value keywords and optimize campaigns for maximum search visibility.",
      icon: FaSearch
    },
    {
      title: "Ad Copy Creation",
      description: "Create compelling ad copy that drives clicks and conversions with A/B testing.",
      icon: FaBullhorn
    },
    {
      title: "Landing Page Optimization",
      description: "Optimize landing pages to improve Quality Score and increase conversion rates.",
      icon: FaCrosshairs
    },
    {
      title: "Bid Management",
      description: "Implement strategic bidding strategies to maximize ROI and control costs.",
      icon: FaChartLine
    }
  ];

  const process = [
    {
      step: "01",
      title: "Account Audit",
      description: "Analyze your current Google Ads account and identify optimization opportunities."
    },
    {
      step: "02",
      title: "Strategy Development",
      description: "Develop comprehensive Google Ads strategies aligned with your business goals."
    },
    {
      step: "03",
      title: "Campaign Setup",
      description: "Create and launch optimized campaigns with proper targeting and ad copy."
    },
    {
      step: "04",
      title: "Ongoing Optimization",
      description: "Continuously monitor and optimize campaigns for better performance and ROI."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Google Ads Services | Skyfalke</title>
        <meta name="description" content="Maximize your ROI with our comprehensive Google Ads services. Drive qualified traffic, increase conversions, and dominate search results with strategic PPC campaigns." />
        <meta name="keywords" content="Google Ads, PPC, search engine marketing, SEM, paid search, Google advertising, digital advertising" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Google Ads and digital advertising"
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
              Google Ads Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto leading-relaxed">
              Dominate search results and drive high-quality leads with data-driven Google Ads campaigns. Our clients see average ROAS improvements of 4:1+ and cost-per-acquisition reductions of 45%+.
            </p>
            <Link href="/schedule-consultation?service=Google Ads">
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Google Ads Solutions
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our data-driven approach helps you capture high-intent searches, reduce wasted ad spend, and maximize your return on advertising investment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
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

      {/* Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Google Ads Services
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From initial setup to continuous optimization, we manage every aspect of your Google Ads campaigns for maximum performance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-secondary-500 text-4xl mb-6">
                  <service.icon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
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

      {/* Strategies Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Google Ads Strategies
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We leverage advanced techniques and continuous testing to optimize your campaigns for maximum ROI and conversion rates.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {strategies.map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-secondary-500 text-4xl mb-6">
                  <strategy.icon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {strategy.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Google Ads Services?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join hundreds of businesses that trust us to maximize their Google Ads performance and drive sustainable growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 bg-white p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-secondary-500 text-3xl mt-1 flex-shrink-0">
                  <benefit.icon />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Google Ads Process
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A systematic approach that ensures your campaigns are optimized for performance from day one.
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
                className="text-center bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="bg-secondary-500 text-primary-900 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
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
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Dominate Google Ads?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Schedule a free account audit to discover how we can reduce your cost-per-acquisition, improve Quality Scores, and maximize your advertising ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule-consultation?service=Google Ads">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Schedule Consultation
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-900 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default GoogleAds;
