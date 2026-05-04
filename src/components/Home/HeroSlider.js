'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useStrategyCallModal } from '@/contexts/StrategyCallModalContext';
import HomeDashboardMockup from './HomeDashboardMockup';

const HeroSlider = () => {
  const { openModal } = useStrategyCallModal();

  return (
    <section
      className="relative min-h-[min(100vh,880px)] flex items-center pt-24 pb-16 md:pt-28 md:pb-20 bg-[#fafbfc] border-b border-gray-200/80"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.35]" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(#e8eaf2 1px, transparent 1px), linear-gradient(90deg, #e8eaf2 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 text-left">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primary-600/90 mb-4">
              Digital growth partner
            </p>
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold text-primary-600 tracking-tight leading-[1.12] mb-5"
            >
              Turn Your Business Into a High-Performing Digital Asset
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mb-4">
              We help growth-focused businesses build powerful online presence, streamline operations, and scale
              revenue through strategic technology.
            </p>
            <p className="text-sm text-gray-500 max-w-lg mb-8 leading-relaxed">
              No guesswork. No fragmented vendors. Just a clear path to growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => openModal({ intent: 'strategy' })}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-primary-600 text-white font-semibold text-sm sm:text-base tracking-tight hover:bg-primary-700 transition-colors border border-primary-600"
              >
                Book a Free Strategy Call
                <FaArrowRight className="ml-2 text-sm shrink-0" aria-hidden />
              </button>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-primary-600/25 text-primary-600 font-semibold text-sm sm:text-base bg-white hover:border-primary-600/40 hover:bg-white transition-colors"
              >
                See How It Works
                <FaArrowRight className="ml-2 text-sm opacity-70 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HomeDashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
