'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FaArrowRight,
  FaShieldAlt,
  FaCloud,
  FaClock,
  FaCheckCircle,
  FaServer,
  FaLock,
  FaSync,
  FaDatabase,
  FaNetworkWired
} from 'react-icons/fa';
import useMobileDetection from '../../hooks/useMobileDetection';
import { getScrollAnimationValues } from '../../utils/animationUtils';

const CTASection = () => {
  const containerRef = useRef(null);
  const { shouldAnimate } = useMobileDetection();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms - always call hooks but conditionally use values
  const y1Transform = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2Transform = useTransform(scrollYProgress, [0, 1], [0, -40]);
  
  // Apply mobile detection to the transform values
  const y1 = shouldAnimate ? y1Transform : 0;
  const y2 = shouldAnimate ? y2Transform : 0;

  const enterpriseFeatures = [
    {
      icon: FaShieldAlt,
      title: "Enterprise Security",
      description: "Bank-level encryption with SOC 2 Type II compliance",
      color: "text-blue-500"
    },
    {
      icon: FaDatabase,
      title: "Data Integrity",
      description: "Zero data loss with automated integrity checks",
      color: "text-green-500"
    },
    {
      icon: FaNetworkWired,
      title: "Global Infrastructure",
      description: "Multi-region deployment with 99.99% availability",
      color: "text-purple-500"
    },
    {
      icon: FaSync,
      title: "Instant Recovery",
      description: "RTO < 15 minutes with automated failover",
      color: "text-orange-500"
    }
  ];

  const performanceMetrics = [
    { number: "99.99%", label: "Uptime SLA", icon: FaCheckCircle },
    { number: "< 15min", label: "Recovery Time", icon: FaClock },
    { number: "24/7", label: "Support", icon: FaServer },
    { number: "0%", label: "Data Loss", icon: FaLock }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen bg-slate-900 overflow-hidden flex items-center section-padding md:py-0"
    >
      {/* Parallax Background */}
      <div className="absolute inset-0">
        <motion.div
          style={{ 
            y: y1,
            backgroundImage: `url('https://ik.imagekit.io/g3nahgeeu/bdr.webp?updatedAt=1755866661657')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          className="absolute inset-0 scale-110"
        />
        
        {/* Corporate overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-slate-800/90" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, x: -50 } : false}
            whileInView={shouldAnimate ? { opacity: 1, x: 0 } : false}
            viewport={{ once: true }}
            transition={shouldAnimate ? { duration: 0.8 } : { duration: 0 }}
            style={{ y: y2 }}
            className="order-2 lg:order-1"
          >
            {/* Main Heading */}
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Enterprise Backup
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e0ae00] to-[#f4c430]">
                & Disaster Recovery
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl"
            >
              Protect your organization's critical data with enterprise-grade backup and disaster recovery solutions. 
              Ensure business continuity with automated, secure, and compliant data protection.
            </motion.p>

            {/* Performance Metrics */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
              whileInView={shouldAnimate ? { opacity: 1, y: 0 } : false}
              viewport={{ once: true }}
              transition={shouldAnimate ? { duration: 0.6, delay: 0.2 } : { duration: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10"
            >
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <metric.icon className="text-[#e0ae00] text-sm sm:text-lg" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">{metric.number}</div>
                  <div className="text-xs text-slate-400 font-medium leading-tight">{metric.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
              whileInView={shouldAnimate ? { opacity: 1, y: 0 } : false}
              viewport={{ once: true }}
              transition={shouldAnimate ? { duration: 0.6, delay: 0.4 } : { duration: 0 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                href="https://skyfalke.co.ke/backup-disaster-recovery"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#e0ae00] text-slate-900 font-semibold rounded-lg hover:bg-[#f4c430] transition-all duration-300 transform hover:scale-105 group shadow-lg text-sm sm:text-base"
              >
                <span>Start Free Trial</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="https://skyfalke.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
              >
                View Platform
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Features Grid */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, x: 50 } : false}
            whileInView={shouldAnimate ? { opacity: 1, x: 0 } : false}
            viewport={{ once: true }}
            transition={shouldAnimate ? { duration: 0.8, delay: 0.2 } : { duration: 0 }}
            style={{ y: y2 }}
            className="space-y-4 sm:space-y-6 order-1 lg:order-2"
          >
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={shouldAnimate ? { opacity: 1, y: 0 } : false}
                viewport={{ once: true }}
                transition={shouldAnimate ? { duration: 0.6, delay: 0.1 * index } : { duration: 0 }}
                className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                  <feature.icon className="text-lg sm:text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{feature.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;