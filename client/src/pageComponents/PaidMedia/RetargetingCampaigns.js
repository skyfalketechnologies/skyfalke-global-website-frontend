'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaRecycle, 
  FaCrosshairs, 
  FaChartLine, 
  FaEye, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaBullhorn,
  FaGlobe,
  FaCog,
  FaHandshake,
  FaStar,
  FaRocket,
  FaUsers,
  FaShieldAlt,
  FaCookie,
  FaMousePointer
} from 'react-icons/fa';

const RetargetingCampaigns = () => {
  const features = [
    {
      icon: FaRecycle,
      title: "Smart Retargeting",
      description: "Re-engage visitors who have shown interest in your products or services with intelligent retargeting campaigns."
    },
    {
      icon: FaCrosshairs,
      title: "Precise Audience Segmentation",
      description: "Segment your audience based on their behavior and create personalized retargeting campaigns."
    },
    {
      icon: FaChartLine,
      title: "Performance Optimization",
      description: "Continuously optimize retargeting campaigns for maximum conversion rates and ROI."
    },
    {
      icon: FaEye,
      title: "Brand Recall",
      description: "Keep your brand top-of-mind with strategic retargeting that reinforces your message."
    },
    {
      icon: FaRocket,
      title: "Conversion Focused",
      description: "Drive conversions by reconnecting with prospects who are most likely to convert."
    }
  ];

  const benefits = [
    {
      icon: FaCrosshairs,
      title: "Higher Conversion Rates",
      description: "Retargeting campaigns typically achieve 2-3x higher conversion rates than standard display advertising."
    },
    {
      icon: FaChartLine,
      title: "Improved ROI",
      description: "Maximize your advertising budget by focusing on prospects who have already shown interest."
    },
    {
      icon: FaUsers,
      title: "Audience Re-engagement",
      description: "Re-engage visitors who left your site without converting and bring them back to complete their journey."
    },
    {
      icon: FaLightbulb,
      title: "Personalized Messaging",
      description: "Deliver personalized messages based on user behavior and previous interactions with your brand."
    }
  ];

  const services = [
    {
      title: "Website Retargeting",
      description: "Retarget visitors who have visited your website but haven't converted with relevant ads.",
      icon: FaGlobe
    },
    {
      title: "Email Retargeting",
      description: "Re-engage email subscribers and customers with targeted retargeting campaigns.",
      icon: FaUsers
    },
    {
      title: "Dynamic Retargeting",
      description: "Show personalized ads featuring products or services that users have viewed.",
      icon: FaStar
    },
    {
      title: "Cross-Platform Retargeting",
      description: "Reach your audience across multiple platforms and devices with coordinated retargeting campaigns.",
      icon: FaRocket
    }
  ];

  const strategies = [
    {
      title: "Audience Segmentation",
      description: "Segment your audience based on behavior, interests, and conversion likelihood for targeted campaigns.",
      icon: FaCrosshairs
    },
    {
      title: "Frequency Capping",
      description: "Control ad frequency to avoid overwhelming users while maintaining brand presence.",
      icon: FaCog
    },
    {
      title: "Creative Optimization",
      description: "Test and optimize ad creatives to maximize engagement and conversion rates.",
      icon: FaBullhorn
    },
    {
      title: "Cross-Device Tracking",
      description: "Track user behavior across devices to deliver seamless retargeting experiences.",
      icon: FaMousePointer
    }
  ];

  const process = [
    {
      step: "01",
      title: "Audience Analysis",
      description: "Analyze your website visitors and identify high-value audiences for retargeting."
    },
    {
      step: "02",
      title: "Strategy Development",
      description: "Develop comprehensive retargeting strategies based on user behavior and business goals."
    },
    {
      step: "03",
      title: "Campaign Setup",
      description: "Set up retargeting campaigns with proper audience segmentation and creative assets."
    },
    {
      step: "04",
      title: "Optimization & Scaling",
      description: "Monitor performance and optimize campaigns for better conversion rates and ROI."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Retargeting Campaign Services | Skyfalke</title>
        <meta name="description" content="Re-engage your audience and drive conversions with our comprehensive retargeting campaign services. Increase ROI and bring back interested prospects." />
        <meta name="keywords" content="retargeting campaigns, remarketing, audience re-engagement, conversion optimization, display advertising, digital marketing" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Retargeting Campaigns and digital marketing"
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
                Retargeting Campaigns
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Re-engage your audience and drive conversions with intelligent retargeting strategies
              </p>
              <Link href="/schedule-consultation?service=Retargeting Campaigns">
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
              Comprehensive Retargeting Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our retargeting campaigns help you re-engage your audience, increase conversions, and maximize your advertising ROI.
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
              Our Retargeting Campaign Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From website retargeting to cross-platform campaigns, we provide comprehensive retargeting solutions.
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
              Retargeting Campaign Strategies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement proven strategies to maximize your retargeting campaign performance and conversions.
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
              Why Choose Our Retargeting Campaigns?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of strategic retargeting and audience re-engagement.
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
              Our Retargeting Campaign Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a strategic approach to ensure effective retargeting campaigns and audience re-engagement.
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
              Ready to Re-engage Your Audience?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Start your journey towards increased conversions and ROI with strategic retargeting campaigns.
            </p>
            <Link href="/schedule-consultation?service=Retargeting Campaigns">
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

export default RetargetingCampaigns;
