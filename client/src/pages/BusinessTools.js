import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaSearch, 
  FaCogs, 
  FaCode, 
  FaLightbulb, 
  FaTools,
  FaRocket,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaArrowRight
} from 'react-icons/fa';

const BusinessTools = () => {
  const services = [
    {
      icon: FaSearch,
      title: "SEO Tools & Analytics",
      description: "Optimize your online presence and improve search engine rankings with advanced SEO tools.",
      features: [
        "Keyword research and analysis",
        "On-page SEO optimization",
        "Technical SEO audits",
        "Performance tracking and reporting"
      ]
    },
    {
      icon: FaCogs,
      title: "Process Automation",
      description: "Streamline your business operations with intelligent automation solutions.",
      features: [
        "Workflow automation design",
        "Business process optimization",
        "Integration and API development",
        "Automated reporting systems"
      ]
    },
    {
      icon: FaCode,
      title: "Custom Applications",
      description: "Build tailored software solutions that address your specific business needs.",
      features: [
        "Custom web applications",
        "Mobile app development",
        "Database design and management",
        "Third-party integrations"
      ]
    },
    {
      icon: FaLightbulb,
      title: "Business Intelligence",
      description: "Transform data into actionable insights for better decision-making.",
      features: [
        "Data analysis and visualization",
        "KPI dashboard development",
        "Predictive analytics",
        "Business reporting automation"
      ]
    },
    {
      icon: FaTools,
      title: "Performance Optimization",
      description: "Optimize your business performance and maximize efficiency across all operations.",
      features: [
        "Performance monitoring and analysis",
        "Efficiency improvement strategies",
        "Resource optimization",
        "Continuous improvement processes"
      ]
    }
  ];

  const benefits = [
    {
      icon: FaRocket,
      title: "Increased Efficiency",
      description: "Streamline operations and reduce manual work with automation and optimization."
    },
    {
      icon: FaChartLine,
      title: "Better Performance",
      description: "Improve business metrics and achieve better results with data-driven insights."
    },
    {
      icon: FaShieldAlt,
      title: "Competitive Advantage",
      description: "Stay ahead of the competition with advanced tools and optimized processes."
    },
    {
      icon: FaUsers,
      title: "Enhanced Productivity",
      description: "Empower your team with better tools and streamlined workflows."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Business Tools & Automation Services | Skyfalke - Optimize Operations & Maximize Efficiency</title>
        <meta name="description" content="Optimize your business operations with Skyfalke's business tools and automation solutions. From SEO tools to custom applications, we help you work smarter." />
        <meta name="keywords" content="business tools, SEO tools, process automation, custom applications, business intelligence, performance optimization" />
        <meta property="og:title" content="Business Tools & Automation Services | Skyfalke - Optimize Operations & Maximize Efficiency" />
        <meta property="og:description" content="Optimize your business operations with our business tools and automation solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/business-tools" />
        <meta property="og:image" content="/favicon.ico" />
        <link rel="canonical" href="https://skyfalke.com/services/business-tools" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-16 sm:py-20 md:py-24">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Business Tools
                <span className="block text-secondary-500 mt-2">Solutions</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
                Optimize your business operations, automate processes, and maximize efficiency with our comprehensive business tools and solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-secondary-500 hover:bg-secondary-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">
                  Get Started
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base">
                  View Case Studies
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Our Business Tools Services
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Comprehensive business optimization solutions designed to streamline operations and maximize efficiency.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <service.icon className="text-white text-lg sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{service.description}</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 text-sm sm:text-base">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Why Choose Our Business Tools?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Experience the power of optimized business operations with our comprehensive tools and solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-white text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Optimize Your Business Operations?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Let's discuss how our business tools and automation solutions can help you work smarter and achieve better results.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-secondary-500 text-white hover:bg-secondary-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base">
                  <span>Get Free Consultation</span>
                  <FaArrowRight className="ml-2" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base">
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

export default BusinessTools;
