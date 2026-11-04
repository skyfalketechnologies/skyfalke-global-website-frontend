'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useStrategyCallModal } from '@/contexts/StrategyCallModalContext';
import useMobileDetection from '../../hooks/useMobileDetection';

const CTASection = () => {
  const { shouldAnimate } = useMobileDetection();
  const { openModal } = useStrategyCallModal();

  return (
    <section
      className="relative section-padding bg-primary-600 text-white overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2
          id="final-cta-heading"
          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-5"
        >
          Ready to Take Your Business to the Next Level?
        </motion.h2>
        <motion.p
          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-base sm:text-lg text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto"
        >
          If you&apos;re serious about growing your business, it&apos;s time to stop guessing and start building with
          the right partner.
        </motion.p>

        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mb-6"
        >
          <button
            type="button"
            onClick={() => openModal({ intent: 'strategy' })}
            className="inline-flex items-center justify-center px-6 py-3.5 bg-secondary-500 text-primary-900 font-semibold text-sm sm:text-base hover:bg-secondary-600 transition-colors"
          >
            Book a Free Strategy Call
            <FaArrowRight className="ml-2 text-sm" aria-hidden />
          </button>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3.5 border border-white/40 text-white font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors"
          >
            Talk to an Expert
            <FaArrowRight className="ml-2 text-sm opacity-80" aria-hidden />
          </Link>
        </motion.div>

        <p className="text-sm text-white/75">No pressure. Just clarity on your next steps.</p>
      </div>
    </section>
  );
};

export default CTASection;
