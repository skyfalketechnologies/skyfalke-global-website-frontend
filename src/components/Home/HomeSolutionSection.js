'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import {
  HiOutlineGlobeAlt,
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlineCpuChip,
} from 'react-icons/hi2';
import { useStrategyCallModal } from '@/contexts/StrategyCallModalContext';

const SOLUTION_SECTION_IMAGE =
  'https://ik.imagekit.io/g3nahgeeu/software-icons.webp';

const bullets = [
  {
    line: 'Build a strong, credible online presence',
    Icon: HiOutlineGlobeAlt,
  },
  {
    line: 'Attract and convert high-quality customers',
    Icon: HiOutlineUserGroup,
  },
  {
    line: 'Streamline operations with smart systems',
    Icon: HiOutlineCog6Tooth,
  },
  {
    line: 'Implement modern tools (including AI)',
    Icon: HiOutlineCpuChip,
  },
];

export default function HomeSolutionSection() {
  const { openModal } = useStrategyCallModal();

  return (
    <section className="section-padding bg-[#fafbfc] border-b border-gray-100" aria-labelledby="solution-heading">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="order-2 lg:order-1 relative rounded-sm overflow-hidden shadow-[0_20px_50px_-20px_rgba(48,54,97,0.25)] border border-gray-200/80 aspect-[4/3] bg-gray-100"
          >
            <img
              src={SOLUTION_SECTION_IMAGE}
              alt="Skyfalke team and digital workspace representing integrated growth systems"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width={960}
              height={720}
            />
            <div
              className="absolute inset-0 bg-gradient-to-tr from-[#303661]/20 via-transparent to-transparent pointer-events-none"
              aria-hidden
            />
          </motion.div>
          <div className="order-1 lg:order-2">
            <h2
              id="solution-heading"
              className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-primary-600 tracking-tight leading-snug mb-6"
            >
              We Don&apos;t Just Build Systems - We Build Growth Engines
            </h2>
            <ul className="space-y-4 mb-8">
              {bullets.map(({ line, Icon }) => (
                <li key={line} className="flex gap-4 text-gray-700 text-base sm:text-lg leading-relaxed">
                  <span
                    className="mt-0.5 shrink-0 flex h-10 w-10 items-center justify-center rounded-sm border border-gray-200 bg-white text-[#303661] shadow-sm"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="pt-1.5">{line}</span>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <button
                type="button"
                onClick={() => openModal({ intent: 'strategy' })}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-secondary-500 text-primary-900 font-semibold text-sm sm:text-base hover:bg-secondary-600 transition-colors"
              >
                Start Your Growth Journey
                <FaArrowRight className="ml-2 text-sm" aria-hidden />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
