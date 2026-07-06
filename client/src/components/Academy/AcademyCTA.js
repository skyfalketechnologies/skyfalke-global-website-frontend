import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const AcademyCTA = () => {
  return (
    <section className="bg-[#0B1220] py-16 lg:py-20">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="font-nexa-heavy text-2xl sm:text-3xl tracking-tight text-white mb-3">
              Start your learning journey today
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Choose from our range of practitioner-built courses and start building
              the skills you need for tomorrow&apos;s digital workplace.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/academy/courses"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#e0ae00] text-[#0B1220] font-semibold text-sm tracking-tight hover:bg-[#c99d00] transition-colors"
            >
              Browse All Courses
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/academy/join"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-white/20 text-white font-semibold text-sm tracking-tight hover:border-white/40 transition-colors"
            >
              Enroll Now
            </Link>
          </div>
        </div>

        {/* Guidance strip */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 border-t border-white/10 pt-8">
          <p className="text-sm text-slate-400">
            Need help choosing the right course? Our education consultants can help you
            find the best fit for your career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 shrink-0">
            <a
              href="mailto:academy@skyfalke.com"
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-white hover:text-[#e0ae00] transition-colors"
            >
              <FaEnvelope className="text-[#e0ae00]" aria-hidden />
              academy@skyfalke.com
            </a>
            <a
              href="tel:+254717797238"
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-white hover:text-[#e0ae00] transition-colors"
            >
              <FaPhone className="text-[#e0ae00]" aria-hidden />
              +254 717 797 238
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyCTA;
