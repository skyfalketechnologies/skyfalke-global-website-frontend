import React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const slugify = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/**
 * Shared layout for legal documents (Privacy Policy, Terms of Service).
 * Renders a numbered document with a sticky table of contents on desktop.
 */
const LegalPage = ({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
  notice = null,
  contactHeading,
  contactText,
  contactEmail,
  contactPhone = '+254 (0) 717 797 238',
  footNote = null,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0B1220] pt-32 pb-14 md:pt-40 md:pb-16">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_40%,rgba(48,54,97,0.6)_0%,transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e0ae00]/30 to-transparent" />
        </div>
        <div className="container-custom relative z-10 max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="block h-px w-8 bg-[#e0ae00]" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#e0ae00]">
              {eyebrow}
            </span>
          </div>
          <h1 className="font-nexa-heavy text-4xl sm:text-5xl leading-[1.08] tracking-tight text-white mb-5">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">{intro}</p>
          <p className="mt-6 text-sm text-slate-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* ── Document ── */}
      <section className="py-14 lg:py-20">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Table of contents */}
            <nav className="hidden lg:block lg:col-span-3" aria-label="Table of contents">
              <div className="sticky top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-4">
                  On this page
                </p>
                <ol className="space-y-2.5 border-l border-slate-200 pl-4">
                  {sections.map((section, i) => (
                    <li key={section.title}>
                      <a
                        href={`#${slugify(section.title)}`}
                        className="text-sm text-slate-600 hover:text-[#0B1220] transition-colors leading-snug block"
                      >
                        {i + 1}. {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            {/* Body */}
            <div className="lg:col-span-9">
              {notice && (
                <div className="mb-10 border-l-2 border-[#e0ae00] bg-white p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Important notice
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">{notice}</p>
                </div>
              )}

              <div className="border border-slate-200/80 bg-white px-7 py-2 sm:px-10 divide-y divide-slate-100">
                {sections.map((section, index) => (
                  <section
                    key={section.title}
                    id={slugify(section.title)}
                    className="py-8 scroll-mt-28"
                  >
                    <h2 className="flex items-baseline gap-3 font-nexa-heavy text-lg sm:text-xl tracking-tight text-[#0B1220] mb-5">
                      <span className="text-sm text-[#e0ae00]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.content.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-[0.55rem] block h-1 w-1 shrink-0 bg-[#e0ae00]" aria-hidden />
                          <p className="text-[0.95rem] text-slate-600 leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              {/* Contact */}
              <div className="mt-10 border border-slate-200/80 bg-white p-7 sm:p-10">
                <h2 className="font-nexa-heavy text-lg sm:text-xl tracking-tight text-[#0B1220] mb-3">
                  {contactHeading}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{contactText}</p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-3 text-sm font-semibold text-[#0B1220] hover:text-primary-600 transition-colors"
                  >
                    <FaEnvelope className="text-[#e0ae00]" aria-hidden />
                    {contactEmail}
                  </a>
                  <a
                    href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                    className="inline-flex items-center gap-3 text-sm font-semibold text-[#0B1220] hover:text-primary-600 transition-colors"
                  >
                    <FaPhone className="text-[#e0ae00]" aria-hidden />
                    {contactPhone}
                  </a>
                </div>
              </div>

              {footNote && (
                <p className="mt-10 text-center text-sm text-slate-500">{footNote}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;
