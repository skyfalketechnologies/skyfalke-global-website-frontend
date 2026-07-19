'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { apiPost } from '../utils/api';

const REPORT = {
  title: 'Your guide to the Gemini Enterprise app, an advanced agentic AI Platform',
  url: '/resources/reports/A_guide_to_workplace_transformation_with_the_Gemini_Enterprise_app.pdf',
  image:
    'https://ik.imagekit.io/g3nahgeeu/A%20guide%20to%20workspace%20transformation%20with%20Gemini%20enterprise.png',
  partnerLogo: 'https://ik.imagekit.io/g3nahgeeu/GC_Logo_FullColor_rgb.png',
};

const COUNTRIES = [
  'United States',
  'Kenya',
  'Nigeria',
  'South Africa',
  'Ghana',
  'Tanzania',
  'Uganda',
  'Rwanda',
  'Ethiopia',
  'Egypt',
  'Morocco',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Netherlands',
  'Spain',
  'Italy',
  'Sweden',
  'Switzerland',
  'United Arab Emirates',
  'Saudi Arabia',
  'India',
  'Singapore',
  'Japan',
  'China',
  'Australia',
  'New Zealand',
  'Brazil',
  'Mexico',
  'Other',
];

const EXPLORE_ITEMS = [
  {
    number: '01',
    title: 'Connect your data and systems',
    text: 'Tackle data silos by connecting AI agents to the data and tools your teams already use.',
  },
  {
    number: '02',
    title: 'Find and understand information faster',
    text: 'See how the Gemini Enterprise app helps your organization surface the right information at the right time.',
  },
  {
    number: '03',
    title: 'Build, use, and govern custom AI agents',
    text: 'Learn how to create and manage agents that automate workflows across your organization.',
  },
];

const INITIAL_FORM = {
  businessName: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  country: 'United States',
  jobTitle: '',
};

const FIELD_CLASS =
  'w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm';

const GeminiEnterpriseReportLanding = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startDownload = () => {
    const link = document.createElement('a');
    link.href = REPORT.url;
    link.download = '';
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiPost('/api/contact/submit', {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        company: formData.businessName,
        phone: formData.phone,
        type: 'contact',
        subject: `Report download: ${REPORT.title}`,
        message: `Requested the report "${REPORT.title}". Business name: ${formData.businessName}. Job title: ${formData.jobTitle}. Country: ${formData.country}. Business phone: ${formData.phone}.`,
      });

      if (response.data.success) {
        setSuccess(true);
        startDownload();
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else {
        setError('Unable to submit your details right now. Please try again shortly.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-primary-500 text-white">
        <div className="container-custom">
          <div className="max-w-3xl pt-32 pb-16 lg:pt-40 lg:pb-24">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="block w-10 h-[3px] bg-secondary-500" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-100">
                  Guide
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6"
              >
                Your guide to the Gemini Enterprise app, an advanced agentic AI Platform
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-primary-100 mb-10"
              >
                Build, use, and govern custom AI agents connected to your data and systems to tackle data
                silos and get better productivity and outcomes.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <a
                  href="#get-the-report"
                  className="inline-flex items-center gap-3 bg-secondary-500 text-primary-900 px-8 py-4 font-semibold hover:bg-secondary-400 transition-colors"
                >
                  Download now
                  <FaArrowRight className="text-sm" />
                </a>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Overview + explore items + form */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <motion.img
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                src={REPORT.image}
                alt={REPORT.title}
                className="w-full h-auto mb-10"
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="block w-10 h-[3px] bg-secondary-500" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  In partnership with
                </span>
                <img
                  src={REPORT.partnerLogo}
                  alt="Google Cloud"
                  className="h-6 w-auto"
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-500 tracking-tight mb-6">
                {REPORT.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-14">
                The shift from chatbots to AI agents will redefine productivity. This guide, from our
                partner Google Cloud, shows you how to implement an advanced agentic AI platform. You will
                learn how the Gemini Enterprise app helps you connect data, find information, and use and
                create agents to automate workflows across your organization.
              </p>

              <h3 className="text-xl font-bold text-primary-500 tracking-tight mb-8">
                Get your copy to explore:
              </h3>
              <div>
                {EXPLORE_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="flex gap-8 border-t border-gray-200 py-8"
                  >
                    <span className="text-3xl font-bold text-secondary-500 tracking-tight shrink-0">
                      {item.number}
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div
                id="get-the-report"
                className="bg-gray-50 border border-gray-200 p-8 md:p-10 lg:sticky lg:top-28 scroll-mt-28"
              >
                {success ? (
                  <div className="text-center py-8">
                    <FaCheckCircle className="mx-auto text-5xl text-green-600 mb-5" />
                    <h3 className="text-2xl font-bold text-primary-500 tracking-tight mb-3">Thank you</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Your download of <span className="font-semibold">{REPORT.title}</span> has started. If it
                      doesn&apos;t begin automatically,{' '}
                      <a
                        href={REPORT.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 font-semibold underline underline-offset-4"
                      >
                        click here
                      </a>
                      .
                    </p>
                    <Link
                      href="/resources"
                      className="inline-flex px-8 py-4 bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
                    >
                      Back to resources
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-primary-500 tracking-tight mb-8">Get the guide</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Business name<span className="text-red-600">*</span>
                        </label>
                        <input
                          id="businessName"
                          name="businessName"
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={handleChange}
                          className={FIELD_CLASS}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                            First name<span className="text-red-600">*</span>
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className={FIELD_CLASS}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Last name<span className="text-red-600">*</span>
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className={FIELD_CLASS}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Business phone<span className="text-red-600">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={FIELD_CLASS}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email address<span className="text-red-600">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={FIELD_CLASS}
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Country<span className="text-red-600">*</span>
                        </label>
                        <select
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          className={FIELD_CLASS}
                        >
                          {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Job title<span className="text-red-600">*</span>
                        </label>
                        <input
                          id="jobTitle"
                          name="jobTitle"
                          type="text"
                          required
                          value={formData.jobTitle}
                          onChange={handleChange}
                          className={FIELD_CLASS}
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-primary-500 text-white px-6 py-4 font-semibold hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Submitting…' : 'Download now'}
                        {!loading && <FaArrowRight className="text-sm" />}
                      </button>

                      <p className="text-xs text-gray-500 leading-relaxed">
                        <span className="text-red-600">*</span>Required Fields. We respect your privacy — see our{' '}
                        <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-700">
                          privacy policy
                        </Link>
                        .
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeminiEnterpriseReportLanding;
