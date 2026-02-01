'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaCloud, 
  FaServer, 
  FaShieldAlt, 
  FaRocket,
  FaDatabase,
  FaNetworkWired,
  FaCogs,
  FaUsers,
  FaChartLine,
  FaGlobe,
  FaLock,
  FaSync,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaDownload,
  FaRecycle,
  FaLeaf
} from 'react-icons/fa';

const Cloud = () => {
  const features = [
    {
      icon: <FaServer className="text-3xl text-secondary-500" />,
      title: "Scalable Infrastructure",
      description: "Elastic cloud infrastructure that scales automatically with your business needs"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-secondary-500" />,
      title: "Enterprise Security",
      description: "Bank-grade security with advanced threat protection and compliance standards"
    },
    {
      icon: <FaRocket className="text-3xl text-secondary-500" />,
      title: "High Performance",
      description: "Lightning-fast cloud computing with global CDN and optimized performance"
    },
    {
      icon: <FaDatabase className="text-3xl text-secondary-500" />,
      title: "Managed Services",
      description: "Fully managed cloud services with 24/7 monitoring and expert support"
    }
  ];

  const services = [
    {
      icon: <FaCloud className="text-2xl text-accent-500" />,
      title: "Cloud Hosting",
      description: "Reliable cloud hosting solutions with 99.9% uptime guarantee"
    },
    {
      icon: <FaNetworkWired className="text-2xl text-accent-500" />,
      title: "Load Balancing",
      description: "Intelligent load balancing for optimal performance and reliability"
    },
    {
      icon: <FaLock className="text-2xl text-accent-500" />,
      title: "Security & Compliance",
      description: "Comprehensive security measures and regulatory compliance"
    },
    {
      icon: <FaSync className="text-2xl text-accent-500" />,
      title: "Auto Scaling",
      description: "Automatic scaling based on traffic and resource demands"
    },
    {
      icon: <FaCogs className="text-2xl text-accent-500" />,
      title: "DevOps Tools",
      description: "Integrated DevOps tools for seamless deployment and management"
    },
    {
      icon: <FaUsers className="text-2xl text-accent-500" />,
      title: "Team Collaboration",
      description: "Advanced collaboration tools for distributed teams"
    }
  ];

  const benefits = [
    "Reduced infrastructure costs by up to 60%",
    "Improved application performance and reliability",
    "Enhanced security and compliance",
    "Faster time to market",
    "Global scalability and reach",
    "24/7 expert support and monitoring"
  ];

  const useCases = [
    {
      title: "E-commerce Platforms",
      description: "Scalable cloud solutions for high-traffic online stores",
      icon: <FaGlobe className="text-2xl text-secondary-500" />
    },
    {
      title: "SaaS Applications",
      description: "Multi-tenant cloud infrastructure for software-as-a-service",
      icon: <FaCloud className="text-2xl text-secondary-500" />
    },
    {
      title: "Data Analytics",
      description: "High-performance computing for big data processing",
      icon: <FaChartLine className="text-2xl text-secondary-500" />
    },
    {
      title: "Mobile Apps",
      description: "Backend infrastructure for mobile applications",
      icon: <FaRocket className="text-2xl text-secondary-500" />
    }
  ];

  const backupFeatures = [
    {
      icon: <FaDatabase className="text-3xl text-secondary-500" />,
      title: "Automated Backups",
      description: "Daily automated backups with configurable retention policies"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-secondary-500" />,
      title: "Encrypted Storage",
      description: "Military-grade encryption for all backup data at rest and in transit"
    },
    {
      icon: <FaSync className="text-3xl text-secondary-500" />,
      title: "Real-time Replication",
      description: "Continuous data replication across multiple geographic regions"
    },
    {
      icon: <FaCheckCircle className="text-3xl text-secondary-500" />,
      title: "Point-in-time Recovery",
      description: "Recover data from any point in time with granular precision"
    }
  ];

  const disasterRecovery = [
    {
      icon: <FaRocket className="text-2xl text-accent-500" />,
      title: "RTO < 15 Minutes",
      description: "Recovery Time Objective of less than 15 minutes for critical systems"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-accent-500" />,
      title: "RPO < 5 Minutes",
      description: "Recovery Point Objective of less than 5 minutes data loss"
    },
    {
      icon: <FaGlobe className="text-2xl text-accent-500" />,
      title: "Multi-Region Failover",
      description: "Automatic failover across multiple geographic regions"
    },
    {
      icon: <FaCogs className="text-2xl text-accent-500" />,
      title: "Automated Testing",
      description: "Regular automated disaster recovery testing and validation"
    },
    {
      icon: <FaUsers className="text-2xl text-accent-500" />,
      title: "24/7 Monitoring",
      description: "Round-the-clock monitoring and alerting for disaster scenarios"
    },
    {
      icon: <FaCheckCircle className="text-2xl text-accent-500" />,
      title: "Compliance Ready",
      description: "Meet regulatory requirements for data protection and recovery"
    }
  ];

  const sustainabilityFeatures = [
    {
      icon: <FaCloud className="text-3xl text-secondary-500" />,
      title: "Carbon Neutral",
      description: "100% carbon-neutral cloud infrastructure powered by renewable energy"
    },
    {
      icon: <FaRocket className="text-3xl text-secondary-500" />,
      title: "Energy Efficient",
      description: "Advanced cooling systems and energy-efficient hardware reduce power consumption"
    },
    {
      icon: <FaRecycle className="text-3xl text-secondary-500" />,
      title: "Circular Economy",
      description: "Hardware recycling and responsible e-waste management programs"
    },
    {
      icon: <FaLeaf className="text-3xl text-secondary-500" />,
      title: "Green Certifications",
      description: "ISO 14001 environmental management and LEED building certifications"
    }
  ];


  return (
    <>
      <Helmet>
        <title>Cloud Services - Enterprise Cloud Solutions | Skyfalke</title>
        <meta name="description" content="Transform your business with Skyfalke's enterprise cloud services. Scalable, secure, and high-performance cloud solutions with 99.9% uptime guarantee. Start your cloud journey today." />
        <meta name="keywords" content="cloud services, cloud hosting, cloud computing, enterprise cloud, scalable infrastructure, cloud security, managed cloud services, cloud migration, DevOps, load balancing, auto scaling" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://skyfalke.com/cloud" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Cloud Services - Enterprise Cloud Solutions | Skyfalke" />
        <meta property="og:description" content="Transform your business with Skyfalke's enterprise cloud services. Scalable, secure, and high-performance cloud solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/cloud" />
        <meta property="og:image" content="https://skyfalke.com/images/cloud-services-og.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cloud Services - Enterprise Cloud Solutions | Skyfalke" />
        <meta name="twitter:description" content="Transform your business with Skyfalke's enterprise cloud services. Scalable, secure, and high-performance cloud solutions." />
        <meta name="twitter:image" content="https://skyfalke.com/images/cloud-services-twitter.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
            alt="Cloud computing and digital infrastructure"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-500 to-accent-500"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Enterprise Cloud Services
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Transform your business with scalable, secure, and high-performance cloud solutions
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://skyfalke.co.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-secondary-500 text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-colors flex items-center gap-2"
                  >
                    <FaPlay className="text-sm" />
                    Start Free Trial
                  </motion.button>
                </a>
                <a 
                  href="https://skyfalke.co.ke/pricing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-800 transition-colors flex items-center gap-2"
                  >
                    <FaDownload className="text-sm" />
                    View Pricing
                  </motion.button>
                </a>
              </div>
            </motion.div>
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Why Choose Skyfalke Cloud?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade cloud infrastructure designed for modern businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Comprehensive Cloud Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale your applications in the cloud
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <a 
                  href="https://skyfalke.co.ke/services" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-secondary-600 hover:text-secondary-700 font-semibold"
                >
                  Learn More <FaArrowRight className="ml-2 text-sm" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Business Benefits
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              See measurable improvements in your business operations with our cloud solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4"
              >
                <FaCheckCircle className="text-secondary-500 text-xl flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Perfect For Every Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startups to enterprises, our cloud solutions adapt to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <div className="mb-4 flex justify-center">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
             </section>

       {/* Backup & Recovery Section */}
       <section className="py-20 bg-white">
         <div className="container mx-auto px-4">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
             className="text-center mb-16"
           >
             <h2 className="text-4xl font-bold text-primary-800 mb-4">
               Enterprise Backup & Recovery
             </h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Comprehensive backup and disaster recovery solutions to protect your critical data
             </p>
           </motion.div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
             {backupFeatures.map((feature, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: index * 0.1 }}
                 viewport={{ once: true }}
                 className="bg-gray-50 p-6 rounded-lg hover:bg-secondary-50 transition-colors"
               >
                 <div className="mb-4">{feature.icon}</div>
                 <h3 className="text-xl font-semibold text-primary-800 mb-3">
                   {feature.title}
                 </h3>
                 <p className="text-gray-600">
                   {feature.description}
                 </p>
               </motion.div>
             ))}
           </div>

           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
             className="text-center mb-16"
           >
             <h3 className="text-3xl font-bold text-primary-800 mb-4">
               Disaster Recovery Capabilities
             </h3>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Minimize downtime and data loss with our advanced disaster recovery solutions
             </p>
           </motion.div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {disasterRecovery.map((capability, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: index * 0.1 }}
                 viewport={{ once: true }}
                 className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
               >
                 <div className="mb-4">{capability.icon}</div>
                 <h3 className="text-xl font-semibold text-primary-800 mb-3">
                   {capability.title}
                 </h3>
                 <p className="text-gray-600">
                   {capability.description}
                 </p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* Sustainability Section */}
       <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
         <div className="container mx-auto px-4">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
             className="text-center mb-16"
           >
             <h2 className="text-4xl font-bold text-primary-800 mb-4">
               Sustainable Cloud Infrastructure
             </h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               Committed to environmental responsibility while delivering exceptional cloud performance
             </p>
           </motion.div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
             {sustainabilityFeatures.map((feature, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: index * 0.1 }}
                 viewport={{ once: true }}
                 className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
               >
                 <div className="mb-4">{feature.icon}</div>
                 <h3 className="text-xl font-semibold text-primary-800 mb-3">
                   {feature.title}
                 </h3>
                 <p className="text-gray-600">
                   {feature.description}
                 </p>
               </motion.div>
             ))}
           </div>

           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
             className="text-center"
           >
             <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
               <h3 className="text-2xl font-bold text-primary-800 mb-4">
                 Our Environmental Commitment
               </h3>
               <p className="text-lg text-gray-600 mb-6">
                 Skyfalke Cloud is committed to reducing our carbon footprint and promoting sustainable technology practices. 
                 Our infrastructure is designed with energy efficiency in mind, and we continuously invest in renewable energy 
                 sources and green technologies.
               </p>
               <div className="grid md:grid-cols-3 gap-6 text-center">
                 <div>
                   <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                   <div className="text-gray-600">Carbon Neutral</div>
                 </div>
                 <div>
                   <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
                   <div className="text-gray-600">Energy Reduction</div>
                 </div>
                 <div>
                   <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                   <div className="text-gray-600">Hardware Recycled</div>
                 </div>
               </div>
             </div>
           </motion.div>
         </div>
       </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Scale Your Business?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Join thousands of businesses that trust Skyfalke Cloud for their infrastructure needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://skyfalke.co.ke" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-colors flex items-center gap-2"
                >
                  <FaRocket className="text-sm" />
                  Start Free Trial
                </motion.button>
              </a>
              <a 
                href="https://skyfalke.co.ke/contact" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-800 transition-colors flex items-center gap-2"
                >
                  <FaUsers className="text-sm" />
                  Talk to Sales
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Cloud;
