import React from 'react';
import Link from 'next/link';

const STATS = [
  { value: 'ICT · AI · Cloud', label: 'Practical course tracks' },
  { value: 'Trainer-guided', label: 'Live sessions and mentorship' },
  { value: 'Certified', label: 'Certificates on completion' },
];

const AcademyHero = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#0B1220] pt-32 pb-16 md:pt-40 md:pb-20"
      aria-labelledby="academy-heading"
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
              Skyfalke Academy
            </span>
          </div>

          <h1
            id="academy-heading"
            className="font-nexa-heavy text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-white mb-6"
          >
            Future-ready digital skills, taught by practitioners
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-10">
            Hands-on, trainer-guided courses in Data Science, AI, Digital Transformation,
            and Cloud Innovation — built by the same team that delivers these capabilities
            for clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/academy/courses"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#e0ae00] text-[#0B1220] font-semibold text-sm tracking-tight hover:bg-[#c99d00] transition-colors"
            >
              Explore Courses
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/academy/join"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-white/20 text-white font-semibold text-sm tracking-tight hover:border-white/40 hover:bg-white/[0.04] transition-colors"
            >
              Enroll Now
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8 max-w-3xl">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="font-nexa-heavy text-lg sm:text-xl text-white tracking-tight">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademyHero;
