'use client';

import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEO/SEOHead';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { scrollToElement } from '../utils/scrollToTop';
import { 
  FaRocket,
  FaEye,
  FaLeaf,
  FaSync,
  FaHandsHelping,
  FaLightbulb,
  FaArrowRight,
  FaCoffee,
  FaMugHot,
  FaTint,
  FaBolt,
  FaLaugh,
  FaChartLine,
  FaUsers,
  FaCode,
  FaCloud,
  FaClock,
  FaTrophy,
  FaHeart,
  FaSmile,
  FaMusic,
  FaUserFriends,
  FaBirthdayCake
} from 'react-icons/fa';

const About = () => {
  // Beverages consumed this week (fun data!)
  const beverages = [
    { name: 'Coffee ☕', count: 47, color: 'bg-amber-700', icon: FaCoffee },
    { name: 'Tea 🍵', count: 23, color: 'bg-green-600', icon: FaMugHot },
    { name: 'Water 💧', count: 89, color: 'bg-blue-500', icon: FaTint },
    { name: 'Energy Drinks ⚡', count: 12, color: 'bg-red-500', icon: FaBolt },
    { name: 'Juice 🥤', count: 8, color: 'bg-orange-400', icon: FaTint },
  ];

  // Skyfalke By Numbers - Fun stats!
  const stats = [
    { 
      number: '∞', 
      label: 'Cups of Coffee', 
      subtext: '(and counting...)',
      icon: FaCoffee,
      color: 'text-amber-600'
    },
    { 
      number: '2,847', 
      label: 'Songs Played', 
      subtext: '(this week alone)',
      icon: FaMusic,
      color: 'text-pink-500'
    },
    { 
      number: '10+', 
      label: 'Clients Served', 
      subtext: '(and counting)',
      icon: FaUserFriends,
      color: 'text-green-600'
    },
    { 
      number: '27', 
      label: 'Average Age', 
      subtext: '(years young)',
      icon: FaBirthdayCake,
      color: 'text-purple-500'
    },
    { 
      number: '100%', 
      label: 'Commitment to Excellence', 
      subtext: '(and terrible puns)',
      icon: FaTrophy,
      color: 'text-yellow-500'
    },
    { 
      number: '∞', 
      label: 'Ideas Per Minute', 
      subtext: '(most are terrible)',
      icon: FaLightbulb,
      color: 'text-yellow-400'
    },
    { 
      number: '99.9%', 
      label: 'Uptime', 
      subtext: '(0.1% is coffee breaks)',
      icon: FaCloud,
      color: 'text-blue-500'
    },
    { 
      number: '∞', 
      label: 'Dad Jokes', 
      subtext: '(we\'re not sorry)',
      icon: FaLaugh,
      color: 'text-purple-500'
    },
  ];

  const values = [
    {
      icon: FaLightbulb,
      title: "Creativity & Innovation",
      description: "We challenge norms, think differently, and use creativity to solve complex problems. Also, we make terrible puns."
    },
    {
      icon: FaHandsHelping,
      title: "Empowerment ",
      description: "We empower our clients, partners, and teams to achieve their highest potential online. And offline. We're not picky."
    },
    {
      icon: FaSync,
      title: "Consistency ",
      description: "We believe in steady effort, reliable delivery, and continuous improvement. Also consistent coffee consumption."
    },
    {
      icon: FaLeaf,
      title: "Sustainability ",
      description: "We innovate responsibly, ensuring our solutions are eco-conscious and future-ready. And we recycle our coffee cups."
    },
  ];

  const team = [
    {
      name: "Matekwa Ronald",
      position: "Team Lead & Founder",
      bio: "Visionary leader with 5+ years in software design.",
      image: "/images/team-1.jpg",
      linkedin: "https://linkedin.com/in/matekwa-ronald",
      twitter: "https://x.com/matekwaronald"
    },
  ];

  const milestones = [
    {
      year: "December 2023",
      title: "Company Founded",
      description: "Skyfalke was established with a vision to promote sustainable cloud solutions Africa."
    },
    {
      year: "January 2024",
      title: "Cloud Platform Launch",
      description: "Launched our comprehensive cloud solutions platform for individual & enterprise clients."
    },
    {
      year: "April 2024",
      title: "Our First 10 Clients",
      description: "A big milestone of 10 clients for cloud solutions"
    },
    {
      year: "August 2024",
      title: "Service Expansion",
      description: "Expanded our services to digital & Media Solutions"
    },
    {
      year: "September 2025",
      title: "Company Incorporation",
      description: "We incorporated the company to 'Skyfalke Limited'"
    },
    {
      year: "October - ",
      title: "More Success Stories",
      description: "Celebrating over 20 successful business transformations across Africa."
    }
  ];

  const handleAnchorClick = (e, elementId) => {
    e.preventDefault();
    scrollToElement(elementId);
  };

  return (
    <>
      <SEOHead
        pageType="about"
        title="About Skyfalke - Digital Firm Serving Africa & Beyond"
        description="Learn about Skyfalke's mission to provide sustainable cloud solutions and digital marketing services. Discover our story, values, and commitment to eco-friendly technology."
        keywords="about skyfalke, company history, mission, values, sustainable technology, green hosting, african technology company, digital transformation, team"
        canonical="https://skyfalke.com/about"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#303661] via-[#2a2f56] to-[#1e2140] section-padding overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-64 h-64 bg-[#e0ae00] rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-[#e0ae00] rounded-full blur-3xl"
          />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">           
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Empowering Businesses Online
              <br />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed"
            >
              We're on a mission to transform African businesses through innovative 
              technology solutions that drive growth, efficiency, and global competitiveness.
              <br />
              <span className="text-[#e0ae00] text-sm mt-2 block">
                (Also, we make really good coffee)
              </span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={(e) => handleAnchorClick(e, 'values')}
                className="btn-primary"
              >
                Our Values
              </button>
              <button
                onClick={(e) => handleAnchorClick(e, 'numbers')}
                className="btn-outline text-white border-white hover:bg-white hover:text-[#303661]"
              >
                By The Numbers
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border-l-4 border-[#303661] p-8 shadow-sm"
            >
              <div className="w-16 h-16 bg-[#303661] flex items-center justify-center mb-6">
                <FaRocket className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#303661] mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  We help businesses succeed online by delivering innovative, reliable, and sustainable digital solutions,
                  inspiring creativity, consistency, and continuous learning in everything we do.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe that technology should be accessible, affordable, and 
                tailored to the specific needs of African markets, helping businesses 
                overcome challenges and unlock their full potential.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border-l-4 border-[#e0ae00] p-8 shadow-sm"
            >
              <div className="w-16 h-16 bg-[#e0ae00] flex items-center justify-center mb-6">
                <FaEye className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#303661] mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                To be Africa's leading technology partner, recognized for driving 
                digital transformation and sustainable business growth across the continent.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                To empower businesses to thrive in the digital world through innovation, sustainability, 
                and creativity, building a future where technology fuels success and positive impact.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="section-padding bg-white">
        <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center mb-4">
                <FaHeart className="text-4xl text-red-500 mr-3" />
                <h2 className="text-4xl md:text-5xl font-bold text-[#303661]">
                  Our Core Values
                </h2>
                <FaHeart className="text-4xl text-red-500 ml-3" />
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we do and shape how we serve our clients.
              </p>
              <p className="text-sm text-gray-500 mt-2 italic">
                (We also value good coffee and terrible jokes)
              </p>
            </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 border-2 border-gray-200 p-8 hover:border-[#e0ae00] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-[#303661] flex items-center justify-center mb-6">
                  <value.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#303661] mb-4">{value.title}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beverages Consumed This Week - Fun Section! */}
      <section className="section-padding bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold text-[#303661]">
                Beverages Consumed This Week
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Because great code requires great hydration (and caffeine)
            </p>
            <p className="text-sm text-gray-500 mt-2 italic">
              *Data may or may not be accurate. We lost count after the 30th coffee.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                {beverages.map((beverage, index) => {
                  const maxCount = Math.max(...beverages.map(b => b.count));
                  const percentage = (beverage.count / maxCount) * 100;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <beverage.icon className={`text-2xl ${beverage.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">{beverage.name}</span>
                          <span className="font-bold text-[#303661] text-lg">{beverage.count}</span>
                        </div>
                        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                            className={`h-full ${beverage.color} rounded-full flex items-center justify-end pr-2`}
                          >
                            {percentage > 15 && (
                              <span className="text-white text-xs font-bold">
                                {beverage.count}
                              </span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 pt-6 border-t border-gray-200 text-center"
              >
                <p className="text-2xl font-bold text-[#303661] mb-2">
                  Total: {beverages.reduce((sum, b) => sum + b.count, 0)} Beverages
                </p>
                <p className="text-sm text-gray-500">
                  That's approximately {Math.round(beverages.reduce((sum, b) => sum + b.count, 0) / 7)} per day. 
                  We're basically liquid at this point. 💧
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Skyfalke By Numbers - Fun Stats! */}
      <section id="numbers" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold text-[#303661]">
                Skyfalke By Numbers
              </h2>
              <FaSmile className="text-4xl text-[#e0ae00] ml-3" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The stats that matter (and some that don't)
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="card-hover bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 p-8 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                  <stat.icon className="text-2xl" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-[#303661] mb-2">
                  {stat.number}
                </div>
                <h3 className="text-xl font-bold text-[#303661] mb-2">
                  {stat.label}
                </h3>
                <p className="text-sm text-gray-500 italic">
                  {stat.subtext}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section id="journey" className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#303661] mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to becoming a trusted technology partner across Africa.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-12 border-l-4 border-[#e0ae00]"
                >
                  <div className="absolute left-[-10px] top-0 w-4 h-4 bg-[#303661] rounded-full"></div>
                  <div className="bg-white border border-gray-200 p-6 shadow-sm">
                    <div className="text-2xl font-bold text-[#e0ae00] mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-[#303661] mb-3">{milestone.title}</h3>
                    <p className="text-base text-gray-700 leading-relaxed">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#303661]">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-200 mb-4">
              Join tens of successful businesses that have accelerated their growth with Skyfalke.
            </p>
            <p className="text-sm text-gray-300 mb-8 italic">
              (We'll even throw in a free coffee if you mention this page ☕)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-[#e0ae00] text-[#303661] font-bold rounded-md hover:bg-[#c99a00] transition-colors"
              >
                <span>Get Started Today</span>
                <FaArrowRight className="ml-3" />
              </Link>
              <Link href="/services"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-[#303661] transition-colors"
              >
                Explore Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;