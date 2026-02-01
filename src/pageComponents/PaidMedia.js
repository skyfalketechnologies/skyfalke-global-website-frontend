'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaGoogle, 
  FaMobile, 
  FaImage, 
  FaVideo, 
  FaBullhorn,
  FaRocket,
  FaChartLine,
  FaCrosshairs,
  FaDollarSign,
  FaArrowRight
} from 'react-icons/fa';

const PaidMedia = () => {
  const services = [
    {
      icon: FaGoogle,
      title: "Google Ads",
      description: "Drive targeted traffic and conversions with strategic Google Ads campaigns.",
      features: [
        "Search engine marketing (SEM)",
        "Display advertising campaigns",
        "Shopping ads optimization",
        "Performance tracking and optimization"
      ]
    },
    {
      icon: FaMobile,
      title: "Social Media Ads",
      description: "Reach your audience where they spend time with engaging social media advertising.",
      features: [
        "Facebook and Instagram ads",
        "LinkedIn advertising campaigns",
        "Twitter and TikTok ads",
        "Audience targeting and retargeting"
      ]
    },
    {
      icon: FaImage,
      title: "Display Advertising",
      description: "Increase brand awareness and reach with visually compelling display ads.",
      features: [
        "Banner ad design and placement",
        "Programmatic advertising",
        "Remarketing campaigns",
        "Brand awareness campaigns"
      ]
    },
    {
      icon: FaVideo,
      title: "Video Advertising",
      description: "Engage your audience with compelling video content and advertising.",
      features: [
        "YouTube advertising campaigns",
        "Video ad production and editing",
        "In-stream and out-stream ads",
        "Video performance optimization"
      ]
    },
    {
      icon: FaBullhorn,
      title: "Retargeting Campaigns",
      description: "Re-engage potential customers and increase conversion rates with smart retargeting.",
      features: [
        "Cross-platform retargeting",
        "Dynamic remarketing ads",
        "Abandoned cart campaigns",
        "Customer lifetime value optimization"
      ]
    }
  ];

  const benefits = [
    {
      icon: FaCrosshairs,
      title: "Precise Targeting",
      description: "Reach the right audience at the right time with advanced targeting capabilities."
    },
    {
      icon: FaChartLine,
      title: "Measurable Results",
      description: "Track performance and ROI with comprehensive analytics and reporting."
    },
    {
      icon: FaRocket,
      title: "Quick Results",
      description: "See immediate impact and results from your advertising investments."
    },
    {
      icon: FaDollarSign,
      title: "Scalable Growth",
      description: "Scale your campaigns up or down based on performance and budget."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Paid Media & Digital Advertising Services | Skyfalke - Drive ROI with Strategic Campaigns</title>
        <meta name="description" content="Drive targeted traffic and conversions with Skyfalke's paid media services. From Google Ads to social media advertising, we maximize your ROI." />
        <meta name="keywords" content="paid media, Google Ads, social media advertising, display advertising, video advertising, retargeting campaigns" />
        <meta property="og:title" content="Paid Media & Digital Advertising Services | Skyfalke - Drive ROI with Strategic Campaigns" />
        <meta property="og:description" content="Drive targeted traffic and conversions with our paid media services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/paid-media" />
        <meta property="og:image" content="/favicon.ico" />
        <link rel="canonical" href="https://skyfalke.com/services/paid-media" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/95 to-primary-800/95"></div>
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Paid Media
                <span className="block text-secondary-500 mt-3">That Delivers ROI</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto mb-8 leading-relaxed">
                Maximize your advertising investment with data-driven campaigns across Google, social media, and display networks. Our clients see average ROAS improvements of 3:1+ and cost-per-acquisition reductions of 35%+.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-secondary-500 hover:bg-secondary-400 text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Get Started Today
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                  View Case Studies
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Paid Media Services
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From search engine marketing to programmatic display, we manage campaigns that reach the right audience at the perfect moment.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
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
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our Paid Media?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We combine strategic planning with continuous optimization to ensure every advertising dollar works harder for your business.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4 bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-14 h-14 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
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
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to Maximize Your Advertising ROI?
              </h2>
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Schedule a free audit to discover how our paid media strategies can reduce costs, increase conversions, and accelerate your growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-secondary-500 text-primary-900 hover:bg-secondary-400 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1">
                  <span>Get Free Consultation</span>
                  <FaArrowRight className="ml-2" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                  View Our Portfolio
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PaidMedia;
