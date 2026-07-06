'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAnalytics } from '../hooks/useAnalytics';
import { apiPost } from '../utils/api';
import {
  FaUser,
  FaClock,
  FaComments,
  FaCheckCircle,
  FaArrowRight,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';

/** Reads ?service= from URL without suspending the parent page (keeps H1 in initial HTML). */
function ServiceQueryPrefill({ onService }) {
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams?.get('service')
    ? decodeURIComponent(searchParams.get('service'))
    : '';

  useEffect(() => {
    if (serviceFromUrl) {
      onService(serviceFromUrl);
    }
  }, [serviceFromUrl, onService]);

  return null;
}

const inputClasses =
  'w-full px-4 py-3 border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1220] focus:ring-1 focus:ring-[#0B1220] transition-colors';

const labelClasses = 'block text-sm font-semibold text-[#0B1220] mb-2';

const ScheduleConsultation = () => {
  const router = useRouter();
  const { trackContactFormSubmission, trackLeadGeneration } = useAnalytics();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const applyServiceFromUrl = useCallback((service) => {
    setFormData((prev) => ({ ...prev, service }));
  }, []);

  const services = [
    'Data & Analytics',
    'Business Intelligence',
    'Data Analytics',
    'Predictive Analytics',
    'Performance Tracking',
    'Custom Dashboards',
    'Earned Media',
    'Paid Media',
    'Google Ads',
    'Social Media Ads',
    'Display Advertising',
    'Video Advertising',
    'Retargeting Campaigns',
    'Creative',
    'Brand Design',
    'UI/UX Design',
    'Graphic Design',
    'Video Production',
    'Content Creation',
    'Business Tools',
    'SEO Tools & Analytics',
    'Process Automation',
    'Custom Applications',
    'Performance Optimization',
    'Cloud Solutions',
    'ICT Strategy'
  ];

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
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
    setIsSubmitting(true);
    setError('');
    setIsSubmitted(false);

    try {
      // Format data for API
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const subject = formData.service
        ? `Consultation Request - ${formData.service}`
        : 'Consultation Request';

      // Build message with consultation details
      let message = formData.message || '';
      if (formData.preferredDate || formData.preferredTime) {
        message += '\n\n--- Consultation Preferences ---\n';
        if (formData.preferredDate) {
          message += `Preferred Date: ${new Date(formData.preferredDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}\n`;
        }
        if (formData.preferredTime) {
          message += `Preferred Time: ${formData.preferredTime}\n`;
        }
      }
      if (!message.trim()) {
        message = 'I would like to schedule a consultation to discuss my business needs.';
      }

      const response = await apiPost('/api/contact/submit', {
        name,
        email: formData.email,
        phone: formData.phone || '',
        company: formData.company || '',
        subject,
        message: message.trim(),
        type: 'consultation',
        service: formData.service || '',
        budget: 'not_specified',
        timeline: 'not_specified'
      });

      if (response.data.success) {
        // Store submitted data for success message
        setSubmittedData({ ...formData });
        setIsSubmitted(true);

        // Track analytics events
        trackContactFormSubmission('consultation');
        trackLeadGeneration('consultation', null);

        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: '',
          preferredDate: '',
          preferredTime: ''
        });
      }
    } catch (error) {
      console.error('Consultation submission error:', error);

      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors.map(err => err.message).join(', ');
        setError(validationErrors);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const expectations = [
    {
      title: 'Expert consultation',
      description: 'Speak with practitioners who work on live strategy, platform, and growth programs — not generic account handoffs.'
    },
    {
      title: 'Flexible scheduling',
      description: 'Choose a time that works across time zones. We confirm by email and send a calendar invite with video link details.'
    },
    {
      title: 'Structured assessment',
      description: 'Receive a review of your goals, current stack, and realistic options — including quick wins and longer-term investments.'
    },
    {
      title: 'No obligation',
      description: 'The session is complimentary. You decide whether to proceed with a proposal, pilot, or internal follow-up on your own.'
    }
  ];

  if (isSubmitted) {
    const formatDate = (d) =>
      d
        ? new Date(d).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Not specified';

    return (
      <section className="bg-[#F8FAFC] py-20 lg:py-28">
        <div className="container-custom max-w-3xl">
          <div className="border border-slate-200/80 bg-white p-8 sm:p-12 text-center">
            <FaCheckCircle className="mx-auto text-4xl text-emerald-500 mb-5" aria-hidden />
            <h2 className="font-nexa-heavy text-2xl sm:text-3xl tracking-tight text-[#0B1220] mb-3">
              Consultation request received
            </h2>
            <p className="text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto">
              Thank you for scheduling a consultation with us. We&apos;ll be in touch within
              one business day to confirm your appointment or suggest an alternative time.
            </p>

            {submittedData && (
              <dl className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 border-y border-slate-200/80 py-8 text-left">
                {[
                  ['Name', `${submittedData.firstName} ${submittedData.lastName}`],
                  ['Service', submittedData.service || 'Not specified'],
                  ['Preferred date', formatDate(submittedData.preferredDate)],
                  ['Preferred time', submittedData.preferredTime || 'Not specified'],
                  ['Email', submittedData.email],
                  ['Phone', submittedData.phone || 'Not provided'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {label}
                    </dt>
                    <dd className="mt-1 font-medium text-[#0B1220] break-words">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#0B1220] text-white font-semibold text-sm tracking-tight hover:bg-primary-800 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <ServiceQueryPrefill onService={applyServiceFromUrl} />
      </Suspense>

      <section className="bg-[#F8FAFC] py-16 lg:py-24">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

            {/* Left: what to expect */}
            <aside className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-5">
                <span className="block h-px w-8 bg-[#e0ae00]" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                  What to Expect
                </span>
              </div>
              <h2 className="font-nexa-heavy text-2xl tracking-tight text-[#0B1220] mb-8">
                A working session, not a sales pitch
              </h2>

              <ul className="divide-y divide-slate-200/80 border-y border-slate-200/80">
                {expectations.map((item) => (
                  <li key={item.title} className="py-5">
                    <p className="flex items-center gap-2.5 font-semibold text-[#0B1220] text-sm mb-1.5">
                      <FaCheckCircle className="text-[#e0ae00] shrink-0" aria-hidden />
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed pl-6">{item.description}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border border-slate-200/80 bg-white p-6">
                <div className="flex items-start gap-3">
                  <FaClock className="mt-1 text-[#e0ae00] shrink-0" aria-hidden />
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Sessions run 30–45 minutes by video or phone. We confirm every
                    request within one business day.
                  </p>
                </div>
              </div>
            </aside>

            {/* Right: booking form */}
            <div className="lg:col-span-8">
              <div className="border border-slate-200/80 bg-white">
                <div className="border-b border-slate-200/80 px-6 pt-6 pb-5 sm:px-8">
                  <h2 className="font-nexa-heavy text-xl tracking-tight text-[#0B1220]">
                    Book your free consultation
                  </h2>
                  {formData.service ? (
                    <p className="mt-2 inline-flex items-center gap-2 border border-[#e0ae00]/50 bg-[#e0ae00]/10 px-3 py-1 text-xs font-semibold text-[#0B1220]">
                      Service: {formData.service}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">
                      Tell us when works for you — we&apos;ll confirm within one business day.
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8">
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
                      <label className={labelClasses}>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className={inputClasses}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={inputClasses}
                        placeholder="Last name"
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
                      <label className={labelClasses}>Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Service of Interest *</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className={inputClasses}
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                        {/* Allow custom service from URL if not in list (set via ServiceQueryPrefill) */}
                        {formData.service && !services.includes(formData.service) && (
                          <option value={formData.service}>{formData.service}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}>Preferred Date *</label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Preferred Time (EAT) *</label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        required
                        className={inputClasses}
                      >
                        <option value="">Select a time slot</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className={labelClasses}>Additional Information</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className={`${inputClasses} resize-none`}
                      placeholder="Tell us about your business needs, challenges, or any specific questions you have..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#e0ae00] text-[#0B1220] font-semibold text-sm tracking-tight hover:bg-[#c99d00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" aria-hidden />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          Schedule Consultation
                          <FaArrowRight className="text-xs" aria-hidden />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-500">
                      Free and confidential. Your details are only used to arrange this session.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ScheduleConsultation;
