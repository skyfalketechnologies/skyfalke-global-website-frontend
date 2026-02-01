'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowRight,
  FaChartLine,
  FaUsers,
  FaClock,
  FaExternalLinkAlt
} from 'react-icons/fa';

const FeaturedCaseStudies = () => {
  const caseStudies = [
    {
      id: 1,
      title: "E-commerce Growth Success",
      client: "TechMart Nigeria",
      industry: "E-commerce",
      challenge: "Low online visibility and poor conversion rates",
      solution: "Comprehensive digital marketing strategy with SEO optimization and social media campaigns",
      results: {
        traffic: "+250%",
        conversions: "+180%",
        revenue: "+320%"
      },
      timeline: "6 months",
      image: "/images/case-study-1.jpg",
      tags: ["Digital Marketing", "SEO", "E-commerce"],
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "Cloud Migration Excellence",
      client: "African Bank Ltd",
      industry: "Financial Services",
      challenge: "Legacy infrastructure limiting scalability and security",
      solution: "Complete cloud migration with enhanced security protocols and 24/7 monitoring",
      results: {
        uptime: "99.9%",
        costs: "-40%",
        performance: "+200%"
      },
      timeline: "4 months",
      image: "/images/case-study-2.jpg",
      tags: ["Cloud Solutions", "Migration", "Security"],
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "Business Process Optimization",
      client: "Lagos Manufacturing Co.",
      industry: "Manufacturing",
      challenge: "Inefficient processes and lack of business intelligence",
      solution: "Custom business tools implementation with automated workflows and analytics dashboard",
      results: {
        efficiency: "+150%",
        costs: "-30%",
        insights: "Real-time"
      },
      timeline: "8 months",
      image: "/images/case-study-3.jpg",
      tags: ["Business Tools", "Automation", "Analytics"],
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Success Stories That
            <span className="text-gradient block mt-2">Inspire Growth</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how we've helped businesses across Africa achieve remarkable 
            transformations and sustainable growth through innovative solutions.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <div className={`absolute inset-0 bg-primary-600 opacity-90`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h4 className="text-2xl font-bold mb-2">{study.client}</h4>
                      <p className="text-gray-100">{study.industry}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {study.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {study.title}
                  </h3>

                  {/* Challenge */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Challenge:</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Solution:</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {study.solution}
                    </p>
                  </div>

                  {/* Results */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Results:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(study.results).map(([key, value], resultIndex) => (
                        <div key={resultIndex} className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FaClock className="text-sm" />
                      <span className="text-sm">{study.timeline}</span>
                    </div>
                    <Link
                      href={`/case-studies/${study.id}`}
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 group/link"
                    >
                      <span className="text-sm">Read More</span>
                      <FaArrowRight className="ml-2 text-xs group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-secondary-50 rounded-2xl p-8 md:p-12 border border-secondary-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Want to Be Our Next Success Story?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help your business achieve similar results 
              and drive sustainable growth in your industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center group"
              >
                <span>Start Your Project</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 group"
              >
                <span>View All Case Studies</span>
                <FaExternalLinkAlt className="ml-2 text-sm group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCaseStudies;
