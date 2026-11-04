import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQuoteLeft,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaLinkedin,
  FaChartLine,
  FaClock,
  FaGoogle,
  FaCheckCircle
} from 'react-icons/fa';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mwangi",
      position: "Marketing Director",
      company: "EcoTech Solutions Kenya",
      avatar: "/images/testimonials/sarah-mwangi.jpg",
      rating: 5,
      text: "Skyfalke transformed our digital presence completely. Their SEO strategies and Google Ads management increased our organic traffic by 400% and conversions by 250% in just 8 months. The team's expertise in the Kenyan market is exceptional.",
      results: ["400% Traffic Growth", "250% Conversion Increase", "8 Months Timeline"],
      linkedinUrl: "https://linkedin.com/in/sarah-mwangi",
      reviewDate: "2024-01-15",
      verified: true,
      googleReviewId: "ChIJN1t_tDeuEmsRUsoyG83frY4"
    },
    {
      id: 2,
      name: "David Ochieng",
      position: "CEO",
      company: "TechStart Africa",
      avatar: "/images/testimonials/david-ochieng.jpg",
      rating: 5,
      text: "The cloud migration project was flawless. Skyfalke's team provided 24/7 support throughout the process. We now enjoy 99.9% uptime with 60% reduced operational costs. Highly recommended for any business looking to scale.",
      results: ["99.9% Uptime", "60% Cost Reduction", "24/7 Support"],
      linkedinUrl: "https://linkedin.com/in/david-ochieng",
      reviewDate: "2024-02-03",
      verified: true,
      googleReviewId: "ChIJN1t_tDeuEmsRUsoyG83frY4"
    },
    {
      id: 3,
      name: "Grace Wanjiku",
      position: "Operations Manager",
      company: "Nairobi Manufacturing Ltd",
      avatar: "/images/testimonials/grace-wanjiku.jpg",
      rating: 5,
      text: "Skyfalke's business optimization tools revolutionized our operations. We now have real-time analytics and automated processes that improved our efficiency by 180%. The ROI was immediate and substantial.",
      results: ["180% Efficiency Gain", "Real-time Analytics", "Immediate ROI"],
      linkedinUrl: "https://linkedin.com/in/grace-wanjiku",
      reviewDate: "2024-01-28",
      verified: true,
      googleReviewId: "ChIJN1t_tDeuEmsRUsoyG83frY4"
    },
    {
      id: 4,
      name: "Michael Kiprop",
      position: "CTO",
      company: "FinTech Innovations Kenya",
      avatar: "/images/testimonials/michael-kiprop.jpg",
      rating: 5,
      text: "Outstanding service from start to finish. Skyfalke's cybersecurity solutions and compliance expertise helped us achieve ISO 27001 certification. Their team is professional, knowledgeable, and truly cares about client success.",
      results: ["ISO 27001 Certified", "Zero Security Breaches", "Full Compliance"],
      linkedinUrl: "https://linkedin.com/in/michael-kiprop",
      reviewDate: "2024-02-10",
      verified: true,
      googleReviewId: "ChIJN1t_tDeuEmsRUsoyG83frY4"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <FaGoogle className="text-4xl text-blue-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Google Reviews
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See what our clients say about Skyfalke's services. We're proud to maintain a 5-star rating with verified reviews from real businesses across Africa.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xl" />
              ))}
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">4.9/5</span>
            <span className="ml-2 text-gray-600">(127 verified reviews)</span>
          </div>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 group"
          >
            <FaChevronLeft className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 group"
          >
            <FaChevronRight className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </button>

          {/* Testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100"
            >
              {/* Google Review Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <FaGoogle className="text-blue-600 text-xl" />
                  <span className="text-sm font-medium text-gray-600">Google Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  {testimonials[currentTestimonial].verified && (
                    <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                      <FaCheckCircle className="text-green-600 text-xs" />
                      <span className="text-xs font-medium text-green-700">Verified</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    {formatDate(testimonials[currentTestimonial].reviewDate)}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg" />
                ))}
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>

              {/* Quote */}
              <div className="relative mb-8">
                <FaQuoteLeft className="text-blue-200 text-4xl absolute -top-2 -left-2" />
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed pl-8">
                  {testimonials[currentTestimonial].text}
                </p>
              </div>

              {/* Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {testimonials[currentTestimonial].results.map((result, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-blue-600">{result}</div>
                  </div>
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[currentTestimonial].position} at {testimonials[currentTestimonial].company}
                    </p>
                  </div>
                </div>
                <a
                  href={testimonials[currentTestimonial].linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* All Testimonials Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                index === currentTestimonial
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
              onClick={() => goToTestimonial(index)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === currentTestimonial ? 'bg-white/20' : 'bg-blue-100'
                }`}>
                  <span className={`font-bold ${
                    index === currentTestimonial ? 'text-white' : 'text-blue-600'
                  }`}>
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                  <p className={`text-xs ${
                    index === currentTestimonial ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xs" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Ready to join our satisfied clients?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Today
            <FaChevronRight className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
