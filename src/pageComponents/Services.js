'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaCloud,
  FaCogs,
  FaArrowRight,
  FaCheck,
  FaBullhorn,
  FaChartBar,
  FaPalette,
  FaNewspaper,
  FaBrain,
  FaCode,
} from 'react-icons/fa';

const services = [
  {
    id: 'data-analytics',
    title: 'Data & Analytics',
    subtitle: 'Transform data into strategic insights',
    description:
      'Unlock the power of your data with advanced analytics, AI-powered insights, and predictive modeling that drive smarter decisions across the business.',
    icon: FaChartBar,
    link: '/services/data-analytics',
    features: [
      'Business Intelligence & Dashboards',
      'Predictive Analytics & Machine Learning',
      'Data Visualization & Reporting',
      'Performance Tracking & KPIs',
    ],
  },
  {
    id: 'paid-media',
    title: 'Paid Media & Advertising',
    subtitle: 'Maximize ROI with strategic campaigns',
    description:
      'Drive targeted traffic and conversions with data-driven campaigns across Google, social media, and display networks — with every dollar tracked.',
    icon: FaBullhorn,
    link: '/services/paid-media',
    features: [
      'Google Ads Management & Optimization',
      'Social Media Advertising (Meta, LinkedIn, TikTok)',
      'Retargeting & Remarketing Strategies',
      'Conversion Rate Optimization',
    ],
  },
  {
    id: 'earned-media',
    title: 'Earned Media & PR',
    subtitle: 'Build authentic brand trust',
    description:
      'Cultivate authentic brand relationships through strategic PR, influencer partnerships, and content that drives sustainable, long-term growth.',
    icon: FaNewspaper,
    link: '/services/earned-media',
    features: [
      'Public Relations & Media Relations',
      'Content Marketing Strategy',
      'Social Media Management',
      'Thought Leadership Development',
    ],
  },
  {
    id: 'creative',
    title: 'Creative Services',
    subtitle: 'Visual experiences that captivate and convert',
    description:
      'From brand identity to video production, we craft visual experiences that resonate with audiences and turn attention into action.',
    icon: FaPalette,
    link: '/services/creative',
    features: [
      'Brand Design & Identity Development',
      'UI/UX Design & User Experience',
      'Video Production & Animation',
      'Content Creation & Copywriting',
    ],
  },
  {
    id: 'business-tools',
    title: 'Business Tools & Automation',
    subtitle: 'Streamline operations and maximize efficiency',
    description:
      'Transform your operations with intelligent automation, custom applications, and data-driven tooling that eliminates bottlenecks.',
    icon: FaCogs,
    link: '/services/business-tools',
    features: [
      'Process Automation & Workflows',
      'Custom Application Development',
      'CRM & System Integration',
      'Business Intelligence Solutions',
    ],
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions & Infrastructure',
    subtitle: 'Scale with confidence and security',
    description:
      'Secure, scalable, and cost-effective cloud infrastructure that enables your business to operate efficiently and scale seamlessly.',
    icon: FaCloud,
    link: '/services/cloud-solutions',
    features: [
      'Cloud Migration & Strategy',
      'Cloud Security & Compliance',
      'Backup & Disaster Recovery',
      '24/7 Monitoring & Support',
    ],
  },
  {
    id: 'ict-strategy',
    title: 'ICT & AI Strategy',
    subtitle: 'Strategic technology leadership',
    description:
      'Comprehensive ICT and AI strategies that align technology with business goals, ensure compliance, and drive sustainable transformation.',
    icon: FaBrain,
    link: '/services/ict-strategy',
    features: [
      'AI Strategy & Governance Frameworks',
      'Digital Transformation Roadmaps',
      'Cybersecurity Policy & Frameworks',
      'Technology Assessment & Audits',
    ],
  },
  {
    id: 'custom-development',
    title: 'Custom Software Development',
    subtitle: 'Tailored solutions for your business',
    description:
      'Enterprise-grade software built around your workflows — from web apps to mobile platforms, delivered with consulting-grade rigour.',
    icon: FaCode,
    link: '/services/business-tools/custom-applications',
    features: [
      'Custom Web Applications',
      'Mobile App Development (iOS & Android)',
      'API Development & Integration',
      'Legacy System Modernization',
    ],
  },
];

const stats = [
  { number: '50+', label: 'Clients Served' },
  { number: '8+', label: 'Countries' },
  { number: '95%', label: 'Client Retention' },
  { number: '24/7', label: 'Support Available' },
];

const Services = () => {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-[#0B1220] pt-32 pb-16 md:pt-40 md:pb-20"
        aria-labelledby="services-heading"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_40%,rgba(48,54,97,0.6)_0%,transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e0ae00]/30 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-8 bg-[#e0ae00]" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#e0ae00]">
                Services
              </span>
            </div>
            <h1
              id="services-heading"
              className="font-nexa-heavy text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-white mb-5"
            >
              End-to-end capability, one accountable partner
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              From digital marketing to cloud infrastructure, we provide the strategy
              and delivery that drive growth, efficiency, and competitive advantage.
            </p>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8 max-w-3xl">
            {stats.map(({ number, label }) => (
              <div key={label}>
                <p className="font-nexa-heavy text-2xl sm:text-3xl text-white tracking-tight">{number}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="bg-[#F8FAFC] py-20 lg:py-28" aria-label="Our services">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {services.map((service) => (
              <article
                key={service.id}
                className="group flex flex-col bg-white border border-slate-200/80 p-8 lg:p-10 hover:border-[#0B1220] transition-colors"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#0B1220]">
                    <service.icon className="text-xl text-[#e0ae00]" aria-hidden />
                  </div>
                  <span
                    className="h-0.5 w-8 bg-[#e0ae00] opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden
                  />
                </div>

                <h2 className="font-nexa-heavy text-xl tracking-tight text-[#0B1220] mb-1.5">
                  {service.title}
                </h2>
                <p className="text-sm font-semibold text-primary-600 mb-4">{service.subtitle}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{service.description}</p>

                <ul className="space-y-2.5 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <FaCheck className="text-[#e0ae00] mt-1 shrink-0 text-xs" aria-hidden />
                      <span className="text-sm text-slate-600 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-slate-100">
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:text-primary-600 transition-colors"
                  >
                    Explore {service.title}
                    <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" aria-hidden />
                  </Link>
                  <Link
                    href={`/schedule-consultation?service=${encodeURIComponent(service.title)}`}
                    className="text-sm font-semibold text-slate-500 hover:text-[#0B1220] transition-colors"
                  >
                    Schedule a consultation
                  </Link>
                </div>
              </article>
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
                Need a custom solution?
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Every business is unique. Let&apos;s create a tailored solution that fits
                your needs and drives measurable results.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/schedule-consultation"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#e0ae00] text-[#0B1220] font-semibold text-sm tracking-tight hover:bg-[#c99d00] transition-colors"
              >
                Schedule Free Consultation
                <FaArrowRight className="text-xs" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-white/20 text-white font-semibold text-sm tracking-tight hover:border-white/40 transition-colors"
              >
                Get a Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
