'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaBrain, 
  FaCogs, 
  FaShieldAlt, 
  FaChartLine, 
  FaUsers, 
  FaRocket,
  FaCheck,
  FaArrowRight,
  FaLightbulb,
  FaGlobe,
  FaFileAlt,
  FaHandshake,
  FaAward,
  FaClock,
  FaBullseye,
  FaNetworkWired,
  FaDatabase,
  FaLock,
  FaEye,
  FaCog,
  FaClipboardCheck
} from 'react-icons/fa';

const ICTStrategy = () => {
  const approachSteps = [
    {
      icon: FaBullseye,
      title: "Needs Assessment",
      description: "Comprehensive analysis of your current ICT infrastructure, AI readiness, and strategic objectives to identify opportunities and challenges.",
      features: [
        "Current state analysis",
        "Technology gap assessment", 
        "Stakeholder interviews",
        "Compliance requirements review"
      ]
    },
    {
      icon: FaFileAlt,
      title: "Policy Framework Design",
      description: "Development of comprehensive ICT and AI policies aligned with international standards and best practices.",
      features: [
        "AI governance frameworks",
        "Data protection policies",
        "Ethical AI guidelines",
        "Risk management protocols"
      ]
    },
    {
      icon: FaRocket,
      title: "Implementation Roadmap",
      description: "Detailed strategic roadmap with clear milestones, timelines, and resource allocation for successful policy implementation.",
      features: [
        "Phased implementation plan",
        "Resource allocation strategy",
        "Change management approach",
        "Success metrics definition"
      ]
    },
    {
      icon: FaEye,
      title: "Monitoring & Governance",
      description: "Ongoing monitoring, evaluation, and governance mechanisms to ensure policy effectiveness and continuous improvement.",
      features: [
        "Performance monitoring",
        "Regular policy reviews",
        "Compliance auditing",
        "Continuous improvement"
      ]
    }
  ];

  const trustFactors = [
    {
      icon: FaUsers,
      title: "Experienced ICT & AI Consultants",
      description: "Our team brings deep expertise in ICT strategy development and AI policy formulation across various industries."
    },
    {
      icon: FaShieldAlt,
      title: "Global Standards Compliance",
      description: "We ensure your policies align with international standards including ISO, GDPR, AI ethics frameworks, and industry best practices."
    },
    {
      icon: FaHandshake,
      title: "Public & Private Sector Experience",
      description: "Proven track record in developing strategies for both government agencies and private enterprises across diverse sectors."
    },
    {
      icon: FaChartLine,
      title: "Data-Driven Decision Frameworks",
      description: "Our approach is grounded in data analytics and evidence-based policy development for measurable outcomes."
    }
  ];

  const caseStudies = [
    {
      title: "Government Digital Transformation",
      description: "Developed comprehensive ICT strategy for a national government agency, resulting in 40% efficiency improvement and enhanced citizen services.",
      results: ["40% efficiency gain", "Enhanced citizen services", "Reduced operational costs"],
      sector: "Public Sector"
    },
    {
      title: "Financial Services AI Policy",
      description: "Created AI governance framework for a leading financial institution, ensuring compliance with regulatory requirements and ethical AI deployment.",
      results: ["100% regulatory compliance", "Ethical AI deployment", "Risk mitigation"],
      sector: "Financial Services"
    },
    {
      title: "Healthcare ICT Modernization",
      description: "Designed ICT strategy for a healthcare network, improving patient data management and implementing secure AI-powered diagnostic tools.",
      results: ["Improved patient outcomes", "Enhanced data security", "Streamlined operations"],
      sector: "Healthcare"
    }
  ];

  const services = [
    {
      icon: FaBrain,
      title: "AI Strategy Development",
      description: "Comprehensive AI strategy formulation including governance, ethics, and implementation frameworks.",
      features: [
        "AI readiness assessment",
        "Ethical AI framework design",
        "Implementation roadmap",
        "Risk management protocols"
      ]
    },
    {
      icon: FaNetworkWired,
      title: "ICT Policy Formulation",
      description: "Development of robust ICT policies covering security, governance, and operational excellence.",
      features: [
        "Security policy development",
        "Data governance frameworks",
        "Technology standards",
        "Compliance protocols"
      ]
    },
    {
      icon: FaDatabase,
      title: "Data Strategy & Governance",
      description: "Strategic data management frameworks ensuring data quality, security, and regulatory compliance.",
      features: [
        "Data governance design",
        "Privacy protection measures",
        "Data quality frameworks",
        "Regulatory compliance"
      ]
    },
    {
      icon: FaLock,
      title: "Cybersecurity Policy",
      description: "Comprehensive cybersecurity policies and frameworks to protect organizational assets and data.",
      features: [
        "Security risk assessment",
        "Incident response protocols",
        "Security awareness programs",
        "Compliance frameworks"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>ICT / AI Strategy & Policy Development | Skyfalke</title>
        <meta name="description" content="Empowering businesses with tailored ICT and AI strategies and policy frameworks for sustainable digital transformation. Expert consulting for public and private sectors." />
        <meta name="keywords" content="ICT strategy, AI policy development, digital transformation, technology consulting, AI governance, ICT frameworks, policy formulation" />
        <link rel="canonical" href="https://skyfalke.com/services/ict-strategy" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="ICT / AI Strategy & Policy Development | Skyfalke" />
        <meta property="og:description" content="Empowering businesses with tailored ICT and AI strategies and policy frameworks for sustainable digital transformation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/ict-strategy" />
        <meta property="og:image" content="https://skyfalke.com/images/services/ict-strategy-og.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "ICT / AI Strategy & Policy Development",
            "description": "Empowering businesses with tailored ICT and AI strategies and policy frameworks for sustainable digital transformation.",
            "provider": {
              "@type": "Organization",
              "name": "Skyfalke",
              "url": "https://skyfalke.com"
            },
            "serviceType": "Technology Consulting",
            "areaServed": "Global",
            "offers": {
              "@type": "Offer",
              "description": "ICT and AI strategy development services"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-primary-500 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
        
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Empowering Organizations Through Strategic
              <span className="block text-secondary-500">
                ICT & AI Policy Development
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Transform your organization with comprehensive ICT and AI strategies that align technology with your business goals, ensure compliance, and drive sustainable digital transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-secondary-500 text-primary-900 font-bold rounded-lg hover:bg-secondary-400 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                <span>Request Consultation</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link href="/case-studies"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary-900 transition-all duration-300 text-sm sm:text-base"
              >
                View Success Stories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About the Service */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                About ICT / AI Strategy & Policy Development
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4">
                ICT and AI Strategy & Policy Development involves creating comprehensive frameworks that guide how organizations adopt, implement, and govern information and communication technologies alongside artificial intelligence systems. Our methodology follows a proven four-step process: assessment, design, implementation, and review.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {approachSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <step.icon className="text-2xl sm:text-3xl text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{step.description}</p>
                <ul className="space-y-2 text-left">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <FaCheck className="text-secondary-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Skyfalke */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose Skyfalke?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our expertise in ICT and AI strategy development is backed by years of experience, global standards compliance, and proven results across diverse sectors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {trustFactors.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <factor.icon className="text-lg sm:text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{factor.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{factor.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Strategic Approach
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We follow a systematic, data-driven approach to ensure your ICT and AI strategies are comprehensive, compliant, and aligned with your organizational objectives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {approachSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 sm:p-8 text-white"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-500 rounded-xl flex items-center justify-center">
                    <step.icon className="text-lg sm:text-2xl text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{step.title}</h3>
                    <div className="w-8 sm:w-12 h-1 bg-secondary-500 mt-2"></div>
                  </div>
                </div>
                <p className="text-primary-100 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{step.description}</p>
                <ul className="space-y-2 sm:space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <FaCheck className="text-secondary-500 flex-shrink-0 text-xs sm:text-sm" />
                      <span className="text-primary-100 text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our ICT & AI Services
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Comprehensive ICT and AI strategy services tailored to your organization's unique needs and objectives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="text-lg sm:text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <FaCheck className="text-secondary-500 flex-shrink-0 text-xs sm:text-sm" />
                      <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Success Stories
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Real results from our ICT and AI strategy implementations across diverse sectors and organizations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 sm:p-8 text-white"
              >
                <div className="mb-4 sm:mb-6">
                  <span className="inline-block bg-secondary-500 text-primary-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                    {study.sector}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{study.title}</h3>
                  <p className="text-primary-100 leading-relaxed text-sm sm:text-base">{study.description}</p>
                </div>
                <div className="space-y-2">
                  {study.results.map((result, resultIndex) => (
                    <div key={resultIndex} className="flex items-center space-x-2">
                      <FaCheck className="text-secondary-500 flex-shrink-0 text-xs" />
                      <span className="text-primary-100 text-xs sm:text-sm">{result}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-custom text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Let's Build a Smarter Digital Future Together
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Ready to transform your organization with strategic ICT and AI policies? Let's discuss how we can help you achieve your digital transformation goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-secondary-500 text-primary-900 font-bold rounded-xl hover:bg-secondary-400 transition-all duration-300 transform hover:scale-105 group shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <span>Book a Strategy Session</span>
                <FaArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link href="/case-studies"
                className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary-900 transition-all duration-300 text-sm sm:text-base"
              >
                <span>View Case Studies</span>
                <FaArrowRight className="ml-2 sm:ml-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ICTStrategy;
