'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaNewspaper, 
  FaUsers, 
  FaBullhorn, 
  FaShareAlt, 
  FaGlobe,
  FaRocket,
  FaChartLine,
  FaHeart,
  FaStar,
  FaArrowRight
} from 'react-icons/fa';

const EarnedMedia = () => {
  const services = [
    {
      icon: FaNewspaper,
      title: "Public Relations",
      description: "Build your brand reputation and credibility through strategic public relations campaigns.",
      features: [
        "Media relations and press releases",
        "Crisis communication management",
        "Brand storytelling and messaging",
        "Industry thought leadership"
      ]
    },
    {
      icon: FaUsers,
      title: "Influencer Marketing",
      description: "Leverage the power of influential voices to amplify your brand message and reach.",
      features: [
        "Influencer identification and outreach",
        "Campaign strategy and execution",
        "Content collaboration and co-creation",
        "Performance tracking and ROI measurement"
      ]
    },
    {
      icon: FaBullhorn,
      title: "Content Marketing",
      description: "Create valuable, engaging content that attracts and retains your target audience.",
      features: [
        "Content strategy development",
        "Blog writing and management",
        "Social media content creation",
        "Email marketing campaigns"
      ]
    },
    {
      icon: FaShareAlt,
      title: "Social Media Management",
      description: "Build meaningful connections with your audience through strategic social media presence.",
      features: [
        "Platform strategy and optimization",
        "Community engagement and moderation",
        "Social media advertising",
        "Analytics and performance reporting"
      ]
    },
    {
      icon: FaGlobe,
      title: "Brand Awareness",
      description: "Increase your brand visibility and recognition across multiple channels and platforms.",
      features: [
        "Brand positioning and messaging",
        "Multi-channel awareness campaigns",
        "Event marketing and sponsorships",
        "Partnership and collaboration strategies"
      ]
    }
  ];

  const benefits = [
    {
      icon: FaRocket,
      title: "Increased Brand Visibility",
      description: "Expand your reach and get your brand in front of more potential customers."
    },
    {
      icon: FaHeart,
      title: "Authentic Engagement",
      description: "Build genuine relationships with your audience through organic, earned media."
    },
    {
      icon: FaStar,
      title: "Enhanced Credibility",
      description: "Establish trust and authority in your industry through third-party validation."
    },
    {
      icon: FaChartLine,
      title: "Sustainable Growth",
      description: "Create long-term value through relationships and reputation building."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Earned Media & PR Services | Skyfalke - Build Authentic Brand Awareness & Trust</title>
        <meta name="description" content="Build authentic brand awareness and credibility with Skyfalke's earned media services. From PR to influencer marketing, we help you earn trust and recognition." />
        <meta name="keywords" content="earned media, public relations, influencer marketing, content marketing, social media management, brand awareness" />
        <meta property="og:title" content="Earned Media & PR Services | Skyfalke - Build Authentic Brand Awareness & Trust" />
        <meta property="og:description" content="Build authentic brand awareness and credibility with our earned media services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/earned-media" />
        <meta property="og:image" content="/favicon.ico" />
        <link rel="canonical" href="https://skyfalke.com/services/earned-media" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
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
                Earned Media
                <span className="block text-secondary-500 mt-3">That Builds Trust</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto mb-8 leading-relaxed">
                Cultivate authentic brand relationships through strategic PR, influencer partnerships, and content that resonates. Our earned media campaigns generate 5x more trust than paid ads and drive sustainable, long-term growth.
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
                Our Earned Media Services
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We build genuine connections through strategic storytelling, authentic partnerships, and content that your audience actually wants to engage with.
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
                Why Choose Our Earned Media?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Unlike paid advertising, earned media builds lasting credibility and trust that compounds over time, creating sustainable brand value.
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
                Ready to Build Authentic Brand Trust?
              </h2>
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Let's create an earned media strategy that builds genuine relationships, enhances credibility, and drives sustainable growth for your brand.
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

export default EarnedMedia;




