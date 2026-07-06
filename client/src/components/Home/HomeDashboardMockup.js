'use client';

import React from 'react';
import { motion } from 'framer-motion';

const CAPABILITIES = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <path d="M3 10h14M10 3l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    name: 'Digital Marketing & Growth',
    tag: 'SEO · Paid · Content',
    color: '#e0ae00',
    width: '88%',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <rect x="2" y="3" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 17h8M10 13v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    name: 'Cloud & Infrastructure',
    tag: 'Hosting · DevOps · Security',
    color: '#60a5fa',
    width: '78%',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <path d="M3 14l4-4 3 3 4-5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    name: 'Data Analytics & BI',
    tag: 'Dashboards · Reporting · AI',
    color: '#34d399',
    width: '72%',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <path d="M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM14 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    name: 'Business Automation',
    tag: 'CRM · Workflows · Integrations',
    color: '#a78bfa',
    width: '82%',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 8.5c0-1.66 1.34-3 3-3s3 1.34 3 3c0 1.5-1 2.5-2 3v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="10" cy="15.5" r="0.7" fill="currentColor"/>
      </svg>
    ),
    name: 'Creative & Brand',
    tag: 'Design · Video · Content',
    color: '#f87171',
    width: '75%',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.07 },
  }),
};

export default function HomeDashboardMockup() {
  return (
    <div className="relative w-full max-w-[520px] select-none">

      {/* ── Main capability panel ── */}
      <div
        className="rounded-sm border border-white/[0.09] bg-[#111827]/90 backdrop-blur-sm shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
        role="img"
        aria-label="Skyfalke practice areas: Digital Marketing, Cloud, Data Analytics, Business Automation, and Creative services."
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="block w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="block w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="block w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-500">
            Practice Areas
          </p>
          <div className="flex items-center gap-1.5">
            <span className="block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-medium">Active</span>
          </div>
        </div>

        {/* Capabilities list */}
        <div className="px-5 py-4 space-y-4">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {/* Icon */}
              <div
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-sm"
                style={{ color: cap.color, background: `${cap.color}18` }}
              >
                {cap.icon}
              </div>

              {/* Name + tag */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[13px] font-semibold text-white/90 truncate">
                    {cap.name}
                  </span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm shrink-0 whitespace-nowrap"
                    style={{ color: cap.color, background: `${cap.color}18` }}
                  >
                    {cap.tag.split(' · ')[0]}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: cap.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: cap.width }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 + i * 0.07 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Panel footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.07] bg-white/[0.015]">
          <span className="text-[11px] text-slate-600">Serving Africa &amp; beyond</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <span className="text-emerald-400 font-semibold">8</span>
            <span>countries</span>
          </div>
        </div>
      </div>

      {/* ── Floating metric card (bottom-left) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12, x: -8 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
        className="absolute -bottom-5 -left-6 sm:-left-10 z-10 rounded-sm border border-white/[0.1] bg-[#0d1526]/95 backdrop-blur-sm shadow-xl px-4 py-3 min-w-[140px]"
      >
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-medium">
          Client Growth
        </p>
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-nexa-heavy text-white leading-none">+34%</span>
          <span className="text-emerald-400 text-sm pb-0.5">↑ YoY</span>
        </div>
      </motion.div>

      {/* ── Floating engagement badge (top-right) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
        className="absolute -top-4 -right-4 sm:-right-6 z-10 rounded-sm border border-white/[0.1] bg-[#0d1526]/95 backdrop-blur-sm shadow-xl px-3.5 py-2.5"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#e0ae00]/15">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-[#e0ae00]" aria-hidden>
              <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.1l-3.7 2.2.7-4.1-3-2.9 4.2-.7L8 1z"
                stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-none">Verified Partner</p>
            <p className="text-slate-500 text-[10px] mt-0.5">ISO-aligned delivery</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
