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
  FaCamera,
  FaPrint,
  FaDesktop
} from 'react-icons/fa';

const GraphicDesign = () => {
  const features = [
    {
      icon: FaPalette,
      title: "Creative Design Solutions",
      description: "Create visually stunning and impactful designs that capture attention and communicate your message effectively."
    },
    {
      icon: FaCrosshairs,
      title: "Strategic Design",
      description: "Develop strategic designs that align with your brand goals and resonate with your target audience."
    },
    {
      icon: FaChartLine,
      title: "Brand Consistency",
      description: "Ensure consistent visual representation across all your marketing materials and touchpoints."
    },
    {
      icon: FaEye,
      title: "Visual Impact",
      description: "Create designs that make a lasting impression and drive engagement with your audience."
    },
    {
      icon: FaRocket,
      title: "Multi-Format Design",
      description: "Design for print, digital, and social media platforms with optimized formats and specifications."
    }
  ];

  const benefits = [
    {
      icon: FaStar,
      title: "Professional Appearance",
      description: "Establish a professional and polished image that builds trust and credibility with your audience."
    },
    {
      icon: FaChartLine,
      title: "Increased Engagement",
      description: "Boost engagement and response rates with visually appealing and compelling designs."
    },
    {
      icon: FaCrosshairs,
      title: "Brand Recognition",
      description: "Strengthen brand recognition and recall through consistent and memorable visual design."
    },
    {
      icon: FaLightbulb,
      title: "Competitive Advantage",
      description: "Stand out from competitors with unique and creative graphic design solutions."
    }
  ];

  const services = [
    {
      title: "Print Design",
      description: "Create professional print materials including brochures, flyers, business cards, and signage.",
      icon: FaPrint
    },
    {
      title: "Digital Design",
      description: "Design digital assets for websites, social media, email campaigns, and digital marketing.",
      icon: FaDesktop
    },
    {
      title: "Brand Identity Design",
      description: "Develop complete brand identity systems including logos, color palettes, and visual guidelines.",
      icon: FaPalette
    },
    {
      title: "Marketing Collateral",
      description: "Create comprehensive marketing materials that support your business objectives.",
      icon: FaBullhorn
    }
  ];

  const strategies = [
    {
      title: "Design Strategy Development",
      description: "Develop comprehensive design strategies that align with your business goals and target audience.",
      icon: FaCrosshairs
    },
    {
      title: "Creative Concept Development",
      description: "Create innovative design concepts that effectively communicate your message and brand values.",
      icon: FaLightbulb
    },
    {
      title: "Visual Branding",
      description: "Establish strong visual branding that differentiates your business and builds brand loyalty.",
      icon: FaPalette
    },
    {
      title: "Design Implementation",
      description: "Implement designs across all platforms and materials for maximum impact and consistency.",
      icon: FaCog
    }
  ];

  const process = [
    {
      step: "01",
      title: "Design Brief",
      description: "Understand your project requirements, goals, target audience, and brand guidelines."
    },
    {
      step: "02",
      title: "Concept Development",
      description: "Develop creative concepts and design directions that align with your objectives."
    },
    {
      step: "03",
      title: "Design Creation",
      description: "Create professional designs with attention to detail, typography, and visual hierarchy."
    },
    {
      step: "04",
      title: "Refinement & Delivery",
      description: "Refine designs based on feedback and deliver final files in all required formats."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Graphic Design Services | Skyfalke</title>
        <meta name="description" content="Create stunning visual designs with our comprehensive graphic design services. Enhance your brand presence and drive engagement with professional design solutions." />
        <meta name="keywords" content="graphic design, print design, digital design, brand identity, marketing collateral, visual design, creative design" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
            alt="Graphic Design and visual creativity"
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
                Graphic Design
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Create stunning visual designs that capture attention and communicate your message effectively
              </p>
              <Link href="/schedule-consultation?service=Graphic Design">
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
              Comprehensive Graphic Design Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our graphic design services help you create visually stunning and impactful designs that drive results.
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
              Our Graphic Design Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From print to digital, we provide comprehensive graphic design solutions for all your needs.
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
              Graphic Design Strategies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement proven strategies to create impactful and effective graphic designs.
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
              Why Choose Our Graphic Design?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of professional graphic design and visual communication.
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
              Our Graphic Design Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a strategic approach to ensure effective graphic design and visual communication.
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
              Ready to Create Stunning Designs?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Start your journey towards visually stunning designs that capture attention and drive results.
            </p>
            <Link href="/schedule-consultation?service=Graphic Design">
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

export default GraphicDesign;
