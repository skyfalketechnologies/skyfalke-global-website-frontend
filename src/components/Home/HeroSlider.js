'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useStrategyCallModal } from '@/contexts/StrategyCallModalContext';

const SERIF = "[font-family:Georgia,'Times_New_Roman',serif]";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSlider() {
  const { openModal } = useStrategyCallModal();

  return (
    <section className="bg-white" aria-labelledby="hero-heading">
      {/* Full-bleed photograph with copy */}
      <div className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#0B1220] pt-32 pb-14 md:pb-20">
        <Image
          src="/images/hero/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[68%_center]"
        />
        {/* Even tint on small screens, where copy spans the full width; left-to-right fade on desktop */}
        <div
          className="absolute inset-0 -z-10 bg-[#0B1220]/75 lg:bg-transparent lg:bg-[linear-gradient(to_right,rgba(11,18,32,0.94)_0%,rgba(11,18,32,0.86)_38%,rgba(11,18,32,0.35)_66%,rgba(11,18,32,0.05)_100%)]"
          aria-hidden
        />

        {/* Keeps the transparent header legible over the bright ceiling */}
        <div
          className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#0B1220]/80 to-transparent"
          aria-hidden
        />

        <div className="container-custom w-full">
          <motion.div className="max-w-xl" variants={stagger} initial="hidden" animate="show">
            <motion.p
              variants={fadeUp}
              className="mb-6 border-l-2 border-[#e0ae00] pl-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white"
            >
              Digital Growth Partner
            </motion.p>

            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              className={`${SERIF} mb-6 text-[2.75rem] font-normal leading-[1.08] tracking-[-0.01em] text-white sm:text-6xl lg:text-[4.25rem]`}
            >
              Reinvent What&apos;s Possible for Your Business
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mb-9 max-w-[32rem] text-base leading-relaxed text-white/85 sm:text-lg"
            >
              We help ambitious organisations modernise technology, accelerate revenue,
              and operate at higher efficiency - with one accountable partner across
              strategy and delivery.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8"
            >
              <button
                type="button"
                onClick={() => openModal({ intent: 'strategy' })}
                className="group inline-flex items-center justify-center gap-2 bg-[#e0ae00] px-7 py-3.5 text-sm font-semibold tracking-tight text-[#0B1220] transition-colors hover:bg-[#c99d00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-[#b38b00]"
              >
                Talk to Our Team
                <FaArrowRight className="shrink-0 text-xs transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
              <Link
                href="/how-we-work"
                className="group inline-flex items-center gap-2 border-b border-white/50 pb-1 text-sm font-semibold tracking-tight text-white transition-colors hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                View Our Work
                <FaArrowRight className="shrink-0 text-xs transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
