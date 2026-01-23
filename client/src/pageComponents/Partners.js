'use client';

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FaHandshake,
  FaRocket,
  FaUsers,
  FaChartLine,
  FaGlobe,
  FaLightbulb,
  FaShieldAlt,
  FaAward,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaBuilding,
  FaCode,
  FaPalette,
  FaBullhorn,
  FaCloud,
  FaCogs,
  FaTimes,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaGlobeAfrica,
  FaIndustry,
  FaUsersCog,
  FaHandshakeAlt,
  FaShareAlt,
  FaChartBar,
  FaNetworkWired
} from 'react-icons/fa';

const Partners = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    partnershipType: '',
    companySize: '',
    description: '',
    referralSource: '',
    referralDetails: ''
  });

  const partnershipTypes = [
    {
      icon: FaBuilding,
      title: "Technology Partners",
      description: "Software companies, cloud providers, and technology vendors",
      benefits: [
        "Joint product development",
        "Co-marketing opportunities",
        "Technical integration support",
        "Revenue sharing programs"
      ],
      color: "bg-primary-600"
    },
    {
      icon: FaCode,
      title: "Development Partners",
      description: "Agencies, freelancers, and development teams",
      benefits: [
        "Project collaboration",
        "Resource sharing",
        "Skill development",
        "Referral programs"
      ],
      color: "bg-secondary-500"
    },
    {
      icon: FaPalette,
      title: "Creative Partners",
      description: "Design agencies, content creators, and marketing specialists",
      benefits: [
        "Creative collaboration",
        "Portfolio expansion",
        "Client referrals",
        "Joint campaigns"
      ],
      color: "bg-accent-500"
    },
    {
      icon: FaBullhorn,
      title: "Marketing Partners",
      description: "Digital marketing agencies and advertising partners",
      benefits: [
        "Campaign collaboration",
        "Lead sharing",
        "Market expansion",
        "Brand partnerships"
      ],
      color: "bg-primary-700"
    },
    {
      icon: FaCloud,
      title: "Cloud & Infrastructure",
      description: "Cloud providers, hosting companies, and infrastructure partners",
      benefits: [
        "Infrastructure optimization",
        "Cost reduction programs",
        "Technical support",
        "Scalability solutions"
      ],
      color: "bg-secondary-600"
    },
    {
      icon: FaCogs,
      title: "Consulting Partners",
      description: "Business consultants, strategists, and advisory firms",
      benefits: [
        "Strategic collaboration",
        "Client referrals",
        "Knowledge sharing",
        "Joint consulting"
      ],
      color: "bg-accent-600"
    },
    {
      icon: FaShareAlt,
      title: "Referral Partners",
      description: "Businesses and individuals who refer clients to Skyfalke",
      benefits: [
        "Attractive commission structure",
        "Marketing support and materials",
        "Regular performance reviews",
        "Exclusive partner portal access"
      ],
      color: "bg-primary-800"
    }
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Consulting',
    'Marketing',
    'Creative Services',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const referralSources = [
    'Existing Partner',
    'Client Referral',
    'Industry Event',
    'Social Media',
    'Website',
    'Search Engine',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/partnerships/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          website: '',
          industry: '',
          partnershipType: '',
          companySize: '',
          description: '',
          referralSource: '',
          referralDetails: ''
        });
        
        // Close modal
        setIsModalOpen(false);
        setSelectedPartnership(null);
        
        // Show success message
        alert('Thank you for your partnership application! We will review it and get back to you soon.');
      } else {
        alert(data.message || 'There was an error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting partnership application:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };

  const openModal = (partnershipType = '') => {
    setSelectedPartnership(partnershipType);
    setFormData(prev => ({
      ...prev,
      partnershipType: partnershipType
    }));
    setIsModalOpen(true);
  };

  const benefits = [
    {
      icon: FaRocket,
      title: "Accelerated Growth",
      description: "Access new markets and opportunities through our extensive network"
    },
    {
      icon: FaUsers,
      title: "Expanded Reach",
      description: "Connect with our diverse client base across Africa and beyond"
    },
    {
      icon: FaChartLine,
      title: "Increased Revenue",
      description: "Benefit from our proven track record and client relationships"
    },
    {
      icon: FaGlobe,
      title: "Global Network",
      description: "Join our international network of technology professionals"
    },
    {
      icon: FaLightbulb,
      title: "Innovation Hub",
      description: "Collaborate on cutting-edge projects and emerging technologies"
    },
    {
      icon: FaShieldAlt,
      title: "Trusted Brand",
      description: "Leverage our reputation for quality and reliability"
    }
  ];

  const successStories = [
    {
      company: "TechFlow Solutions",
      industry: "Software Development",
      testimonial: "Partnering with Skyfalke has opened up new markets for us and increased our revenue by 300%.",
      author: "Sarah Johnson, CEO",
      results: "+300% Revenue"
    },
    {
      company: "CloudScale Africa",
      industry: "Cloud Infrastructure",
      testimonial: "The partnership has been transformative. We've expanded to 5 new countries in just 18 months.",
      author: "Michael Ochieng, Founder",
      results: "5 New Markets"
    },
    {
      company: "DigitalCraft Agency",
      industry: "Creative Design",
      testimonial: "Skyfalke's network and expertise have helped us deliver projects we never thought possible.",
      author: "Amina Hassan, Creative Director",
      results: "+150% Projects"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Partners - You + Skyfalke | Strategic Partnerships</title>
        <meta name="description" content="Join Skyfalke's partner network. Collaborate with leading technology companies, agencies, and professionals across Africa. Grow together with strategic partnerships." />
        <meta name="keywords" content="skyfalke partners, technology partnerships, business collaboration, africa tech partners, strategic alliances" />
        <link rel="canonical" href="https://skyfalke.com/partners" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Partnership collaboration and growth"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-800/80"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-400 to-accent-500"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <FaHandshake className="text-6xl mx-auto text-secondary-400 mb-4" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              You + Skyfalke
              <span className="block text-secondary-400 mt-2">
                = Success Together
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto"
            >
              Join our network of strategic partners and unlock new opportunities for growth, 
              innovation, and market expansion across Africa.
            </motion.p>
                         <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="flex flex-col sm:flex-row gap-4 justify-center"
             >
               <motion.button
                 onClick={() => openModal()}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="bg-secondary-500 text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-colors flex items-center gap-2"
               >
                 Become a Partner
                 <FaArrowRight className="text-sm" />
               </motion.button>
               <motion.button
                 onClick={() => {
                   document.getElementById('partnership-types').scrollIntoView({ 
                     behavior: 'smooth' 
                   });
                 }}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-800 transition-colors"
               >
                 Explore Opportunities
               </motion.button>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Partner With
              <span className="text-gradient block mt-2">Skyfalke?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a network of successful partners who have transformed their businesses 
              through strategic collaboration and mutual growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl hover:bg-secondary-50 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types Section */}
      <section id="partnership-types" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partnership
              <span className="text-gradient block mt-2">Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with a diverse range of partners across different industries and specialties. 
              Find the perfect partnership type for your business.
            </p>
          </motion.div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {partnershipTypes.map((type, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: index * 0.1 }}
                 className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer"
                 onClick={() => openModal(type.title)}
               >
                 <div className="p-6">
                   <div className={`w-16 h-16 ${type.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                     <type.icon className="text-2xl text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                     {type.title}
                   </h3>
                   <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                     {type.description}
                   </p>
                   <div className="space-y-3">
                     {type.benefits.map((benefit, benefitIndex) => (
                       <div key={benefitIndex} className="flex items-start">
                         <FaCheckCircle className="text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                         <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                       </div>
                     ))}
                   </div>
                   <div className="mt-6 pt-4 border-t border-gray-100">
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         openModal(type.title);
                       }}
                       className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300"
                     >
                       Learn More
                       <FaArrowRight className="ml-2 text-xs" />
                     </button>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partner
              <span className="text-gradient block mt-2">Success Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our partners have achieved remarkable growth and success through collaboration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl hover:bg-secondary-50 transition-colors duration-300"
              >
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 text-xl mr-2" />
                  <span className="text-sm font-semibold text-gray-600">{story.industry}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{story.company}</h3>
                <p className="text-gray-600 mb-6 italic">"{story.testimonial}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">— {story.author}</span>
                  <span className="text-lg font-bold text-primary-600">{story.results}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Partner With Us?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join our network of successful partners and start your journey towards 
              mutual growth and success. Let's build something amazing together.
            </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <motion.button
                 onClick={() => openModal()}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="bg-white text-primary-800 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
               >
                 Start Partnership Discussion
                 <FaArrowRight className="text-sm" />
               </motion.button>
               <Link href="/case-studies">
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-800 transition-colors"
                 >
                   View Success Stories
                 </motion.button>
               </Link>
             </div>
          </motion.div>
                 </div>
       </section>

       {/* Partnership Application Modal */}
       <AnimatePresence>
         {isModalOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
             onClick={() => setIsModalOpen(false)}
           >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}
             >
               {/* Modal Header */}
               <div className="bg-primary-600 text-white p-6 rounded-t-2xl">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <FaHandshake className="text-2xl" />
                     <div>
                       <h2 className="text-2xl font-bold">Partnership Application</h2>
                       <p className="text-primary-100">Join our network of successful partners</p>
                     </div>
                   </div>
                   <button
                     onClick={() => setIsModalOpen(false)}
                     className="text-white hover:text-gray-200 transition-colors"
                   >
                     <FaTimes className="text-xl" />
                   </button>
                 </div>
               </div>

               {/* Modal Content */}
               <div className="p-6">
                 <form onSubmit={handleSubmit} className="space-y-6">
                   {/* Company Information */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Company Name *
                       </label>
                       <input
                         type="text"
                         name="companyName"
                         value={formData.companyName}
                         onChange={handleInputChange}
                         required
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder="Your company name"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Contact Person *
                       </label>
                       <input
                         type="text"
                         name="contactName"
                         value={formData.contactName}
                         onChange={handleInputChange}
                         required
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder="Full name"
                       />
                     </div>
                   </div>

                   {/* Contact Information */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Email Address *
                       </label>
                       <input
                         type="email"
                         name="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         required
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder="your@email.com"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Phone Number
                       </label>
                       <input
                         type="tel"
                         name="phone"
                         value={formData.phone}
                         onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder="+254 712 345 678"
                       />
                     </div>
                   </div>

                   {/* Website and Industry */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Website
                       </label>
                       <input
                         type="url"
                         name="website"
                         value={formData.website}
                         onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder="https://yourcompany.com"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Industry *
                       </label>
                       <select
                         name="industry"
                         value={formData.industry}
                         onChange={handleInputChange}
                         required
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                       >
                         <option value="">Select your industry</option>
                         {industries.map((industry) => (
                           <option key={industry} value={industry}>
                             {industry}
                           </option>
                         ))}
                       </select>
                     </div>
                   </div>

                   {/* Partnership Type and Company Size */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Partnership Type *
                       </label>
                       <select
                         name="partnershipType"
                         value={formData.partnershipType}
                         onChange={handleInputChange}
                         required
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                       >
                         <option value="">Select partnership type</option>
                         {partnershipTypes.map((type) => (
                           <option key={type.title} value={type.title}>
                             {type.title}
                           </option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Company Size
                       </label>
                       <select
                         name="companySize"
                         value={formData.companySize}
                         onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                       >
                         <option value="">Select company size</option>
                         {companySizes.map((size) => (
                           <option key={size} value={size}>
                             {size}
                           </option>
                         ))}
                       </select>
                     </div>
                   </div>

                   {/* Referral Information */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         How did you hear about us?
                       </label>
                       <select
                         name="referralSource"
                         value={formData.referralSource}
                         onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                       >
                         <option value="">Select referral source</option>
                         {referralSources.map((source) => (
                           <option key={source} value={source}>
                             {source}
                           </option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Referral Details
                       </label>
                       <input
                         type="text"
                         name="referralDetails"
                         value={formData.referralDetails}
                         onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder="Name of referrer or additional details"
                       />
                     </div>
                   </div>

                   {/* Company Description */}
                   <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">
                       Tell us about your company and partnership goals *
                     </label>
                     <textarea
                       name="description"
                       value={formData.description}
                       onChange={handleInputChange}
                       required
                       rows="4"
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                       placeholder="Describe your company, services, and how you envision partnering with Skyfalke..."
                     ></textarea>
                   </div>

                   {/* Submit Button */}
                   <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                     <button
                       type="button"
                       onClick={() => setIsModalOpen(false)}
                       className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                     >
                       <FaUserPlus className="text-sm" />
                       <span>Submit Application</span>
                     </button>
                   </div>
                 </form>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </>
   );
 };

export default Partners;
