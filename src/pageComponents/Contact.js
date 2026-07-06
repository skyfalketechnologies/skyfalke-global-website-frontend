'use client';

import React, { useState } from 'react';
import SEOHead from '../components/SEO/SEOHead';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaBuilding,
  FaUsers,
  FaHandshake,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import { apiPost } from '../utils/api';

const inputClasses =
  'w-full px-4 py-3 border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1220] focus:ring-1 focus:ring-[#0B1220] transition-colors';

const labelClasses = 'block text-sm font-semibold text-[#0B1220] mb-2';

const Contact = () => {
  const { trackContactFormSubmission, trackLeadGeneration } = useAnalytics();
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    service: '',
    budget: 'not_specified',
    timeline: 'not_specified'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await apiPost('/api/contact/submit', {
        ...formData,
        type: activeTab
      });

      if (response.data.success) {
        setSuccess(true);

        // Track analytics events
        trackContactFormSubmission(activeTab);
        trackLeadGeneration(activeTab, formData.budget !== 'not_specified' ? 100 : null);

        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          service: '',
          budget: 'not_specified',
          timeline: 'not_specified'
        });
      }
    } catch (error) {
      console.error('Contact submission error:', error);

      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      details: 'info@skyfalke.com',
      href: 'mailto:info@skyfalke.com',
      description: 'For general and project enquiries'
    },
    {
      icon: FaPhone,
      title: 'Phone',
      details: '+254 (0) 717 797 238',
      href: 'tel:+254717797238',
      description: 'Mon–Fri, 8:00 AM – 6:00 PM EAT'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Office',
      details: 'Nairobi, Kenya',
      href: 'https://maps.google.com/?q=Nairobi,Kenya',
      external: true,
      description: 'Serving clients across 8+ countries'
    },
    {
      icon: FaClock,
      title: 'Response time',
      details: 'Within 1 business day',
      description: 'Every enquiry gets a considered reply'
    }
  ];

  const services = [
    'Digital Marketing',
    'Cloud Solutions',
    'Business Tools',
    'Technology Consulting',
    'Web Development',
    'Mobile App Development',
    'Data Analytics',
    'AI & Machine Learning',
    'Cybersecurity',
    'Other'
  ];

  const budgets = [
    { value: 'under_10k', label: 'Under $10,000' },
    { value: '10k_25k', label: '$10,000 - $25,000' },
    { value: '25k_50k', label: '$25,000 - $50,000' },
    { value: '50k_100k', label: '$50,000 - $100,000' },
    { value: 'over_100k', label: 'Over $100,000' },
    { value: 'not_specified', label: 'Not specified' }
  ];

  const timelines = [
    { value: 'immediate', label: 'Immediate' },
    { value: '1_month', label: '1 Month' },
    { value: '3_months', label: '3 Months' },
    { value: '6_months', label: '6 Months' },
    { value: 'flexible', label: 'Flexible' },
    { value: 'not_specified', label: 'Not specified' }
  ];

  const tabs = [
    { id: 'contact', label: 'General Enquiry', icon: FaEnvelope },
    { id: 'hire_us', label: 'Hire Us', icon: FaUsers },
    { id: 'quote_request', label: 'Request a Quote', icon: FaBuilding },
    { id: 'partnership', label: 'Partnership', icon: FaHandshake }
  ];

  const faqs = [
    {
      question: 'How quickly can you start working on my project?',
      answer: 'We typically begin projects within 1-2 weeks of contract signing. For urgent projects, we can start immediately depending on our current capacity.'
    },
    {
      question: 'What is your typical project timeline?',
      answer: 'Project timelines vary based on complexity. Small projects take 2-4 weeks, medium projects 1-3 months, and large projects 3-6 months or more.'
    },
    {
      question: 'Do you work with international clients?',
      answer: 'Yes! We work with clients globally and have experience serving businesses across different time zones and cultures.'
    },
    {
      question: 'What payment terms do you offer?',
      answer: 'We offer flexible payment terms including milestone-based payments, monthly retainers, and project-based pricing. We accept various payment methods.'
    }
  ];

  return (
    <>
      <SEOHead
        skipBaseMeta
        pageType="contact"
        title="Contact Skyfalke - Get In Touch"
        description="Get in touch with Skyfalke for sustainable cloud solutions and digital marketing services. Free consultation available."
        keywords="contact skyfalke, get quote, consultation, support, customer service, digital marketing, cloud solutions"
        canonical="https://skyfalke.com/contact"
      />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-[#0B1220] pt-32 pb-16 md:pt-40 md:pb-20"
        aria-labelledby="contact-heading"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_40%,rgba(48,54,97,0.6)_0%,transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e0ae00]/30 to-transparent" />
        </div>

        <div className="container-custom relative z-10 max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="block h-px w-8 bg-[#e0ae00]" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#e0ae00]">
              Contact
            </span>
          </div>
          <h1
            id="contact-heading"
            className="font-nexa-heavy text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-white mb-5 max-w-3xl"
          >
            Let&apos;s talk about what you&apos;re building
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Tell us where you are and where you want to go. Every enquiry is read by
            a senior member of our team — and answered within one business day.
          </p>
        </div>
      </section>

      {/* ── Form + contact details ── */}
      <section className="bg-[#F8FAFC] border-b border-slate-200/80 py-16 lg:py-24">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

            {/* Left: contact details */}
            <aside className="lg:col-span-4">
              <h2 className="font-nexa-heavy text-2xl tracking-tight text-[#0B1220] mb-6">
                Reach us directly
              </h2>
              <ul className="divide-y divide-slate-200/80 border-y border-slate-200/80">
                {contactInfo.map((info) => (
                  <li key={info.title} className="flex gap-4 py-5">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#0B1220] shrink-0">
                      <info.icon className="text-[#e0ae00]" aria-hidden />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {info.title}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.external ? '_blank' : undefined}
                          rel={info.external ? 'noopener noreferrer' : undefined}
                          className="mt-0.5 block font-semibold text-[#0B1220] hover:text-primary-600 transition-colors"
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="mt-0.5 font-semibold text-[#0B1220]">{info.details}</p>
                      )}
                      <p className="mt-0.5 text-sm text-slate-500">{info.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border border-slate-200/80 bg-white p-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Prefer a scheduled conversation? Book a time that works for you and
                  we&apos;ll come prepared.
                </p>
                <a
                  href="/schedule-consultation"
                  className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-[#0B1220] text-white font-semibold text-sm tracking-tight hover:bg-primary-800 transition-colors"
                >
                  Schedule a Consultation
                </a>
              </div>
            </aside>

            {/* Right: form */}
            <div className="lg:col-span-8">
              <div className="border border-slate-200/80 bg-white">
                {/* Enquiry type */}
                <div className="border-b border-slate-200/80 px-6 pt-6 pb-5 sm:px-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
                    What is this regarding?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border ${
                          activeTab === tab.id
                            ? 'bg-[#0B1220] text-white border-[#0B1220]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <tab.icon className="text-xs" aria-hidden />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8">
                  {success && (
                    <div className="mb-8 flex items-start gap-3 border border-emerald-200 bg-emerald-50 p-4">
                      <FaCheckCircle className="mt-0.5 text-emerald-600 shrink-0" aria-hidden />
                      <div>
                        <p className="font-semibold text-emerald-800">Message sent</p>
                        <p className="text-sm text-emerald-700">
                          Thank you for reaching out. We&apos;ll respond within one business day.
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mb-8 flex items-start gap-3 border border-red-200 bg-red-50 p-4">
                      <FaTimesCircle className="mt-0.5 text-red-600 shrink-0" aria-hidden />
                      <div>
                        <p className="font-semibold text-red-800">Something went wrong</p>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className={labelClasses}>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={inputClasses}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Work Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={inputClasses}
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="+254 712 345 678"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className={labelClasses}>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={inputClasses}
                      placeholder="What's this about?"
                    />
                  </div>

                  {/* Service-specific fields */}
                  {(activeTab === 'hire_us' || activeTab === 'quote_request') && (
                    <div className="mb-6">
                      <label className={labelClasses}>Service of Interest</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className={inputClasses}
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeTab === 'hire_us' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className={labelClasses}>Budget Range</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className={inputClasses}
                        >
                          {budgets.map((budget) => (
                            <option key={budget.value} value={budget.value}>
                              {budget.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClasses}>Timeline</label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className={inputClasses}
                        >
                          {timelines.map((timeline) => (
                            <option key={timeline.value} value={timeline.value}>
                              {timeline.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <label className={labelClasses}>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className={`${inputClasses} resize-none`}
                      placeholder="Tell us more about your project or inquiry..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#e0ae00] text-[#0B1220] font-semibold text-sm tracking-tight hover:bg-[#c99d00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" aria-hidden />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                    <p className="text-xs text-slate-500">
                      Your details are only used to respond to this enquiry. See our{' '}
                      <a href="/privacy" className="underline hover:text-slate-700">privacy policy</a>.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-custom max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-px w-8 bg-[#e0ae00]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                FAQ
              </span>
            </div>
            <h2 className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] leading-[1.1] tracking-tight text-[#0B1220]">
              Common questions before working with us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-slate-200/80">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-r border-slate-200/80 p-8">
                <h3 className="font-semibold text-[#0B1220] text-base mb-3">{faq.question}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
