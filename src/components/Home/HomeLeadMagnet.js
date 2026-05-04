'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useStrategyCallModal } from '@/contexts/StrategyCallModalContext';

export default function HomeLeadMagnet() {
  const { openModal } = useStrategyCallModal();

  return (
    <aside
      className="border-y border-secondary-500/30 bg-primary-600/[0.03]"
      aria-labelledby="lead-magnet-heading"
    >
      <div className="container-custom py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-5xl mx-auto">
          <div>
            <h2 id="lead-magnet-heading" className="text-lg sm:text-xl font-bold text-primary-600 tracking-tight">
              Free Business Growth Audit
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-xl">
              A structured look at your digital presence, systems, and growth levers - with practical recommendations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openModal({ intent: 'audit' })}
            className="shrink-0 inline-flex items-center justify-center px-5 py-3 bg-secondary-500 text-primary-900 font-semibold text-sm sm:text-base hover:bg-secondary-600 transition-colors whitespace-nowrap"
          >
            Get Your Free Audit Report
            <FaArrowRight className="ml-2 text-sm" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  );
}
