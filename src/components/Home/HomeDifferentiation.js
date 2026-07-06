'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const points = [
  {
    num: '01',
    title: 'Strategic, Not Just Technical',
    body: 'Every decision is anchored to a business outcome — revenue, efficiency, or competitive advantage — not just feature delivery.',
  },
  {
    num: '02',
    title: 'One Partner Across Disciplines',
    body: 'Strategy, design, technology, and operations under one roof. No fragmented vendors, no coordination gaps, one clear line of accountability.',
  },
  {
    num: '03',
    title: 'Built to Scale With You',
    body: 'Our infrastructure, tooling, and processes are architected to grow alongside your business — without the cost of rebuilding from scratch.',
  },
  {
    num: '04',
    title: 'Consulting-Grade Execution',
    body: 'Scoped engagements, documented decisions, structured review cycles. We operate with the rigour your stakeholders expect.',
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomeDifferentiation() {
  return (
    <section
      className="bg-[#F8FAFC] border-y border-slate-200/80 py-20 lg:py-28"
      aria-labelledby="why-heading"
    >
      <div className="container-custom">
        {/* ── Header row ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 lg:mb-16"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="lg:col-span-7">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                Why Skyfalke
              </span>
            </motion.div>

            <motion.h2
              id="why-heading"
              variants={fadeUp}
              className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-[#0B1220]"
            >
              The difference that shows
              <br className="hidden sm:block" />
              {' '}up in your results
            </motion.h2>
          </div>

          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 flex flex-col justify-end gap-6"
          >
            <p className="text-base text-slate-500 leading-relaxed">
              Most firms hand you a report. We hand you a running system — built,
              integrated, and accountable from strategy through to delivery.
            </p>
            <Link
              href="/how-we-work"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:text-primary-600 transition-colors self-start"
            >
              How we work
              <FaArrowRight className="text-[10px]" aria-hidden />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Points grid ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border-t border-l border-slate-200/80 bg-white"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {points.map(({ num, title, body }) => (
            <motion.div
              key={num}
              variants={fadeUp}
              className="group relative border-b border-r border-slate-200/80 p-8 lg:p-9 hover:bg-[#0B1220] transition-colors duration-300"
            >
              {/* Gold accent bar */}
              <span
                className="absolute top-0 left-0 h-0.5 w-0 bg-[#e0ae00] group-hover:w-full transition-all duration-500"
                aria-hidden
              />

              <p className="font-nexa-heavy text-3xl text-slate-200 group-hover:text-[#e0ae00]/40 transition-colors mb-8">
                {num}
              </p>

              <p className="font-semibold text-[#0B1220] group-hover:text-white text-base leading-snug mb-3 transition-colors">
                {title}
              </p>
              <p className="text-sm text-slate-500 group-hover:text-slate-300 leading-relaxed transition-colors">
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Outcome strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 border border-t-0 border-slate-200/80 bg-white px-8 py-6"
        >
          <div className="h-10 w-10 flex items-center justify-center bg-[#303661] shrink-0">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-white" aria-hidden>
              <path d="M3 13l4-4 3 3 4-5 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">
              Average client outcome
            </p>
            <p className="text-base font-nexa-heavy text-[#0B1220] mt-0.5">
              3× faster go-to-market vs. multi-vendor model
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
