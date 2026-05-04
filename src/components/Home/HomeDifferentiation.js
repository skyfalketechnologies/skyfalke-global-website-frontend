'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaChess, FaHandshake, FaRocket, FaAward } from 'react-icons/fa';

const points = [
  {
    text: 'Strategic, Not Just Technical',
    icon: FaChess,
    label: 'Chess piece metaphor for strategic thinking beyond pure implementation',
  },
  {
    text: 'All-in-One Partner',
    icon: FaHandshake,
    label: 'Handshake representing a single trusted partner across disciplines',
  },
  {
    text: 'Built for Growth',
    icon: FaRocket,
    label: 'Rocket symbolizing scalable growth orientation',
  },
  {
    text: 'Professional Execution',
    icon: FaAward,
    label: 'Award icon representing disciplined delivery quality',
  },
];

export default function HomeDifferentiation() {
  return (
    <section className="section-padding bg-[#E0AE00]" aria-labelledby="why-heading">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-black/70 mb-3">
            Our Differentiation
          </p>
          <h2 id="why-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black tracking-tight">
            Why Businesses Choose Skyfalke
          </h2>
          <p className="mt-4 text-sm sm:text-base text-black/80 leading-relaxed">
            We combine business strategy, execution discipline, creativity and scalable technology to deliver measurable outcomes.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {points.map((p, index) => {
            const Icon = p.icon;
            return (
              <motion.li
                key={p.text}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group rounded-xl border border-black/10 bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-4 p-5 sm:p-6">
                  <span
                    className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg border border-[#E0AE00]/60 bg-[#E0AE00]/15 text-black"
                    role="img"
                    aria-label={p.label}
                  >
                    <Icon aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">{p.text}</h3>
                    <p className="mt-1 text-sm text-gray-600">Designed to help you move faster with confidence and clarity.</p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
