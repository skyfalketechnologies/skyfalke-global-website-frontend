'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEO/SEOHead';
import { 
  FaCloud, 
  FaServer, 
  FaShieldAlt, 
  FaCogs, 
  FaChartLine,
  FaCheckCircle,
  FaArrowRight,
  FaUsers,
  FaBuilding,
  FaCode,
  FaUniversity
} from 'react-icons/fa';
import useMobileDetection from '../hooks/useMobileDetection';
import { getAnimationProps } from '../utils/animationUtils';

const CloudSolutions = () => {
  const { shouldAnimate } = useMobileDetection();

  const services = [
    {
      id: 1,
      title: "Cloud Architecture & Deployment",
      description: "We design and deploy custom cloud environments on AWS, Google Cloud, Azure, or Digital Ocean, tailored to your performance, security, and cost needs.",
      icon: FaServer,
      features: [
        "Cloud infrastructure design",
        "Load balancing & auto-scaling",
        "High availability architecture"
      ]
    },
    {
      id: 2,
      title: "Cloud Migration",
      description: "Seamlessly move your applications, data, and workloads from on-premises or legacy systems to the cloud with minimal downtime.",
      icon: FaCloud,
      features: [
        "Application & database migration",
        "Cloud readiness assessment",
        "Zero data loss strategy"
      ]
    },
    {
      id: 3,
      title: "DevOps & Automation",
      description: "We bring speed and consistency to your development cycle through DevOps automation and CI/CD pipelines.",
      icon: FaCogs,
      features: [
        "Automated deployments",
        "Containerization (Docker, Kubernetes)",
        "Infrastructure as Code (Terraform, Ansible)"
      ]
    },
    {
      id: 4,
      title: "Cloud Security & Compliance",
      description: "Your data is your most valuable asset, we help protect it. We implement industry-standard security measures, access control, and compliance protocols.",
      icon: FaShieldAlt,
      features: [
        "Identity & Access Management (IAM)",
        "Network security & encryption",
        "GDPR and ISO-compliant cloud practices"
      ]
    },
    {
      id: 5,
      title: "Managed Cloud & Optimization",
      description: "Our team handles the daily management, monitoring, and cost optimization of your cloud infrastructure, so you can focus on your business.",
      icon: FaChartLine,
      features: [
        "24/7 monitoring & support",
        "Performance tuning",
        "Cost optimization & reporting"
      ]
    }
  ];

  const whyChooseUs = [
    "Certified Cloud Engineers",
    "Proven Experience with AWS, Azure, GCP & Digital Ocean",
    "Cost-Efficient Solutions for Every Business Size",
    "24/7 Technical Support & Maintenance",
    "We are official Google Cloud Partners"
  ];

  const targetAudience = [
    {
      title: "Startups & SMEs",
      description: "Looking to scale fast without heavy infrastructure costs",
      icon: FaUsers
    },
    {
      title: "Enterprises",
      description: "Modernizing legacy systems",
      icon: FaBuilding
    },
    {
      title: "Agencies & Developers",
      description: "In need of managed cloud hosting",
      icon: FaCode
    },
    {
      title: "Government & Institutions",
      description: "Seeking reliable, compliant cloud infrastructure",
      icon: FaUniversity
    }
  ];

  return (
    <>
      <SEOHead
        pageType="service"
        title="Managed Cloud Solutions | Skyfalke Cloud"
        description="Empowering businesses to scale with secure, efficient, and future-ready cloud solutions. Expert cloud engineering services for AWS, Azure, GCP, and Digital Ocean."
        keywords="cloud solutions, cloud engineering, AWS, Azure, Google Cloud, Digital Ocean, cloud migration, DevOps, cloud security, managed cloud services, cloud architecture"
        canonical="https://skyfalke.com/cloud-solutions"
        ogTitle="Managed Cloud Solutions | Skyfalke Cloud"
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              {...getAnimationProps({
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8 }
              }, shouldAnimate)}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
                Managed Cloud Engineering at{' '}
                <span className="text-[#e0ae00]">Skyfalke Cloud</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
                Empowering businesses to scale with secure, efficient, and future-ready cloud solutions.
              </p>
            </motion.div>

            <motion.div
              {...getAnimationProps({
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, delay: 0.2 }
              }, shouldAnimate)}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0"
            >
              <Link href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#e0ae00] text-white font-semibold rounded-lg hover:bg-[#d4a000] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Get Started Today
                <FaArrowRight className="ml-2" />
              </Link>
              <a
                href="https://skyfalke.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300 text-sm sm:text-base"
              >
                Visit Cloud Platform
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            }, shouldAnimate)}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Overview
            </h2>
            <div className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-6">
              <p>
                At Skyfalke Cloud, we help businesses harness the full power of the cloud.
                Our Cloud Engineering services are designed to architect, migrate, and manage applications and infrastructure in leading cloud environments, ensuring speed, scalability, and security.
              </p>
              <p>
                Whether you're moving to the cloud, optimizing existing workloads, or building a new digital ecosystem, we deliver cloud solutions that power growth, innovation, and reliability.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            }, shouldAnimate)}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Cloud Engineering Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.id}
                  {...getAnimationProps({
                    initial: { opacity: 0, y: 50 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.8, delay: index * 0.1 }
                  }, shouldAnimate)}
                  className="bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 p-6 sm:p-8 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e0ae00] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-0">
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 sm:ml-4">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <FaCheckCircle className="w-5 h-5 text-[#e0ae00] mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            }, shouldAnimate)}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Skyfalke Cloud
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {whyChooseUs.map((reason, index) => (
              <motion.div
                key={index}
                {...getAnimationProps({
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, delay: index * 0.1 }
                }, shouldAnimate)}
                className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center hover:bg-[#e0ae00] hover:text-white transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#e0ae00] rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-white transition-colors duration-300">
                  <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#e0ae00] transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg leading-tight">{reason}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            }, shouldAnimate)}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Who We Serve?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {targetAudience.map((audience, index) => {
              const IconComponent = audience.icon;
              return (
                <motion.div
                  key={index}
                  {...getAnimationProps({
                    initial: { opacity: 0, y: 50 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.8, delay: index * 0.1 }
                  }, shouldAnimate)}
                  className="bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 p-6 sm:p-8 text-center group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e0ae00] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {audience.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {audience.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-[#e0ae00] to-[#d4a000]">
        <div className="container-custom">
          <motion.div
            {...getAnimationProps({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8 }
            }, shouldAnimate)}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
              Ready to Transform Your Cloud Infrastructure?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              Let our certified cloud engineers help you build, migrate, and optimize your cloud environment for maximum performance and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0">
              <Link href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#e0ae00] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Start Your Cloud Journey
                <FaArrowRight className="ml-2" />
              </Link>
              <a
                href="https://skyfalke.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#e0ae00] transition-all duration-300 text-sm sm:text-base"
              >
                Explore Cloud Plartform
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CloudSolutions;
