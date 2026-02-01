'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaInstagram, 
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
  FaStar,
  FaChartLine
} from 'react-icons/fa';

const InfluencerMarketing = () => {
  const features = [
    {
      icon: FaInstagram,
      title: "Influencer Discovery",
      description: "Find the perfect influencers who align with your brand values and target audience."
    },
    {
      icon: FaStar,
      title: "Campaign Strategy",
      description: "Develop comprehensive influencer marketing strategies that drive engagement and conversions."
    },
    {
      icon: FaHandshake,
      title: "Partnership Management",
      description: "Manage influencer relationships and ensure successful campaign execution and delivery."
    },
    {
      icon: FaChartLine,
      title: "Performance Analytics",
      description: "Track campaign performance, measure ROI, and optimize strategies for better results."
    },
    {
      icon: FaUsers,
      title: "Authentic Content",
      description: "Create authentic, engaging content that resonates with your target audience."
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Increased Brand Awareness",
      description: "Reach new audiences and increase brand visibility through trusted influencer partnerships."
    },
    {
      icon: FaRocket,
      title: "Higher Engagement Rates",
      description: "Achieve better engagement rates through authentic influencer content and recommendations."
    },
    {
      icon: FaShieldAlt,
      title: "Trusted Recommendations",
      description: "Leverage influencer credibility to build trust and credibility with potential customers."
    },
    {
      icon: FaLightbulb,
      title: "Targeted Reach",
      description: "Reach specific demographics and niche audiences through strategic influencer selection."
    }
  ];

  const services = [
    {
      title: "Influencer Research & Discovery",
      description: "Identify and vet influencers who align with your brand values and target audience demographics.",
      icon: FaInstagram
    },
    {
      title: "Campaign Strategy & Planning",
      description: "Develop comprehensive influencer marketing strategies tailored to your business objectives.",
      icon: FaStar
    },
    {
      title: "Content Creation & Management",
      description: "Collaborate with influencers to create authentic, engaging content that drives results.",
      icon: FaHandshake
    },
    {
      title: "Performance Tracking & Analytics",
      description: "Monitor campaign performance, measure ROI, and provide detailed reporting and insights.",
      icon: FaChartLine
    }
  ];

  const process = [
    {
      step: "01",
      title: "Strategy Development",
      description: "Define campaign objectives, target audience, and key performance indicators."
    },
    {
      step: "02",
      title: "Influencer Selection",
      description: "Research and identify influencers who align with your brand and target audience."
    },
    {
      step: "03",
      title: "Campaign Execution",
      description: "Manage influencer partnerships and ensure successful content creation and delivery."
    },
    {
      step: "04",
      title: "Analysis & Optimization",
      description: "Track performance metrics, analyze results, and optimize campaigns for better ROI."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Influencer Marketing Services | Skyfalke</title>
        <meta name="description" content="Connect with the right influencers to amplify your brand message and reach new audiences. Strategic influencer partnerships that drive engagement and conversions." />
        <meta name="keywords" content="influencer marketing, social media influencers, brand partnerships, influencer campaigns, social media marketing" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Influencer Marketing and social media partnerships"
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
                Influencer Marketing
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Connect with the right influencers to amplify your brand message and reach new audiences
              </p>
              <Link href="/schedule-consultation?service=Influencer Marketing">
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
              Comprehensive Influencer Marketing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our influencer marketing solutions help you build authentic partnerships and drive meaningful engagement.
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
              Our Influencer Marketing Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From influencer discovery to campaign management, we provide end-to-end influencer marketing solutions.
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

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Influencer Marketing?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of strategic influencer partnerships and authentic brand collaborations.
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
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Influencer Marketing Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a strategic approach to ensure successful influencer partnerships and campaign execution.
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
              Ready to Amplify Your Brand?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Start your journey towards successful influencer partnerships and increased brand awareness.
            </p>
            <Link href="/schedule-consultation?service=Influencer Marketing">
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

export default InfluencerMarketing;
