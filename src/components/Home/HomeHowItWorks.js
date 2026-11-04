'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCogs, FaChartBar, FaArrowRight } from 'react-icons/fa';
import { useStrategyCallModal } from '@/contexts/StrategyCallModalContext';

const steps = [
  {
    title: 'Strategy First',
    body: 'Business audit + roadmap',
    icon: FaBriefcase,
    iconLabel: 'Briefcase icon representing strategic business planning',
  },
  {
    title: 'Build & Optimize',
    body: 'Website, systems, automation',
    icon: FaCogs,
    iconLabel: 'Cogs icon representing implementation and optimization',
  },
  {
    title: 'Scale & Improve',
    body: 'Continuous growth optimisation',
    icon: FaChartBar,
    iconLabel: 'Bar chart icon representing scalable business growth',
  },
];

export default function HomeHowItWorks() {
  const { openModal } = useStrategyCallModal();

  return (
    <section
      id="how-it-works"
      className="section-padding bg-[#8f7622] border-b border-[#7a651d]"
      aria-labelledby="how-heading"
    >
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
            The Clear Skyfalke Process To Growth
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="text-center md:text-left border-t-2 border-white/70 pt-6"
              >
                <div
                  className="w-11 h-11 mb-4 mx-auto md:mx-0 flex items-center justify-center rounded-sm bg-white border border-white/60 text-[#8f7622]"
                  role="img"
                  aria-label={step.iconLabel}
                >
                  <Icon aria-hidden />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-1">
                  Step {index + 1}
                </p>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">{step.body}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => openModal({ intent: 'strategy' })}
            className="inline-flex items-center justify-center px-6 py-3.5 bg-primary-600 text-white font-semibold text-sm sm:text-base hover:bg-primary-700 transition-colors"
          >
            Book Your Free Consultation
            <FaArrowRight className="ml-2 text-sm" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
