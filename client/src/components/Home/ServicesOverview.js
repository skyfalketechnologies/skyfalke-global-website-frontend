'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowRight,
  FaRocket,
  FaPlug,
  FaDatabase,
  FaCogs,
  FaCheckCircle
} from 'react-icons/fa';

const ServicesOverview = () => {
  const services = [
    {
      id: 1,
      title: "Business Tools",
      subtitle: "Optimize & Automate",
      description: "Streamline operations and boost productivity with our comprehensive business optimization tools.",
      link: "/services#business-tools",
      bgImage: "https://ik.imagekit.io/g3nahgeeu/social-media-and-marketing-virtual-icons-screen-ta-2024-12-19-16-42-30-utc-min.jpg",
    },
    {
      id: 2,
      title: "Cloud Solutions",
      subtitle: "Scalable & Secure",
      description: "Enterprise-grade cloud infrastructure for scalable, secure, and reliable business operations.",
      link: "https://skyfalke.co.ke",
      external: true,
      bgImage: "https://ik.imagekit.io/g3nahgeeu/bdr.webp?updatedAt=1755866661657",
    },
    {
      id: 3,
      title: "Creative Services",
      subtitle: "Design & Innovate",
      description: "Elevate your brand with creative design solutions and engaging digital experiences.",
      link: "/services#creative",
      bgImage: "https://ik.imagekit.io/g3nahgeeu/creative-services.webp",
    }
  ];

  const problems = [
    {
      icon: FaPlug,
      text: "Tools don't talk to each other.",
      iconColor: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: FaDatabase,
      text: "Data exists but isn't useful.",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: FaCogs,
      text: "Processes are manual, slow, and expensive.",
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#303661]/10 text-[#303661] uppercase text-xs sm:text-sm font-bold mb-4 sm:mb-6 rounded-sm">
             Positioning
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#303661] mb-8 sm:mb-10 px-4 max-w-5xl mx-auto leading-tight">
            Most organizations don't have a tech problem. They have a systems problem.
          </h2>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${problem.bgColor} rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <IconComponent className={`text-xl sm:text-2xl ${problem.iconColor}`} />
                </div>
                <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed">
                  {problem.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-[#303661] to-[#1e2440] rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-[#e0ae00] rounded-2xl flex items-center justify-center">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">
              The Skyfalke Solution
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl text-center text-gray-100 leading-relaxed font-light">
              Skyfalke fixes this by designing and implementing <span className="font-semibold text-white">end-to-end digital systems</span> that actually support growth and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#e0ae00] text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <span>Get Free Consultation</span>
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 text-sm sm:text-base"
              >
                <span>View Case Studies</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
