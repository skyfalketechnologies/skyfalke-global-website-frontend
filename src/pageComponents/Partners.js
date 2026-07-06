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
  FaArrowRight,
  FaCheckCircle,
  FaBuilding,
  FaCode,
  FaPalette,
  FaBullhorn,
  FaCloud,
  FaCogs,
  FaTimes,
  FaShareAlt,
} from 'react-icons/fa';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Partners = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitState, setSubmitState] = useState({ loading: false, success: false, error: '' });
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
    setSubmitState({ loading: true, success: false, error: '' });

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
        setSubmitState({ loading: false, success: true, error: '' });
      } else {
        setSubmitState({
          loading: false,
          success: false,
          error: data.message || 'There was an error submitting your application. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting partnership application:', error);
      setSubmitState({
        loading: false,
        success: false,
        error: 'There was an error submitting your application. Please try again.'
      });
    }
  };

  const openModal = (partnershipType = '') => {
    setSubmitState({ loading: false, success: false, error: '' });
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

  const processSteps = [
    {
      num: '01',
      title: 'Apply',
      body: 'Tell us about your organisation, your capabilities, and the type of partnership you have in mind.',
    },
    {
      num: '02',
      title: 'Alignment call',
      body: 'We review every application and schedule a call to explore fit, expectations, and commercial terms.',
    },
    {
      num: '03',
      title: 'Agreement & onboarding',
      body: 'A clear partnership agreement, defined engagement model, and access to the tools and materials you need.',
    },
    {
      num: '04',
      title: 'Deliver together',
      body: 'Structured collaboration on live engagements, with regular reviews to grow the relationship.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Partners | Skyfalke - Strategic Partnerships</title>
        <meta name="description" content="Join Skyfalke's partner network. Collaborate with leading technology companies, agencies, and professionals across Africa. Grow together with strategic partnerships." />
        <meta name="keywords" content="skyfalke partners, technology partnerships, business collaboration, africa tech partners, strategic alliances" />
        <link rel="canonical" href="https://skyfalke.com/partners" />
      </Helmet>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-[#0B1220] pt-32 pb-20 md:pt-40 md:pb-28"
        aria-labelledby="partners-heading"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_40%,rgba(48,54,97,0.6)_0%,transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e0ae00]/30 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span className="block h-px w-8 bg-[#e0ae00]" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#e0ae00]">
                Partnerships
              </span>
            </motion.div>

            <motion.h1
              id="partners-heading"
              variants={fadeUp}
              className="font-nexa-heavy text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-white mb-6"
            >
              Grow with one accountable partner at your side
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-10">
              We work with technology vendors, agencies, consultancies, and referral partners
              who share our standard of delivery. If your capabilities complement ours,
              we&apos;d like to hear from you.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => openModal()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#e0ae00] text-[#0B1220] font-semibold text-sm tracking-tight hover:bg-[#c99d00] transition-colors"
              >
                Become a Partner
                <FaArrowRight className="text-xs shrink-0" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('partnership-types')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 text-white font-semibold text-sm tracking-tight hover:border-white/40 hover:bg-white/[0.04] transition-colors"
              >
                Explore Partnership Models
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-white py-20 lg:py-28" aria-labelledby="benefits-heading">
        <div className="container-custom">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14"
          >
            <div className="lg:col-span-7">
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
                <span className="block h-px w-8 bg-[#e0ae00]" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                  Why Partner With Us
                </span>
              </motion.div>
              <motion.h2
                id="benefits-heading"
                variants={fadeUp}
                className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-[#0B1220]"
              >
                A partnership built on shared standards
              </motion.h2>
            </div>
            <motion.p
              variants={fadeUp}
              className="lg:col-span-5 flex items-end text-base text-slate-500 leading-relaxed"
            >
              We treat partners the way we treat clients — with clear expectations,
              structured collaboration, and accountability on both sides.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200/80"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeUp}
                className="border-b border-r border-slate-200/80 p-8"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-[#0B1220] mb-6">
                  <benefit.icon className="text-lg text-[#e0ae00]" aria-hidden />
                </div>
                <h3 className="font-semibold text-[#0B1220] text-base mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Partnership Types ── */}
      <section id="partnership-types" className="bg-[#F8FAFC] border-y border-slate-200/80 py-20 lg:py-28" aria-labelledby="types-heading">
        <div className="container-custom">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mb-14"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
              <span className="block h-px w-8 bg-[#e0ae00]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                Partnership Models
              </span>
            </motion.div>
            <motion.h2
              id="types-heading"
              variants={fadeUp}
              className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-[#0B1220] mb-4"
            >
              Find the model that fits your business
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base text-slate-500 leading-relaxed">
              We work with partners across industries and specialties. Each model has a
              defined engagement structure and clear mutual commitments.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {partnershipTypes.map((type) => (
              <div
                key={type.title}
                className="group flex flex-col bg-white border border-slate-200/80 p-8 hover:border-[#0B1220] transition-colors"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-[#0B1220] mb-6">
                  <type.icon className="text-lg text-[#e0ae00]" aria-hidden />
                </div>
                <h3 className="font-semibold text-[#0B1220] text-base mb-2">{type.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{type.description}</p>
                <ul className="space-y-2.5 mb-8">
                  {type.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5">
                      <FaCheckCircle className="text-[#e0ae00] mt-0.5 shrink-0 text-sm" aria-hidden />
                      <span className="text-sm text-slate-600 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openModal(type.title)}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:text-primary-600 transition-colors self-start"
                >
                  Apply for this model
                  <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How partnering works ── */}
      <section className="bg-white py-20 lg:py-28" aria-labelledby="process-heading">
        <div className="container-custom">
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-px w-8 bg-[#e0ae00]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                How It Works
              </span>
            </div>
            <h2
              id="process-heading"
              className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-[#0B1220]"
            >
              A structured path from application to delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border-t border-l border-slate-200/80">
            {processSteps.map(({ num, title, body }) => (
              <div key={num} className="border-b border-r border-slate-200/80 p-8">
                <p className="font-nexa-heavy text-3xl text-slate-200 mb-8">{num}</p>
                <p className="font-semibold text-[#0B1220] text-base mb-2">{title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0B1220] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-nexa-heavy text-2xl sm:text-3xl tracking-tight text-white mb-3">
                Ready to explore a partnership?
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Submit an application and we&apos;ll schedule an alignment call to
                discuss how we can deliver together.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openModal()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#e0ae00] text-[#0B1220] font-semibold text-sm tracking-tight hover:bg-[#c99d00] transition-colors"
              >
                Start Partnership Discussion
                <FaArrowRight className="text-xs" aria-hidden />
              </button>
              <Link
                href="/how-we-work/case-studies"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-white/20 text-white font-semibold text-sm tracking-tight hover:border-white/40 transition-colors"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="bg-white shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[#0B1220] text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaHandshake className="text-2xl text-[#e0ae00]" aria-hidden />
                    <div>
                      <h2 className="text-xl font-nexa-heavy tracking-tight">Partnership Application</h2>
                      <p className="text-sm text-slate-300">We review every application and respond within 5 business days</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {submitState.success ? (
                  <div className="py-12 text-center">
                    <FaCheckCircle className="mx-auto text-4xl text-emerald-500 mb-4" aria-hidden />
                    <h3 className="font-nexa-heavy text-xl text-[#0B1220] mb-2">Application received</h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      Thank you for your interest in partnering with Skyfalke. Our team will
                      review your application and get back to you within 5 business days.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-3 bg-[#0B1220] text-white font-semibold text-sm hover:bg-primary-800 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
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

                  {submitState.error && (
                    <p className="text-sm font-medium text-red-600">{submitState.error}</p>
                  )}

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
                      disabled={submitState.loading}
                      className="px-8 py-3 bg-[#0B1220] hover:bg-primary-800 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitState.loading ? 'Submitting…' : 'Submit Application'}
                    </button>
                  </div>
                </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Partners;
