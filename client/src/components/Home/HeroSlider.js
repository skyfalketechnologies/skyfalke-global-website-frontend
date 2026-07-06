'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useStrategyCallModal } from '@/contexts/StrategyCallModalContext';
import HeroVisual from './HomeDashboardMockup';

const STATS = [
  { value: '50+', label: 'Clients Served' },
  { value: '8+', label: 'Countries' },
  { value: '95%', label: 'Client Retention' },
];

const CLIENTS = [
  {
    src: 'https://ik.imagekit.io/g3nahgeeu/customers/tc.webp?tr=w-120,f-auto,q-auto:good',
    alt: 'Talmar Computers',
  },
  {
    src: 'https://ik.imagekit.io/g3nahgeeu/customers/qm.png?tr=w-120,f-auto,q-auto:good',
    alt: 'Quickmart',
  },
  {
    src: 'https://ik.imagekit.io/g3nahgeeu/customers/te.png?tr=w-120,f-auto,q-auto:good',
    alt: 'Total Energies',
  },
  { src: '/images/customers/cfao.png', alt: 'CFAO Motors' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSlider() {
  const { openModal } = useStrategyCallModal();

  return (
    <section
      className="relative flex items-center min-h-[min(100vh,940px)] pt-24 pb-20 md:pt-32 md:pb-28 bg-white overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Left radial glow — illuminates the headline area */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_15%_50%,rgba(224,174,0,0.08)_0%,transparent_70%)]" />
        {/* Graph-paper grid: fine lines with heavier major lines every 5 cells */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              'linear-gradient(to right, rgba(100,116,139,0.07) 1px, transparent 1px)',
              'linear-gradient(to bottom, rgba(100,116,139,0.07) 1px, transparent 1px)',
              'linear-gradient(to right, rgba(100,116,139,0.13) 1px, transparent 1px)',
              'linear-gradient(to bottom, rgba(100,116,139,0.13) 1px, transparent 1px)',
            ].join(','),
            backgroundSize: '28px 28px, 28px 28px, 140px 140px, 140px 140px',
          }}
        />
        {/* Fade the grid out toward the right so the visual stays clean */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_40%,rgba(255,255,255,0.85)_100%)]" />
        {/* Soft white vignette at top and bottom edges */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
        {/* Gold accent line top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e0ae00]/30 to-transparent" />
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 xl:gap-16 items-center">

          {/* ════════════════ LEFT COLUMN ════════════════ */}
          <motion.div
            className="lg:col-span-6 xl:col-span-5"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Category label */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-7">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#e0ae00]">
                Digital Growth Partner
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              className="font-nexa-heavy text-[2.6rem] sm:text-5xl lg:text-[3.1rem] xl:text-[3.5rem] leading-[1.07] tracking-tight text-slate-900 mb-6"
            >
              Reinvent What&apos;s{' '}
              <span className="relative inline-block text-[#e0ae00]">
                Possible
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 8.5C22 2.5 42 2.5 62 8.5C82 14.5 102 14.5 122 8.5C142 2.5 162 2.5 182 8.5"
                    stroke="#e0ae00"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br className="hidden sm:block" />
              {' '}for Your Business
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-[1.05rem] text-slate-600 leading-relaxed max-w-[490px] mb-10"
            >
              We help ambitious organisations modernise technology, accelerate revenue,
              and operate at higher efficiency - with one accountable partner across
              strategy and delivery.
            </motion.p>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-3 gap-5 sm:gap-8 pb-10 mb-10 border-b border-slate-200"
            >
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-nexa-heavy text-slate-900 tracking-tight">
                    {value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                type="button"
                onClick={() => openModal({ intent: 'strategy' })}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#e0ae00] text-[#0B1220] font-semibold text-sm tracking-tight hover:bg-[#c99d00] active:bg-[#b38b00] transition-colors"
              >
                Talk to Our Team
                <FaArrowRight className="text-xs shrink-0" aria-hidden />
              </button>
              <Link
                href="/how-we-work"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-300 text-slate-900 font-semibold text-sm tracking-tight hover:border-slate-500 hover:bg-slate-50 transition-colors"
              >
                View Our Work
                <FaArrowRight className="text-xs shrink-0 opacity-50" aria-hidden />
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div variants={fadeUp} className="flex items-center gap-5 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase whitespace-nowrap">
                Trusted by
              </span>
              <div className="flex items-center gap-6 flex-wrap">
                {CLIENTS.map((c) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={c.alt}
                    src={c.src}
                    alt={c.alt}
                    height={22}
                    className="h-[22px] w-auto object-contain opacity-50 grayscale hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ════════════════ RIGHT COLUMN ════════════════ */}
          <motion.div
            className="lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <HeroVisual />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
