'use client';

import React from 'react';
import { motion } from 'framer-motion';

const DIFFERENTIATION_IMAGE =
  'https://ik.imagekit.io/g3nahgeeu/why-customers-choose-skyfalke.jpg';

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
      className="bg-white border-y border-slate-200/80"
      aria-labelledby="why-heading"
    >
      <div className="container-custom max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* ── Left: content ── */}
          <motion.div
            className="py-16 lg:py-24 lg:pr-16 xl:pr-24"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* Section label */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span className="block h-px w-8 bg-[#e0ae00]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                Why Skyfalke
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              id="why-heading"
              variants={fadeUp}
              className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-[#0B1220] mb-5"
            >
              The difference that shows
              <br className="hidden sm:block" />
              {' '}up in your results
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-base text-slate-500 leading-relaxed max-w-md mb-12"
            >
              Most firms hand you a report. We hand you a running system — built, integrated,
              and accountable from strategy through to delivery.
            </motion.p>

            {/* Points */}
            <div className="space-y-0 divide-y divide-slate-100">
              {points.map(({ num, title, body }) => (
                <motion.div
                  key={num}
                  variants={fadeUp}
                  className="group flex gap-6 py-6 first:pt-0 last:pb-0"
                >
                  {/* Number */}
                  <span className="shrink-0 pt-0.5 text-[11px] font-semibold text-[#e0ae00] tracking-widest font-nexa-heavy">
                    {num}
                  </span>

                  {/* Text */}
                  <div>
                    <p className="font-semibold text-[#0B1220] text-base mb-1.5 group-hover:text-primary-600 transition-colors">
                      {title}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: image ── */}
          <motion.div
            className="relative hidden lg:flex items-stretch"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Vertical divider */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200/80" aria-hidden />

            <div className="relative w-full overflow-hidden">
              <img
                src={DIFFERENTIATION_IMAGE}
                alt="Strategic leadership in business — a chess king on a board"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width={800}
                height={800}
              />
              {/* Subtle overlay so the image doesn't compete with the text */}
              <div className="absolute inset-0 bg-[#0B1220]/20" aria-hidden />

              {/* Floating stat card */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex items-center gap-4 bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-lg px-5 py-4">
                  <div className="h-10 w-10 flex items-center justify-center bg-[#303661] shrink-0">
                    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-white" aria-hidden>
                      <path d="M3 13l4-4 3 3 4-5 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">Average client outcome</p>
                    <p className="text-base font-nexa-heavy text-[#0B1220] mt-0.5">
                      3× faster go-to-market vs. multi-vendor model
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
