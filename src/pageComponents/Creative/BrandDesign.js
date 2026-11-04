'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaPalette, 
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
  FaPaintBrush,
  FaPencilAlt,
  FaCamera
} from 'react-icons/fa';

const BrandDesign = () => {
  const features = [
    {
      icon: FaPalette,
      title: "Visual Identity Design",
      description: "Create a cohesive visual identity that reflects your brand's values and resonates with your target audience."
    },
    {
      icon: FaCrosshairs,
      title: "Brand Strategy",
      description: "Develop comprehensive brand strategies that position your business for success in the market."
    },
    {
      icon: FaChartLine,
      title: "Brand Consistency",
      description: "Ensure consistent brand representation across all touchpoints and marketing materials."
    },
    {
      icon: FaEye,
      title: "Brand Recognition",
      description: "Build strong brand recognition and recall through strategic design and messaging."
    },
    {
      icon: FaRocket,
      title: "Brand Evolution",
      description: "Guide your brand's evolution and growth with strategic design and positioning."
    }
  ];

  const benefits = [
    {
      icon: FaStar,
      title: "Professional Image",
      description: "Establish a professional and trustworthy image that builds customer confidence and loyalty."
    },
    {
      icon: FaChartLine,
      title: "Market Differentiation",
      description: "Stand out from competitors with unique and memorable brand design that captures attention."
    },
    {
      icon: FaCrosshairs,
      title: "Target Audience Connection",
      description: "Connect with your target audience through design that speaks to their values and preferences."
    },
    {
      icon: FaLightbulb,
      title: "Brand Loyalty",
      description: "Build strong brand loyalty through consistent and appealing visual communication."
    }
  ];

  const services = [
    {
      title: "Logo Design",
      description: "Create memorable and versatile logos that represent your brand's identity and values.",
      icon: FaPaintBrush
    },
    {
      title: "Brand Guidelines",
      description: "Develop comprehensive brand guidelines to ensure consistent brand representation.",
      icon: FaPencilAlt
    },
    {
      title: "Visual Identity Systems",
      description: "Design complete visual identity systems including colors, typography, and imagery.",
      icon: FaPalette
    },
    {
      title: "Brand Collateral",
      description: "Create business cards, letterheads, and other essential brand materials.",
      icon: FaCamera
    }
  ];

  const strategies = [
    {
      title: "Brand Research & Analysis",
      description: "Conduct thorough research to understand your market, competitors, and target audience.",
      icon: FaCrosshairs
    },
    {
      title: "Visual Identity Development",
      description: "Develop a unique visual identity that reflects your brand's personality and values.",
      icon: FaPalette
    },
    {
      title: "Brand Positioning",
      description: "Position your brand strategically in the market to maximize impact and recognition.",
      icon: FaBullhorn
    },
    {
      title: "Implementation Strategy",
      description: "Create comprehensive implementation strategies for consistent brand application.",
      icon: FaCog
    }
  ];

  const process = [
    {
      step: "01",
      title: "Brand Discovery",
      description: "Understand your business, values, goals, and target audience through comprehensive research."
    },
    {
      step: "02",
      title: "Strategy Development",
      description: "Develop brand strategy, positioning, and visual identity concepts based on research insights."
    },
    {
      step: "03",
      title: "Design Creation",
      description: "Create logo designs, color palettes, typography, and visual elements that reflect your brand."
    },
    {
      step: "04",
      title: "Implementation & Guidelines",
      description: "Develop brand guidelines and implement the new brand identity across all touchpoints."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Brand Design Services | Skyfalke</title>
        <meta name="description" content="Create a powerful and memorable brand identity with our comprehensive brand design services. Stand out from competitors and build lasting customer relationships." />
        <meta name="keywords" content="brand design, logo design, visual identity, brand strategy, brand guidelines, brand positioning, graphic design" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80" 
            alt="Brand Design and visual identity"
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left text-white"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Brand Design
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100">
                Create a powerful and memorable brand identity that stands out and connects with your audience
              </p>
              <Link href="/schedule-consultation?service=Brand Design">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-secondary-400 transition-colors"
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
              className="relative hidden lg:block"
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
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Comprehensive Brand Design Solutions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our brand design services help you create a powerful and memorable brand identity that resonates with your audience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-6 sm:p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-500 text-3xl sm:text-4xl mb-3 sm:mb-4">
                  <feature.icon />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
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
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Brand Design Services
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From logo design to complete brand identity systems, we provide comprehensive brand design solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
              >
                <div className="text-primary-500 text-3xl sm:text-4xl mb-3 sm:mb-4">
                  <service.icon />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
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
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Brand Design Strategies
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We implement proven strategies to create powerful and memorable brand identities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {strategies.map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg"
              >
                <div className="text-primary-500 text-3xl sm:text-4xl mb-3 sm:mb-4">
                  <strategy.icon />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {strategy.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
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
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose Our Brand Design?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience the benefits of strategic brand design and visual identity development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-3 sm:space-x-4"
              >
                <div className="text-primary-500 text-2xl sm:text-3xl mt-1 flex-shrink-0">
                  <benefit.icon />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
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
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Brand Design Process
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We follow a strategic approach to ensure effective brand design and identity development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mx-auto mb-4 sm:mb-6">
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Build Your Brand?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-100 max-w-3xl mx-auto px-4">
              Start your journey towards a powerful and memorable brand identity that connects with your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/schedule-consultation?service=Brand Design">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:bg-secondary-400 transition-colors"
                >
                  Schedule Consultation
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:bg-white hover:text-primary-600 transition-colors"
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

export default BrandDesign;
