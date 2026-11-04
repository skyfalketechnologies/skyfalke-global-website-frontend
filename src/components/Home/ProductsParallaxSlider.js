'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FaArrowRight, 
  FaArrowLeft,
  FaPause,
  FaPlay
} from 'react-icons/fa';

const ProductsParallaxSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const products = [
    {
      id: 1,
      title: "Cloud Solutions",
      subtitle: "Scalable & Secure",
      description: "Enterprise-grade cloud infrastructure providing scalability, security, and reliability for modern businesses.",
      bgColor: "bg-gradient-to-br from-[#E0AE00] to-[#f4c430]",
      link: "https://skyfalke.co.ke",
      external: true,
      features: ["Cloud Migration", "Infrastructure Management", "Security & Compliance", "24/7 Support"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
    },
    {
      id: 2,
      title: "Creative Services",
      subtitle: "Design & Innovation",
      description: "Creative design solutions that elevate your brand and create memorable digital experiences.",
      bgColor: "bg-gradient-to-br from-[#E0AE00] to-[#f4c430]",
      link: "/services#creative",
      features: ["Brand Identity", "UI/UX Design", "Video Production", "Digital Art"],
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
    },
    {
      id: 3,
      title: "Mobile Development",
      subtitle: "Native & Cross-Platform",
      description: "Custom mobile applications that deliver exceptional user experiences across all devices.",
      bgColor: "bg-gradient-to-br from-[#E0AE00] to-[#f4c430]",
      link: "/services#mobile",
      features: ["iOS Development", "Android Development", "React Native", "App Maintenance"],
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    // {
    //   id: 5,
    //   title: "Cybersecurity",
    //   subtitle: "Protect & Secure",
    //   description: "Comprehensive cybersecurity solutions to protect your business from evolving digital threats.",
    //   bgColor: "bg-gradient-to-br from-secondary-600 to-secondary-800",
    //   link: "/services#cybersecurity",
    //   features: ["Security Audits", "Threat Detection", "Data Protection", "Incident Response"]
    // },
    {
      id: 4,
      title: "Business Automation",
      subtitle: "Efficiency & Growth",
      description: "Automate business processes to increase efficiency, reduce costs, and accelerate growth.",
      bgColor: "bg-gradient-to-br from-[#E0AE00] to-[#f4c430]",
      link: "/services#automation",
      features: ["Process Automation", "Workflow Optimization", "Integration Services", "Performance Monitoring"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 5,
      title: "Web Development",
      subtitle: "Modern & Responsive",
      description: "Custom web applications and websites built with cutting-edge technologies for optimal performance.",
      bgColor: "bg-gradient-to-br from-[#E0AE00] to-[#f4c430]",
      link: "/services#web-development",
      features: ["Custom Websites", "E-commerce Solutions", "Web Applications", "API Development"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
    },
    {
      id: 6,
      title: "Consulting Services",
      subtitle: "Strategy & Guidance",
      description: "Expert consulting to help you make informed decisions and achieve your business objectives.",
      bgColor: "bg-gradient-to-br from-[#E0AE00] to-[#f4c430]",
      link: "/services#consulting",
      features: ["Digital Strategy", "Technology Consulting", "Business Analysis", "Project Management"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 7,
      title: "Innovation Lab",
      subtitle: "Research & Development",
      description: "Cutting-edge research and development services to keep your business ahead of the competition.",
      bgColor: "bg-gradient-to-br from-[#E0AE00] to-[#f4c430]",
      link: "/services#innovation",
      features: ["Emerging Technologies", "Prototype Development", "Market Research", "Innovation Strategy"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative section-padding bg-primary-900 overflow-hidden hidden sm:block">

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
            Our 
            <span className="text-[#E0AE00]">
              &nbsp;Products & Services
            </span>
          </h2>
        </motion.div>

        {/* Parallax Slider */}
        <div className="relative max-w-7xl mx-auto">
          {/* Main Slide */}
          <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className={`absolute inset-0 ${products[currentSlide].bgColor} transform transition-transform duration-1000`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center px-4 sm:px-6 lg:px-8 xl:px-16">
                      {/* Left Side - Content */}
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white order-2 lg:order-1"
                      >
                        <div className="mb-4 sm:mb-6 md:mb-8">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
                            {products[currentSlide].title}
                          </h3>
                          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#303661] mb-3 sm:mb-4 lg:mb-6">
                            {products[currentSlide].subtitle}
                          </p>
                          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-200 leading-relaxed mb-4 sm:mb-6 md:mb-8">
                            {products[currentSlide].description}
                          </p>
                        </div>

                        {/* Features - Mobile optimized */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
                          {products[currentSlide].features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                              className={`flex items-center space-x-2 sm:space-x-3 ${index >= 2 ? 'hidden sm:flex' : ''}`}
                            >
                              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#E0AE00] rounded-full flex-shrink-0"></div>
                              <span className="text-sm sm:text-base text-gray-200 font-medium">{feature}</span>
                            </motion.div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <Link
                            href={products[currentSlide].link}
                            target={products[currentSlide].external ? "_blank" : "_self"}
                            rel={products[currentSlide].external ? "noopener noreferrer" : ""}
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#E0AE00] text-slate-900 font-semibold rounded-xl hover:bg-[#f4c430] transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                          >
                            <span>Learn More</span>
                            <FaArrowRight className="ml-2 text-sm" />
                          </Link>
                        </motion.div>
                      </motion.div>

                      {/* Right Side - Visual Element - Hidden on mobile, shown on lg+ */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative order-1 lg:order-2 hidden lg:block"
                      >
                        <div className="relative aspect-square bg-white/10 rounded-2xl lg:rounded-3xl backdrop-blur-sm border border-white/20 overflow-hidden">
                          <img
                            src={products[currentSlide].image}
                            alt={products[currentSlide].title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls - Mobile optimized */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <FaArrowLeft className="text-sm sm:text-base md:text-lg" />
            </button>
            
            {/* Slide Indicators - Mobile optimized */}
            <div className="flex space-x-2 sm:space-x-3">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#E0AE00] w-6 sm:w-8' 
                      : 'bg-white/40 hover:bg-white/60 w-2 sm:w-3'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <FaArrowRight className="text-sm sm:text-base md:text-lg" />
            </button>
          </div>

          {/* Auto-play Toggle - Hidden on mobile, shown on sm+ */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute top-3 sm:top-4 md:top-6 lg:top-8 right-3 sm:right-4 md:right-6 lg:right-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hidden sm:flex"
          >
            {isAutoPlaying ? <FaPause className="text-sm sm:text-base md:text-lg" /> : <FaPlay className="text-sm sm:text-base md:text-lg" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsParallaxSlider;
